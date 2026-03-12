import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Layers3, Menu, Monitor, Sparkles, Smartphone, Tablet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pageframeLogo from "@/assets/pageframe-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6">
      <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-5">
        <button className="flex items-center gap-3" onClick={() => navigate("/")}>
          <img src={pageframeLogo} alt="PageFrame" className="h-8" />
          <span className="hidden text-sm font-semibold tracking-[0.2em] text-muted-foreground sm:inline-block">
            WEBSITE CAPTURE
          </span>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log in</Button>
          <Button variant="brand" size="sm" onClick={() => navigate("/auth")}>Start free</Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-3 max-w-7xl rounded-[28px] px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-muted-foreground">Features</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-muted-foreground">Pricing</a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="py-2 text-sm text-muted-foreground">FAQ</a>
            <div className="mt-2 flex gap-2 border-t border-border pt-4">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate("/auth")}>Log in</Button>
              <Button variant="brand" size="sm" className="flex-1" onClick={() => navigate("/auth")}>Start free</Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const stats = [
  { label: "Preset sizes", value: "8+" },
  { label: "Export formats", value: "4" },
  { label: "Setup time", value: "<60s" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
      <div className="bg-hero-mesh absolute inset-0" />
      <div className="absolute left-[8%] top-32 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-[10%] top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            Cleaner screenshots for marketing, QA, and client reviews
          </div>

          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-balance md:text-7xl">
            Capture websites that
            <span className="text-gradient"> look ready to ship</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            PageFrame renders your page in real browsers, waits for unstable UI to settle, and exports polished screenshots across desktop, tablet, and mobile without the usual cleanup work.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button variant="brand" size="xl" onClick={() => navigate("/auth")}>
              Start free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="brand-outline"
              size="xl"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              See what it captures
            </Button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="panel px-4 py-5">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="panel relative overflow-hidden p-4 sm:p-6">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="rounded-full bg-muted px-4 py-1 text-xs text-muted-foreground">viewportapp.io/product</div>
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Camera className="h-3.5 w-3.5" />
                Capturing
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border border-border/70 bg-muted/40 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Responsive preview set</p>
                    <p className="text-xs text-muted-foreground">Queued once, exported everywhere</p>
                  </div>
                  <div className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-foreground">2x retina</div>
                </div>

                <div className="flex items-end justify-center gap-4 rounded-[22px] bg-card px-4 py-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-44 rounded-[20px] border border-border bg-background p-3 shadow-lg"
                  >
                    <Monitor className="mb-3 h-5 w-5 text-primary" />
                    <div className="h-2 rounded-full bg-primary/20" />
                    <div className="mt-2 h-2 w-2/3 rounded-full bg-primary/10" />
                    <div className="mt-4 grid gap-2">
                      <div className="h-24 rounded-2xl bg-brand-gradient-subtle" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 rounded-xl bg-muted" />
                        <div className="h-12 rounded-xl bg-muted" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="w-24 rounded-[22px] border border-border bg-background p-2.5 shadow-lg"
                  >
                    <Smartphone className="mx-auto mb-2 h-4 w-4 text-accent" />
                    <div className="h-1.5 rounded-full bg-accent/25" />
                    <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-accent/10" />
                    <div className="mt-3 h-28 rounded-[18px] bg-brand-gradient-subtle" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
                    className="w-32 rounded-[20px] border border-border bg-background p-3 shadow-lg"
                  >
                    <Tablet className="mb-2 h-4 w-4 text-primary" />
                    <div className="h-1.5 rounded-full bg-primary/20" />
                    <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-primary/10" />
                    <div className="mt-3 h-24 rounded-[18px] bg-brand-gradient-subtle" />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="panel-dark p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-2.5">
                      <Layers3 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Clean before export</p>
                      <p className="text-sm text-white/65">Hide popups, cookie banners, and sticky headers.</p>
                    </div>
                  </div>
                </div>

                <div className="panel p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Workflow</p>
                      <p className="text-sm text-muted-foreground">URL to final asset in one pass</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Fast queue</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {["Paste a URL", "Choose devices", "Export polished shots"].map((step, index) => (
                      <div key={step} className="flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-3 text-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background font-semibold">{index + 1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { Navbar, Hero };
