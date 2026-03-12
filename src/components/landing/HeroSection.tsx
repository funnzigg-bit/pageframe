import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, Monitor, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pageframeLogo from "@/assets/pageframe-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-5">
        <button className="flex items-center gap-3" onClick={() => navigate("/")}>
          <img src={pageframeLogo} alt="PageFrame" className="h-8" />
          <span className="hidden text-sm font-semibold tracking-[0.18em] text-muted-foreground sm:inline-block">SCREENSHOT STUDIO</span>
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
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((current) => !current)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
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
  { value: "8+", label: "device presets" },
  { value: "4", label: "export formats" },
  { value: "<1 min", label: "to usable asset" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
      <div className="bg-hero-mesh absolute inset-0" />
      <div className="absolute left-[10%] top-24 h-56 w-56 rounded-full bg-brand-cyan/10 blur-3xl" />
      <div className="absolute right-[8%] top-12 h-72 w-72 rounded-full bg-brand-purple/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Clean screenshots, mockups, and handoff assets
            </div>

            <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Website screenshots that already
              <span className="text-gradient"> look presentable</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              PageFrame captures your page in a real browser, handles the messy UI cleanup, and gives you exports and mockups that are ready for clients, launch notes, and social posts.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button variant="brand" size="xl" onClick={() => navigate("/auth")}>
                Start free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="brand-outline" size="xl" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                See the workflow
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3 shadow-sm">
                  <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="panel overflow-hidden p-4 sm:p-6">
              <div className="rounded-[26px] border border-[#0b1537]/10 bg-[#071434] p-5 text-white shadow-brand-lg">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/35" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/18" />
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    pageframe.app
                  </div>
                </div>

                <div className="mt-6 rounded-[22px] bg-white/6 p-5">
                  <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[22px] bg-white/95 p-4 text-slate-900">
                      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Monitor className="h-4 w-4 text-primary" />
                        Capture preview
                      </div>
                      <div className="h-48 rounded-[20px] bg-[linear-gradient(145deg,#eff5ff_0%,#dfe8ff_42%,#e9dfff_100%)] p-4">
                        <div className="h-3 w-24 rounded-full bg-primary/20" />
                        <div className="mt-2 h-3 w-40 rounded-full bg-primary/10" />
                        <div className="mt-5 grid gap-3">
                          <div className="h-24 rounded-[18px] bg-[linear-gradient(135deg,#00c9ff_0%,#2b61ff_48%,#9738ff_100%)] opacity-90" />
                          <div className="grid grid-cols-3 gap-3">
                            <div className="h-14 rounded-2xl bg-slate-100" />
                            <div className="h-14 rounded-2xl bg-slate-100" />
                            <div className="h-14 rounded-2xl bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold">Capture once</div>
                        <div className="mt-1 text-sm text-white/70">Queue desktop, tablet, and mobile versions in one run.</div>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold">Clean the noise</div>
                        <div className="mt-1 text-sm text-white/70">Hide banners, popups, and sticky chrome before export.</div>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold">Present the result</div>
                        <div className="mt-1 text-sm text-white/70">Turn the screenshot into a polished mockup without leaving the app.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Navbar, Hero };
