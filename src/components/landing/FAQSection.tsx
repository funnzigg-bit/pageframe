import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "How does PageFrame capture screenshots?",
    a: "PageFrame runs a server-side Chromium session, renders the target page, waits for the UI to settle, and then exports the final image in the format you selected.",
  },
  {
    q: "Can I capture pages behind authentication?",
    a: "Not yet. The current flow is designed for public pages, although authenticated sessions and cookie injection are a clear next step for product teams.",
  },
  {
    q: "What devices are supported?",
    a: "The preset list covers common desktop, iPhone, Pixel, and iPad sizes in both portrait and landscape. The dashboard is structured around selecting several at once.",
  },
  {
    q: "How do shareable links work?",
    a: "Each screenshot can be exposed through a public link, with controls for expiry, password protection, and download behavior depending on the plan.",
  },
  {
    q: "Is there an API?",
    a: "Yes. Agency accounts can create captures programmatically using API keys so screenshots can slot into release workflows and internal tooling.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Billing changes are self-serve, so upgrades, downgrades, and cancellations do not require manual support intervention.",
  },
];

const FAQSection = () => (
  <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.999, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground">
          FAQ
        </div>
        <h2 className="font-display text-4xl md:text-5xl">Questions people ask before they trust a capture tool.</h2>
        <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
          The product is straightforward, but these are the details that usually decide whether it earns a place in the workflow.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="panel p-4 sm:p-6"
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${i}`}
              className="rounded-[22px] border border-border/70 bg-background/70 px-5"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
