import pageframeLogo from "@/assets/pageframe-logo.png";

const Footer = () => (
  <footer className="border-t border-border/70 px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl panel overflow-hidden">
      <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-10">
        <div>
          <img src={pageframeLogo} alt="PageFrame" className="h-8" />
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            Browser screenshots without the cleanup loop. Capture once, export cleanly, and hand off assets that already look reviewed.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl">Product</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
            <li><a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a></li>
            <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl">Use Cases</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Design QA</li>
            <li>Marketing assets</li>
            <li>Client sign-off</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl">Notes</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Public-page capture today</li>
            <li>Automation on Agency</li>
            <li>Exports in multiple formats</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-6 py-5 text-sm text-muted-foreground lg:px-10">
        © {new Date().getFullYear()} PageFrame. Built for cleaner screenshot workflows.
      </div>
    </div>
  </footer>
);

export default Footer;
