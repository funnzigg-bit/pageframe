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
    description: "A straightforward place to try the workflow.",
    features: ["10 screenshots per day", "1x resolution", "PNG and JPG export", "Basic history"],
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
    description: "For people shipping screenshots regularly.",
    features: ["100 screenshots per day", "2x and 3x resolution", "Full-page screenshots", "Element hiding", "Mockups and share links"],
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
    description: "For teams using capture as part of delivery.",
    features: ["Unlimited screenshots", "Team members", "REST API access", "Priority queue", "Projects and branding"],
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout";
      toast.error(message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            Pricing
          </div>
          <h2 className="font-display text-4xl md:text-5xl">Simple tiers, aimed at real usage.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Start free, upgrade when screenshots become part of the routine, and move to Agency when capture needs to fit a team workflow.
          </p>
        </motion.div>

        <div className="grid gap-5 xl:grid-cols-3">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.key;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`relative flex flex-col rounded-[30px] border p-8 ${
                  plan.popular ? "border-primary/25 bg-[#09122e] text-white shadow-brand-lg" : "bg-white/90"
                }`}
              >
                {plan.popular && (
                  <div className="mb-5 inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    Most popular
                  </div>
                )}
                <h3 className="font-display text-2xl">{plan.name}</h3>
                <p className={`mt-3 text-sm leading-7 ${plan.popular ? "text-white/72" : "text-muted-foreground"}`}>{plan.description}</p>

                <div className="mt-8 flex items-end gap-1">
                  <span className="font-display text-5xl">{plan.price}</span>
                  <span className={plan.popular ? "text-white/65" : "text-muted-foreground"}>{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className={`rounded-full p-1 ${plan.popular ? "bg-white/10" : "bg-primary/10"}`}>
                        <Check className={`h-3.5 w-3.5 ${plan.popular ? "text-white" : "text-primary"}`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "brand" : plan.variant}
                  size="lg"
                  className={`mt-8 w-full ${plan.popular ? "bg-white text-[#09122e] hover:bg-white/92" : ""}`}
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
    </section>
  );
};

export default PricingSection;
