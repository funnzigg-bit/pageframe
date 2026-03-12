import pageframeLogo from "@/assets/pageframe-logo.png";

const Footer = () => (
  <footer className="px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl rounded-[32px] border border-border/70 bg-[#09122e] px-6 py-10 text-white shadow-brand-lg lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <img src={pageframeLogo} alt="PageFrame" className="h-8" />
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/68">
            Capture once, clean the noisy parts, and turn the result into something you can actually present.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl">Product</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/68">
            <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
            <li><a href="#pricing" className="transition-colors hover:text-white">Pricing</a></li>
            <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl">Use Cases</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/68">
            <li>Launch posts</li>
            <li>Client reviews</li>
            <li>Design QA</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl">Output</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/68">
            <li>Retina exports</li>
            <li>Mockup-ready images</li>
            <li>Shareable links</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-5 text-sm text-white/52">
        © {new Date().getFullYear()} PageFrame. Screenshot capture with cleaner presentation.
      </div>
    </div>
  </footer>
);

export default Footer;
