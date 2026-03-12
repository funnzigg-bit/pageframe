import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, PLAN_TIERS } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    key: "free",
    price: "$0",
    period: "forever",
    description: "Enough to try the workflow and keep a personal capture habit going.",
    features: [
      "10 screenshots per day",
      "1x resolution",
      "Standard capture",
      "PNG and JPG export",
      "Basic history",
    ],
    cta: "Start free",
    variant: "brand-outline" as const,
    popular: false,
    priceId: null,
  },
  {
    name: "Pro",
    key: "pro",
    price: "$4.99",
    period: "/month",
    description: "Built for freelancers, designers, and developers who ship often.",
    features: [
      "100 screenshots per day",
      "2x and 3x resolution",
      "Full-page screenshots",
      "All device presets",
      "Element hiding",
      "Shareable links",
      "PNG, JPG, WebP, and PDF",
    ],
    cta: "Upgrade to Pro",
    variant: "brand" as const,
    popular: true,
    priceId: PLAN_TIERS.pro.price_id,
  },
  {
    name: "Agency",
    key: "agency",
    price: "$39.99",
    period: "/month",
    description: "For teams that need repeatable output, API access, and less manual handling.",
    features: [
      "Unlimited screenshots",
      "Team members",
      "REST API access",
      "White-label exports",
      "Priority queue",
      "Projects and folders",
      "Custom branding",
    ],
    cta: "Upgrade to Agency",
    variant: "brand-outline" as const,
    popular: false,
    priceId: PLAN_TIERS.agency.price_id,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();
  const { user, plan: currentPlan } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planKey: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!priceId || planKey === "free") return;

    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl panel overflow-hidden">
        <div className="bg-brand-gradient-subtle grid gap-10 px-6 py-12 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-sm text-muted-foreground">
              Pricing
            </div>
            <h2 className="font-display text-4xl md:text-5xl">Simple pricing, with enough room to scale.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The free tier proves the workflow. Pro removes the quality limits. Agency is for teams that need capture to behave like infrastructure.
            </p>
          </motion.div>

          <div className="grid gap-5 xl:grid-cols-3">
            {plans.map((plan, i) => {
              const isCurrentPlan = currentPlan === plan.key;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-[28px] border p-7 ${
                    plan.popular
                      ? "border-primary/30 bg-slate-950 text-white shadow-brand-lg"
                      : "border-border/80 bg-card/95"
                  }`}
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl">{plan.name}</h3>
                      <p className={`mt-2 text-sm leading-6 ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>
                        {plan.description}
                      </p>
                    </div>
                    {plan.popular && (
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        Popular
                      </div>
                    )}
                    {isCurrentPlan && !plan.popular && (
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Current
                      </div>
                    )}
                  </div>

                  <div className="mb-8 flex items-end gap-1">
                    <span className="font-display text-5xl">{plan.price}</span>
                    <span className={plan.popular ? "text-white/70" : "text-muted-foreground"}>{plan.period}</span>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className={`rounded-full p-1 ${plan.popular ? "bg-white/10" : "bg-primary/10"}`}>
                          <Check className={`h-3.5 w-3.5 ${plan.popular ? "text-accent" : "text-primary"}`} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.variant}
                    className={`mt-auto w-full ${plan.popular ? "border-white/15 bg-white text-slate-950 hover:bg-white/90" : ""}`}
                    size="lg"
                    disabled={isCurrentPlan || loadingPlan === plan.key}
                    onClick={() => handleSubscribe(plan.priceId, plan.key)}
                  >
                    {loadingPlan === plan.key && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCurrentPlan ? "Current Plan" : plan.cta}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
