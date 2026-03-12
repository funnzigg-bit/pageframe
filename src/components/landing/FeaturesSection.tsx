import { motion } from "framer-motion";
import {
  Code2,
  EyeOff,
  ImageIcon,
  Link2,
  Maximize2,
  Monitor,
  RotateCcw,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Multi-device capture",
    description: "Desktop, tablet, and mobile presets are grouped into one capture flow instead of separate manual runs.",
  },
  {
    icon: RotateCcw,
    title: "Portrait and landscape",
    description: "Switch orientation when the layout matters and compare the result without resetting your setup.",
  },
  {
    icon: Maximize2,
    title: "Full-page output",
    description: "Create stitched captures for long product pages, docs, and audit snapshots when viewport-only is not enough.",
  },
  {
    icon: ImageIcon,
    title: "Retina exports",
    description: "Generate crisp PNG, JPG, WebP, or PDF files at 1x, 2x, or 3x for real production use.",
  },
  {
    icon: EyeOff,
    title: "UI cleanup controls",
    description: "Strip banners, chat widgets, sticky headers, and popups before they ruin otherwise useful screenshots.",
  },
  {
    icon: Link2,
    title: "Shareable results",
    description: "Turn captures into client-ready links instead of sending oversized files around by hand.",
  },
  {
    icon: Code2,
    title: "API and automation",
    description: "Slot capture jobs into review flows, release checklists, and docs pipelines when manual work stops scaling.",
  },
  {
    icon: Smartphone,
    title: "Delay and timing",
    description: "Wait for animations, lazy-loaded media, and hydration noise so the final export looks intentional.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => (
  <section id="features" className="relative py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground">
            Product capabilities
          </div>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Everything needed to make screenshot capture feel operational, not improvised.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end"
        >
          The focus is less on flashy effects and more on removing the boring cleanup work that usually happens after every browser screenshot.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={item}
            className={`panel group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand ${
              index === 0 || index === 4 ? "xl:col-span-2" : ""
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-brand">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent ml-4" />
            </div>
            <h3 className="font-display text-2xl">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
