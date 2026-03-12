import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { toPng } from "html-to-image";
import {
  Copy,
  Download,
  FileText,
  Globe,
  Loader2,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MockupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  sourceUrl?: string;
  userId?: string;
}

type DeviceType = "macbook" | "iphone" | "ipad" | "browser";
type ShadowLevel = "none" | "soft" | "studio" | "lifted";
type CanvasRatio = "auto" | "square" | "landscape" | "portrait" | "story";

interface BgPreset {
  id: string;
  label: string;
  style: CSSProperties;
  swatch: string;
}

const devices: { id: DeviceType; label: string; icon: typeof Monitor }[] = [
  { id: "macbook", label: "MacBook", icon: Monitor },
  { id: "iphone", label: "iPhone", icon: Smartphone },
  { id: "ipad", label: "iPad", icon: Tablet },
  { id: "browser", label: "Browser", icon: Globe },
];

const deviceViewports: Record<DeviceType, { width: number; height: number }> = {
  macbook: { width: 1440, height: 900 },
  iphone: { width: 390, height: 844 },
  ipad: { width: 820, height: 1180 },
  browser: { width: 1920, height: 1080 },
};

const backgrounds: BgPreset[] = [
  {
    id: "logo-night",
    label: "Logo Night",
    style: {
      background:
        "radial-gradient(circle at 18% 18%, rgba(0,201,255,0.22), transparent 24%), radial-gradient(circle at 82% 18%, rgba(164,59,255,0.24), transparent 30%), linear-gradient(145deg, #06153a 0%, #142d78 55%, #7c2cff 100%)",
    },
    swatch: "bg-[linear-gradient(145deg,#06153a_0%,#142d78_55%,#7c2cff_100%)]",
  },
  {
    id: "logo-soft",
    label: "Logo Soft",
    style: {
      background:
        "radial-gradient(circle at top left, rgba(0,201,255,0.18), transparent 28%), radial-gradient(circle at 85% 20%, rgba(124,44,255,0.2), transparent 28%), linear-gradient(180deg, #f4f7ff 0%, #eef2ff 100%)",
    },
    swatch: "bg-[linear-gradient(145deg,#f4f7ff_0%,#eef2ff_55%,#d9d5ff_100%)] border",
  },
  {
    id: "electric",
    label: "Electric",
    style: {
      background:
        "linear-gradient(135deg, #00c9ff 0%, #2b61ff 42%, #9738ff 100%)",
    },
    swatch: "bg-[linear-gradient(135deg,#00c9ff_0%,#2b61ff_42%,#9738ff_100%)]",
  },
  {
    id: "midnight",
    label: "Midnight",
    style: {
      background:
        "linear-gradient(145deg, #040b1f 0%, #0d1c49 48%, #1b1a46 100%)",
    },
    swatch: "bg-[linear-gradient(145deg,#040b1f_0%,#0d1c49_48%,#1b1a46_100%)]",
  },
  {
    id: "violet-glow",
    label: "Violet Glow",
    style: {
      background:
        "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.14), transparent 22%), linear-gradient(135deg, #1b2366 0%, #5c2dff 55%, #ad4cff 100%)",
    },
    swatch: "bg-[linear-gradient(135deg,#1b2366_0%,#5c2dff_55%,#ad4cff_100%)]",
  },
  {
    id: "white",
    label: "White",
    style: { background: "#ffffff" },
    swatch: "bg-white border",
  },
];

const shadowStyles: Record<ShadowLevel, string> = {
  none: "none",
  soft: "0 18px 40px -20px rgba(7, 18, 52, 0.28)",
  studio: "0 28px 80px -28px rgba(7, 18, 52, 0.44)",
  lifted: "0 46px 120px -40px rgba(7, 18, 52, 0.58)",
};

const canvasRatioStyles: Record<CanvasRatio, CSSProperties> = {
  auto: { minHeight: 420, width: "100%" },
  square: { aspectRatio: "1 / 1", width: "min(100%, 760px)" },
  landscape: { aspectRatio: "16 / 10", width: "min(100%, 980px)" },
  portrait: { aspectRatio: "4 / 5", width: "min(100%, 760px)" },
  story: { aspectRatio: "9 / 16", width: "min(100%, 500px)" },
};

const deviceMaxWidths: Record<DeviceType, number> = {
  macbook: 680,
  iphone: 280,
  ipad: 420,
  browser: 760,
};

