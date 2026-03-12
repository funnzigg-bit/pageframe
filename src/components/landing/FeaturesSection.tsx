import { motion } from "framer-motion";
import { Code2, EyeOff, ImageIcon, Link2, Maximize2, Monitor } from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Batch devices in one pass",
    description: "Desktop, tablet, and mobile captures are queued together instead of pieced together manually.",
  },
  {
    icon: EyeOff,
    title: "Remove distracting UI",
    description: "Cookie banners, popups, chat widgets, and sticky headers can be suppressed before capture.",
  },
  {
    icon: Maximize2,
    title: "Viewport or full page",
    description: "Use quick viewport shots for reviews, or switch to full-page when documentation and audits need the whole page.",
  },
  {
    icon: ImageIcon,
    title: "High-quality exports",
    description: "Export at multiple scales and formats so the same capture works for docs, marketing, and handoff.",
  },
  {
    icon: Link2,
    title: "Share and compare",
    description: "Generate links, annotate outputs, and compare versions without jumping between extra tools.",
  },
  {
    icon: Code2,
    title: "Automation when needed",
    description: "Move from ad hoc captures to API-driven workflows once screenshots become part of release ops.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-3xl text-center"
      >
        <div className="mb-4 inline-flex rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
          Product capabilities
        </div>
        <h2 className="font-display text-4xl leading-tight md:text-5xl">
          The core workflow, without the visual clutter around it.
        </h2>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          PageFrame is strongest when you need a screenshot to move quickly from capture to something you can actually show.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="panel p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-brand">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-2xl">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
