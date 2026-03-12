import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Layers3,
  List,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const devicePresets = [
  { id: "desktop-1440", label: "Desktop 1440x900", width: 1440, height: 900, icon: Monitor },
  { id: "desktop-1920", label: "Desktop 1920x1080", width: 1920, height: 1080, icon: Monitor },
  { id: "iphone15-portrait", label: "iPhone 15 Pro", width: 393, height: 852, icon: Smartphone },
  { id: "iphone15-landscape", label: "iPhone 15 Pro landscape", width: 852, height: 393, icon: Smartphone },
  { id: "pixel8-portrait", label: "Pixel 8", width: 412, height: 924, icon: Smartphone },
  { id: "pixel8-landscape", label: "Pixel 8 landscape", width: 924, height: 412, icon: Smartphone },
  { id: "ipad-portrait", label: "iPad Pro", width: 1024, height: 1366, icon: Tablet },
  { id: "ipad-landscape", label: "iPad Pro landscape", width: 1366, height: 1024, icon: Tablet },
];

interface Project {
  id: string;
  name: string;
}

const toggles = [
  { id: "cookie", label: "Hide cookie banners" },
  { id: "chat", label: "Hide chat widgets" },
  { id: "sticky", label: "Hide sticky headers" },
  { id: "popups", label: "Hide popups and modals" },
] as const;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [inputMode, setInputMode] = useState<"single" | "bulk">("single");
  const [selectedDevices, setSelectedDevices] = useState<string[]>(["desktop-1440"]);
  const [capturing, setCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState("viewport");
  const [delay, setDelay] = useState("0");
  const [scale, setScale] = useState("1");
  const [format, setFormat] = useState("png");
  const [background, setBackground] = useState("white");
  const [hideCookies, setHideCookies] = useState(false);
  const [hideChat, setHideChat] = useState(false);
  const [hideStickyHeaders, setHideStickyHeaders] = useState(false);
  const [hidePopups, setHidePopups] = useState(false);
  const [customCss, setCustomCss] = useState("");
  const [projectId, setProjectId] = useState<string>("none");
  const [projects, setProjects] = useState<Project[]>([]);
  const [captureProgress, setCaptureProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("projects").select("id, name").eq("user_id", user.id).order("name").then(({ data }) => {
      if (data) setProjects(data);
    });
  }, [user]);

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const normalizeUrl = (u: string): string => {
    u = u.trim();
    if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
    return u;
  };

  const getUrls = (): string[] => {
    if (inputMode === "single") return url.trim() ? [normalizeUrl(url)] : [];
    return bulkUrls
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .map(normalizeUrl);
  };

  const handleCapture = async () => {
    const urls = getUrls();
    if (urls.length === 0) {
      toast.error("Please enter a URL");
      return;
    }
    if (selectedDevices.length === 0) {
      toast.error("Please select at least one device");
      return;
    }

    setCapturing(true);
    const total = urls.length * selectedDevices.length;
    setCaptureProgress({ current: 0, total });

    try {
      const jobIds: string[] = [];
      let current = 0;

      for (const captureUrl of urls) {
        for (const deviceId of selectedDevices) {
          const device = devicePresets.find((d) => d.id === deviceId)!;
          const insertData: any = {
            user_id: user!.id,
            url: captureUrl,
            device_preset: deviceId,
            viewport_width: device.width,
            viewport_height: device.height,
            device_scale_factor: parseFloat(scale),
            full_page: captureMode === "fullpage",
            delay_seconds: parseInt(delay),
            output_format: format,
            background,
            hide_cookie_banners: hideCookies,
            hide_chat_widgets: hideChat,
            hide_sticky_headers: hideStickyHeaders,
            hide_popups: hidePopups,
          };
          if (projectId !== "none") insertData.project_id = projectId;
          if (customCss.trim()) insertData.custom_css = customCss.trim();

          const { data, error } = await supabase.from("capture_jobs").insert(insertData).select("id");
          if (error) throw error;
          if (data) jobIds.push(data[0].id);
          current++;
          setCaptureProgress({ current, total });
        }
      }

      toast.success(`${total} capture(s) queued`);

      const { error: fnError } = await supabase.functions.invoke("process-captures", {
        body: { job_ids: jobIds },
      });
      if (fnError) {
        toast.error("Processing failed. Check History for details.");
      } else {
        toast.success("Captures completed");
      }
      navigate("/history");
    } catch (err: any) {
      toast.error(err.message || "Failed to create capture job");
    } finally {
      setCapturing(false);
      setCaptureProgress(null);
    }
  };

  const urlCount = getUrls().length;
  const totalCaptures = urlCount * selectedDevices.length;
  const toggleState = [hideCookies, hideChat, hideStickyHeaders, hidePopups].filter(Boolean).length;

  return (
    <DashboardLayout active="New Capture">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="panel overflow-hidden">
            <div className="bg-brand-gradient-subtle px-6 py-7 sm:px-8">
              <div className="inline-flex rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Capture Studio
              </div>
              <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Set up a clean screenshot run.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Queue a single URL or a batch, target several devices at once, and control the cleanup rules before anything gets rendered.
              </p>
            </div>
          </section>

          <section className="panel-dark p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Current run</p>
                <p className="mt-2 text-3xl font-semibold text-white">{totalCaptures || 0}</p>
                <p className="mt-1 text-sm text-white/65">queued capture outputs</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <Camera className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">URLs</div>
                <div className="mt-2 text-lg font-semibold text-white">{urlCount || 0}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">Devices</div>
                <div className="mt-2 text-lg font-semibold text-white">{selectedDevices.length}</div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">Cleanup rules</div>
                <div className="mt-2 text-lg font-semibold text-white">{toggleState}</div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <section className="panel p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Target pages</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Switch between a single destination and a bulk queue.</p>
                </div>
                <div className="inline-flex rounded-full border border-border bg-muted/50 p-1">
                  <button
                    onClick={() => setInputMode("single")}
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${
                      inputMode === "single" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Single URL
                  </button>
                  <button
                    onClick={() => setInputMode("bulk")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                      inputMode === "bulk" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    Bulk queue
                  </button>
                </div>
              </div>

              {inputMode === "single" ? (
                <div className="flex flex-col gap-3 lg:flex-row">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-14 rounded-2xl border-border/70 bg-background/70 text-base"
                  />
                  <Button variant="brand" size="lg" className="h-14 px-8" onClick={handleCapture} disabled={capturing}>
                    {capturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                    {capturing && captureProgress ? `${captureProgress.current}/${captureProgress.total}` : "Capture now"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder={"Paste URLs, one per line:\nhttps://example.com\nhttps://another-site.com\nhttps://third-site.com"}
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    className="min-h-[160px] rounded-[24px] border-border/70 bg-background/70 font-mono text-sm"
                  />
                  <div className="flex flex-col gap-3 rounded-[24px] bg-muted/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-muted-foreground">
                      {urlCount || 0} URL{urlCount !== 1 ? "s" : ""} x {selectedDevices.length} device{selectedDevices.length !== 1 ? "s" : ""} = {totalCaptures || 0} capture{totalCaptures !== 1 ? "s" : ""}
                    </span>
                    <Button variant="brand" size="lg" className="px-8" onClick={handleCapture} disabled={capturing}>
                      {capturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                      {capturing && captureProgress ? `${captureProgress.current}/${captureProgress.total}` : "Capture all"}
                    </Button>
                  </div>
                </div>
              )}
            </section>

            <section className="panel p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Device presets</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose every viewport you want in the same run.</p>
                </div>
                <div className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                  {selectedDevices.length} selected
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {devicePresets.map((device) => {
                  const isSelected = selectedDevices.includes(device.id);
                  return (
                    <button
                      key={device.id}
                      onClick={() => toggleDevice(device.id)}
                      className={`rounded-[24px] border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary/40 bg-primary/10 shadow-[0_18px_36px_-24px_hsl(var(--primary)/0.65)]"
                          : "border-border/70 bg-background/70 hover:border-primary/20 hover:bg-muted/35"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <device.icon className="h-4 w-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="mt-4 text-sm font-semibold">{device.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{device.width} x {device.height}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="panel p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Capture controls</h2>
                <p className="mt-1 text-sm text-muted-foreground">Adjust render behavior, cleanup rules, and CSS overrides.</p>
              </div>

              <Tabs defaultValue="capture" className="space-y-5">
                <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-[20px] bg-muted/50 p-1.5">
                  <TabsTrigger value="capture" className="rounded-2xl px-4 py-2.5">Capture options</TabsTrigger>
                  <TabsTrigger value="hiding" className="rounded-2xl px-4 py-2.5">Element hiding</TabsTrigger>
                  <TabsTrigger value="css" className="rounded-2xl px-4 py-2.5">Custom CSS</TabsTrigger>
                </TabsList>

                <TabsContent value="capture" className="mt-0 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Capture mode</Label>
                    <Select value={captureMode} onValueChange={setCaptureMode}>
                      <SelectTrigger className="h-12 rounded-2xl bg-background/70"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewport">Viewport only</SelectItem>
                        <SelectItem value="fullpage">Full page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delay before capture</Label>
                    <Select value={delay} onValueChange={setDelay}>
                      <SelectTrigger className="h-12 rounded-2xl bg-background/70"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No delay</SelectItem>
                        <SelectItem value="3">3 seconds</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Resolution scale</Label>
                    <Select value={scale} onValueChange={setScale}>
                      <SelectTrigger className="h-12 rounded-2xl bg-background/70"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Output format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="h-12 rounded-2xl bg-background/70"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Background</Label>
                    <Select value={background} onValueChange={setBackground}>
                      <SelectTrigger className="h-12 rounded-2xl bg-background/70 md:w-64"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transparent">Transparent</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="hiding" className="mt-0 grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { id: "cookie", label: "Hide cookie banners", checked: hideCookies, onChange: setHideCookies },
                      { id: "chat", label: "Hide chat widgets", checked: hideChat, onChange: setHideChat },
                      { id: "sticky", label: "Hide sticky headers", checked: hideStickyHeaders, onChange: setHideStickyHeaders },
                      { id: "popups", label: "Hide popups and modals", checked: hidePopups, onChange: setHidePopups },
                    ].map((toggle) => (
                      <div key={toggle.id} className="flex items-center justify-between rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                        <Label htmlFor={toggle.id} className="cursor-pointer font-medium">{toggle.label}</Label>
                        <Switch id={toggle.id} checked={toggle.checked} onCheckedChange={toggle.onChange} />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="css" className="mt-0 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Inject CSS into the target page before capture. Useful when one stubborn component needs a specific override.
                  </p>
                  <Textarea
                    placeholder={".annoying-banner { display: none !important; }\n.hero { background: #000; }"}
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    className="min-h-[180px] rounded-[24px] border-border/70 bg-background/70 font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </section>
          </div>

          <div className="space-y-6">
            <section className="panel p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Run summary</h2>
                  <p className="text-sm text-muted-foreground">A quick check before queuing.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] bg-muted/50 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Batch size</div>
                  <div className="mt-2 text-3xl font-semibold">{totalCaptures || 0}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                    <div className="text-sm text-muted-foreground">Input mode</div>
                    <div className="mt-1 font-semibold">{inputMode === "single" ? "Single URL" : "Bulk queue"}</div>
                  </div>
                  <div className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                    <div className="text-sm text-muted-foreground">Project</div>
                    <div className="mt-1 font-semibold">
                      {projectId === "none" ? "Unassigned" : projects.find((project) => project.id === projectId)?.name || "Project selected"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel p-5 sm:p-6">
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">Assign to project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="h-12 rounded-2xl bg-background/70"><SelectValue placeholder="No project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-[24px] bg-brand-gradient-subtle px-4 py-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Queue behavior</div>
                    <div className="text-sm text-muted-foreground">Each URL is expanded across every selected device preset.</div>
                  </div>
                </div>
              </div>

              <Button variant="brand" size="lg" className="mt-5 w-full" onClick={handleCapture} disabled={capturing}>
                {capturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                {capturing && captureProgress ? `Capturing ${captureProgress.current}/${captureProgress.total}` : "Queue capture run"}
              </Button>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