const presets = [
  {
    id: "launch",
    label: "Launch",
    description: "Strong product announcement card",
    config: { device: "macbook" as DeviceType, bgId: "logo-night", ratio: "landscape" as CanvasRatio, padding: 56, shadowLevel: "studio" as ShadowLevel },
  },
  {
    id: "social",
    label: "Social",
    description: "Square share-ready layout",
    config: { device: "browser" as DeviceType, bgId: "electric", ratio: "square" as CanvasRatio, padding: 52, shadowLevel: "lifted" as ShadowLevel },
  },
  {
    id: "story",
    label: "Story",
    description: "Vertical mobile showcase",
    config: { device: "iphone" as DeviceType, bgId: "violet-glow", ratio: "story" as CanvasRatio, padding: 36, shadowLevel: "studio" as ShadowLevel },
  },
];

interface InteractiveImageProps {
  imageUrl: string;
  zoom: number;
  panOffset: { x: number; y: number };
  onPanChange: (offset: { x: number; y: number }) => void;
  loading?: boolean;
}

const InteractiveImage = ({ imageUrl, zoom, panOffset, onPanChange, loading }: InteractiveImageProps) => {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...panOffset };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [zoom, panOffset]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    onPanChange({
      x: panStart.current.x + (e.clientX - dragStart.current.x) / zoom,
      y: panStart.current.y + (e.clientY - dragStart.current.y) / zoom,
    });
  }, [zoom, onPanChange]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-slate-950/5">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Generating device-specific capture…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ cursor: zoom > 1 ? "grab" : "default" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={imageUrl}
        alt="Screenshot"
        crossOrigin="anonymous"
        draggable={false}
        className="block h-full w-full select-none"
        style={{
          objectFit: "cover",
          objectPosition: "top center",
          transform: zoom > 1 ? `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)` : undefined,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};

const MacBookFrame = ({ children, shadow }: { children: React.ReactNode; shadow: string }) => (
  <div className="flex flex-col items-center" style={{ filter: shadow !== "none" ? `drop-shadow(${shadow})` : undefined }}>
    <div className="relative rounded-t-[18px] border-[12px] border-[#161c2b] bg-[#161c2b]">
      <div className="absolute left-1/2 top-[-7px] z-10 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#2b3243]" />
      <div className="overflow-hidden rounded-[8px] bg-black">{children}</div>
    </div>
    <div className="h-[10px] w-[18%] rounded-b-[5px] bg-gradient-to-b from-[#161c2b] to-[#20283c]" />
    <div className="h-[11px] w-[108%] rounded-b-[12px] bg-gradient-to-b from-[#d5dae4] via-[#c9cfda] to-[#b2b9c6]" />
  </div>
);

const IPhoneFrame = ({ children, shadow }: { children: React.ReactNode; shadow: string }) => (
  <div className="relative rounded-[3.2rem] bg-[#101320] p-[10px]" style={{ aspectRatio: "9 / 19.5", boxShadow: shadow !== "none" ? shadow : undefined }}>
    <div className="absolute left-[-3px] top-[24%] h-[22px] w-[3px] rounded-l-sm bg-[#1c2233]" />
    <div className="absolute left-[-3px] top-[33%] h-[30px] w-[3px] rounded-l-sm bg-[#1c2233]" />
    <div className="absolute left-[-3px] top-[42%] h-[30px] w-[3px] rounded-l-sm bg-[#1c2233]" />
    <div className="absolute right-[-3px] top-[31%] h-[40px] w-[3px] rounded-r-sm bg-[#1c2233]" />
    <div className="absolute left-1/2 top-[14px] z-10 h-[16px] w-[28%] -translate-x-1/2 rounded-full bg-black/75" />
    <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-black">{children}</div>
    <div className="absolute bottom-[7px] left-1/2 h-[4px] w-[32%] -translate-x-1/2 rounded-full bg-white/20" />
  </div>
);

const IPadFrame = ({ children, shadow }: { children: React.ReactNode; shadow: string }) => (
  <div className="relative rounded-[1.6rem] bg-[#101320] p-[10px]" style={{ aspectRatio: "3 / 4", boxShadow: shadow !== "none" ? shadow : undefined }}>
    <div className="absolute left-1/2 top-[10px] z-10 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#2d3447]" />
    <div className="h-full w-full overflow-hidden rounded-[12px] bg-black">{children}</div>
    <div className="absolute bottom-[7px] left-1/2 h-[4px] w-[18%] -translate-x-1/2 rounded-full bg-white/15" />
  </div>
);

const BrowserFrame = ({ children, shadow }: { children: React.ReactNode; shadow: string }) => (
  <div className="overflow-hidden rounded-[24px] border border-white/60 bg-white/90 backdrop-blur-sm" style={{ boxShadow: shadow !== "none" ? shadow : undefined }}>
    <div className="flex items-center gap-2 border-b border-slate-200/90 bg-slate-100/95 px-4 py-3">
      <div className="flex gap-[6px]">
        <div className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <div className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <div className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      </div>
      <div className="mx-8 flex-1 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-center text-[11px] text-slate-400">
        {`https://pageframe.app`}
      </div>
    </div>
    <div className="bg-white">{children}</div>
  </div>
);

const frameComponents: Record<DeviceType, React.FC<{ children: React.ReactNode; shadow: string }>> = {
  macbook: MacBookFrame,
  iphone: IPhoneFrame,
  ipad: IPadFrame,
  browser: BrowserFrame,
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 rounded-[24px] border border-border/70 bg-background/60 p-4">
    <Label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</Label>
    {children}
  </section>
);

const MockupDialog = ({ open, onOpenChange, imageUrl, sourceUrl, userId }: MockupDialogProps) => {
  const [device, setDevice] = useState<DeviceType>("macbook");
  const [bgId, setBgId] = useState("logo-night");
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [padding, setPadding] = useState(56);
  const [shadowLevel, setShadowLevel] = useState<ShadowLevel>("studio");
  const [ratio, setRatio] = useState<CanvasRatio>("landscape");
  const [downloading, setDownloading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [showCopy, setShowCopy] = useState(true);
  const [headline, setHeadline] = useState("Launch-ready screenshots");
  const [subheadline, setSubheadline] = useState("Turn a raw capture into a polished mockup for announcements, changelogs, and client updates.");
  const [deviceImages, setDeviceImages] = useState<Partial<Record<DeviceType, string>>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const Frame = frameComponents[device];
  const activeImage = deviceImages[device] ?? imageUrl;
  const activeBg = backgrounds.find((b) => b.id === bgId) ?? backgrounds[0];
  const shadow = shadowStyles[shadowLevel];
  const isCapturing = capturing && !deviceImages[device];

  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const resetTilt = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = presets.find((item) => item.id === presetId);
    if (!preset) return;
    setDevice(preset.config.device);
    setBgId(preset.config.bgId);
    setRatio(preset.config.ratio);
    setPadding(preset.config.padding);
    setShadowLevel(preset.config.shadowLevel);
    setRotateX(0);
    setRotateY(0);
    resetView();
    captureForDeviceRef.current?.(preset.config.device);
  }, [resetView]);

  const captureForDevice = useCallback(async (d: DeviceType) => {
    if (!sourceUrl || !userId) return;
    if (deviceImages[d]) return;

    setCapturing(true);
    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const vp = deviceViewports[d];

      const { data: job, error: insertErr } = await supabase
        .from("capture_jobs")
        .insert({
          url: sourceUrl,
          user_id: userId,
          viewport_width: vp.width,
          viewport_height: vp.height,
          device_preset: d,
          device_scale_factor: 2,
          output_format: "png",
          full_page: false,
          status: "queued",
          delay_seconds: 1,
          hide_cookie_banners: true,
          hide_chat_widgets: true,
          hide_popups: true,
          hide_sticky_headers: false,
          background: "light",
        })
        .select()
        .single();

      if (insertErr || !job) throw insertErr ?? new Error("Failed to create job");

      const { error: fnErr } = await supabase.functions.invoke("process-captures", { body: { job_ids: [job.id] } });
      if (fnErr) throw fnErr;

      const deadline = Date.now() + 30000;
      let resultUrl: string | null = null;
      while (Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (abortRef.current?.signal.aborted) return;
        const { data: updated } = await supabase.from("capture_jobs").select("status, error_message").eq("id", job.id).single();
        if (updated?.status === "completed") {
          const { data: asset } = await supabase.from("capture_assets").select("file_url").eq("job_id", job.id).single();
          resultUrl = asset?.file_url ?? null;
          break;
        }
        if (updated?.status === "failed") throw new Error(updated.error_message ?? "Capture failed");
      }

      if (resultUrl) setDeviceImages((prev) => ({ ...prev, [d]: resultUrl }));
      else toast.error("Capture timed out");
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        console.error("Mockup capture error:", err);
        toast.error("Failed to capture for this device");
      }
    } finally {
      setCapturing(false);
    }
  }, [deviceImages, sourceUrl, userId]);

  const captureForDeviceRef = useRef<typeof captureForDevice | null>(null);
  captureForDeviceRef.current = captureForDevice;

  const handleDeviceChange = useCallback((d: DeviceType) => {
    setDevice(d);
    resetView();
    captureForDevice(d);
  }, [captureForDevice, resetView]);

  useEffect(() => {
    if (open && sourceUrl && userId) {
      setDeviceImages({});
      captureForDevice("macbook");
    }
  }, [open, sourceUrl, userId, captureForDevice]);

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      setDevice("macbook");
      setBgId("logo-night");
      setRatio("landscape");
      setPadding(56);
      setShadowLevel("studio");
      setHeadline("Launch-ready screenshots");
      setSubheadline("Turn a raw capture into a polished mockup for announcements, changelogs, and client updates.");
      setShowCopy(true);
      resetView();
      resetTilt();
    }
  }, [open, resetTilt, resetView]);

  const exportCanvas = useCallback(async () => {
    if (!canvasRef.current) return null;
    return toPng(canvasRef.current, { pixelRatio: 2, cacheBust: true });
  }, []);

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const dataUrl = await exportCanvas();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = `mockup-${device}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Mockup downloaded");
    } catch {
      toast.error("Failed to export mockup");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const dataUrl = await exportCanvas();
      if (!dataUrl) return;
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !canvasRef.current) return;
    const html = `<html><head><title>Mockup</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff;padding:24px;}img,div{max-width:100%;}</style></head><body>${canvasRef.current.innerHTML}</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 bg-slate-950/80 px-4 py-3 text-white sm:px-6">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">Mockup Studio</div>
              <h2 className="font-display text-2xl">Present your capture like a finished asset</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="brand-outline" size="sm" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={handleCopyToClipboard} disabled={isCapturing}>
                <Copy className="mr-1 h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="brand-outline" size="sm" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={handleDownloadPdf} disabled={isCapturing}>
                <FileText className="mr-1 h-3.5 w-3.5" />
                PDF
              </Button>
              <Button variant="brand" size="sm" onClick={handleDownloadPng} disabled={downloading || isCapturing}>
                <Download className="mr-1 h-3.5 w-3.5" />
                {downloading ? "Exporting…" : "Download PNG"}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid h-full w-full max-w-[1600px] min-h-0 gap-6 p-4 sm:grid-cols-[340px_minmax(0,1fr)] sm:p-6">
          <aside className="min-h-0 overflow-y-auto rounded-[32px] border border-border/70 bg-card/95 p-4 shadow-2xl sm:p-5">
            <div className="space-y-4">
              <Section title="Templates">
                <div className="grid gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-left transition-colors hover:border-primary/25 hover:bg-primary/5"
                    >
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-primary" />
                        <span className="font-medium">{preset.label}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Device">
                <div className="grid grid-cols-2 gap-2">
                  {devices.map((item) => {
                    const Icon = item.icon;
                    const hasCached = !!deviceImages[item.id];
                    const active = device === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleDeviceChange(item.id)}
                        className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-sm transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "bg-muted/70 text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {hasCached && <span className={`ml-auto h-2 w-2 rounded-full ${active ? "bg-white/80" : "bg-primary"}`} />}
                      </button>
                    );
                  })}
                </div>
              </Section>

              <Section title="Canvas">
                <div className="grid grid-cols-2 gap-2">
                  {(["landscape", "square", "portrait", "story", "auto"] as CanvasRatio[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setRatio(item)}
                      className={`rounded-2xl px-3 py-2 text-sm capitalize transition-colors ${
                        ratio === item ? "bg-primary text-primary-foreground" : "bg-muted/70 hover:bg-muted"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Background">
                <div className="grid grid-cols-3 gap-2">
                  {backgrounds.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setBgId(item.id)}
                      title={item.label}
                      className={`aspect-square rounded-2xl transition-transform ${item.swatch} ${bgId === item.id ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : "hover:scale-[1.03]"}`}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Copy">
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-3 py-2">
                  <Label htmlFor="show-copy" className="text-sm font-medium">Show headline and subhead</Label>
                  <Switch id="show-copy" checked={showCopy} onCheckedChange={setShowCopy} />
                </div>
                {showCopy && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Headline</Label>
                      <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="rounded-2xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Subheadline</Label>
                      <Textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} className="min-h-[96px] rounded-2xl" />
                    </div>
                  </div>
                )}
              </Section>

              <Section title={`Padding ${padding}px`}>
                <Slider min={20} max={112} step={4} value={[padding]} onValueChange={([value]) => setPadding(value)} />
              </Section>

              <Section title={`Zoom ${zoom.toFixed(1)}x`}>
                <Slider min={1} max={3} step={0.1} value={[zoom]} onValueChange={([value]) => setZoom(value)} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{zoom > 1 ? "Drag inside the frame to reposition" : "Use zoom for tighter framing"}</span>
                  {zoom > 1 && (
                    <button onClick={resetView} className="font-medium text-primary">Reset</button>
                  )}
                </div>
              </Section>

              <Section title="Depth">
                <div className="grid grid-cols-2 gap-2">
                  {(["none", "soft", "studio", "lifted"] as ShadowLevel[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setShadowLevel(item)}
                      className={`rounded-2xl px-3 py-2 text-sm capitalize transition-colors ${
                        shadowLevel === item ? "bg-primary text-primary-foreground" : "bg-muted/70 hover:bg-muted"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Rotate X</span>
                      <span>{rotateX}°</span>
                    </div>
                    <Slider min={-20} max={20} step={1} value={[rotateX]} onValueChange={([value]) => setRotateX(value)} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Rotate Y</span>
                      <span>{rotateY}°</span>
                    </div>
                    <Slider min={-20} max={20} step={1} value={[rotateY]} onValueChange={([value]) => setRotateY(value)} />
                  </div>
                  {(rotateX !== 0 || rotateY !== 0) && (
                    <Button variant="ghost" size="sm" className="w-full" onClick={resetTilt}>
                      <RotateCcw className="mr-1 h-3.5 w-3.5" />
                      Reset tilt
                    </Button>
                  )}
                </div>
              </Section>
            </div>
          </aside>

          <main className="min-h-0 overflow-auto rounded-[32px] border border-white/10 bg-slate-950/75 p-4 shadow-2xl sm:p-6">
            <div className="flex h-full min-h-[600px] items-center justify-center">
              <div
                ref={canvasRef}
                className="relative isolate flex w-full items-center justify-center overflow-hidden rounded-[36px] border border-white/10"
                style={{
                  ...activeBg.style,
                  ...canvasRatioStyles[ratio],
                  padding: `${padding}px`,
                }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-60">
                  <div className="absolute left-[-8%] top-[-10%] h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute bottom-[-12%] right-[-8%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                </div>

                <div className={`relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center ${showCopy ? "gap-8" : "gap-0"}`}>
                  {showCopy && (
                    <div className="max-w-2xl text-center text-white">
                      <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                        PageFrame Mockup
                      </div>
                      <h3 className="font-display text-4xl leading-tight text-balance sm:text-5xl">{headline}</h3>
                      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-base">{subheadline}</p>
                    </div>
                  )}

                  <div className="w-full" style={{ perspective: "1400px", perspectiveOrigin: "center center" }}>
                    <div
                      className="mx-auto transition-transform duration-200"
                      style={{
                        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                        transformStyle: "preserve-3d",
                        maxWidth: deviceMaxWidths[device],
                      }}
                    >
                      <Frame shadow={shadow}>
                        <InteractiveImage
                          imageUrl={activeImage}
                          zoom={zoom}
                          panOffset={panOffset}
                          onPanChange={setPanOffset}
                          loading={isCapturing}
                        />
                      </Frame>
                    </div>
                  </div>
                </div>

                {sourceUrl && (
                  <div className="absolute bottom-4 left-1/2 max-w-[70%] -translate-x-1/2 rounded-full border border-white/12 bg-slate-950/30 px-4 py-2 text-center text-xs text-white/72 backdrop-blur-sm">
                    {isCapturing ? "Generating device-specific screenshot…" : sourceUrl}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MockupDialog;
