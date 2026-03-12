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
    a: "PageFrame runs a server-side Chromium session, waits for the page to settle, and exports the result in the format and viewport you selected.",
  },
  {
    q: "Can I capture different devices at once?",
    a: "Yes. The main flow is built around queuing several viewport presets in the same run so you do not have to repeat the setup manually.",
  },
  {
    q: "Can I clean up popups and banners first?",
    a: "Yes. Cookie banners, chat widgets, popups, and similar UI noise can be hidden before capture.",
  },
  {
    q: "Is there an API?",
    a: "Yes. Agency accounts can create captures programmatically, which is useful when screenshots become part of release or reporting workflows.",
  },
  {
    q: "Can I cancel my subscription any time?",
    a: "Yes. Billing is self-serve, so upgrades, downgrades, and cancellations do not require contacting support.",
  },
];

const FAQSection = () => (
  <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <div className="mb-4 inline-flex rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
          FAQ
        </div>
        <h2 className="font-display text-4xl md:text-5xl">Common questions, answered directly.</h2>
      </motion.div>

      <div className="panel p-4 sm:p-6">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`} className="rounded-[22px] border border-border/70 bg-white/75 px-5">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FAQSection;
