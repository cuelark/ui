import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/content/site";
import { ld, seo } from "@/lib/seo";

const DESCRIPTION =
  "How the Cuelark docs and component site handles data: local theme preferences, and Minilytics in production from analytics.cuelark.com. No accounts or forms.";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy",
      description: DESCRIPTION,
      path: "/privacy",
      jsonLd: [
        ld.breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]),
      ],
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:px-6">
      <header className="grid gap-3">
        <span className="cue-label">Privacy</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy</h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          What this documentation and component site stores, what it sends, and what it does not collect.
        </p>
      </header>
      <div className="prose-cue">
        <h2>This site</h2>
        <p>
          {SITE.url.replace("https://", "")} is a static site: documentation, live component examples, an icon browser and the files the shadcn CLI downloads. There are no
          accounts and no forms that submit what you type to a server. Contact opens your email app to{" "}
          <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.
        </p>
        <p>
          The assistant in the corner matches your question against the component catalog in the browser. That text stays on your device. Search (<kbd className="cue-kbd">⌘K</kbd>) does the same.
        </p>

        <h2>Saved on your device</h2>
        <p>A few preferences are written to localStorage in your browser, and only when you use the control:</p>
        <ul>
          <li>
            <code>theme</code> is <code>light</code> or <code>dark</code>, set by the theme toggle. When it is unset, the site follows your system color scheme.
          </li>
          <li>
            <code>cuelark-theme</code> and <code>cuelark-theme-css</code> are saved when you customize the live theme. Resetting to the default theme removes both.
          </li>
        </ul>
        <p>These values are not sent to a server by this site.</p>

        <h2>Analytics</h2>
        <p>
          Production builds load <a href="https://analytics.cuelark.com/js/script.js">Minilytics</a>, a deferred script from analytics.cuelark.com, with a{" "}
          <code>data-website-id</code> attribute. Development builds do not load it. The script identifies itself as Minilytics.
        </p>
        <p>It sets two first-party cookies:</p>
        <ul>
          <li>
            <code>ml_vid</code>, a random visitor id kept for one year and refreshed when the script runs.
          </li>
          <li>
            <code>ml_sid</code>, a random session id with a sliding 30-minute lifetime.
          </li>
        </ul>
        <p>
          Both are <code>SameSite=Lax</code> and <code>Secure</code> on HTTPS, and scoped to the parent domain when the browser allows it (cuelark.com on this host). A
          short-lived <code>ml_t</code> cookie is set and deleted while the script finds that parent domain.
        </p>
        <p>
          Events go to <code>https://analytics.cuelark.com/api/event</code>. Each one includes the website id, the event type, the page URL, the two ids and the screen width.
          Query parameters named email, name, phone, password, token and similar are removed from the URL before it is sent. The first page view also includes the referrer.
          While the tab is visible, the script sends how long it has been visible. A click that leaves the parent domain is recorded as that site's origin and path.
        </p>
        <p>This site never calls Minilytics identify, so it does not send a name, an email address or an account id.</p>
        <p>
          The script does not run on localhost, when the browser reports itself as automated, or after you opt out. Open any page with <code>?ml_ignore=true</code> to opt out
          (stored as <code>ml_ignore</code> in localStorage). <code>?ml_ignore=false</code> turns collection back on.
        </p>
        <p>
          If a page contained a Dodo Payments or Stripe Payment Link, the same script would add the visitor and session ids to that link. This site does not include those
          checkout links.
        </p>

        <h2>Hosting</h2>
        <p>
          The site is served by a Cloudflare Worker. The worker configuration enables Cloudflare observability logs. This site does not copy those logs elsewhere, and it does
          not set their retention.
        </p>

        <h2>What is not collected</h2>
        <p>
          There is no sign-in, no advertising script and no cookie banner on this site. The cookie-consent component in the library is an example; its demo does not save a
          choice. Fonts are files on this site, not loaded from another host.
        </p>
        <p>
          Questions about this page: <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.
        </p>
      </div>
    </main>
  );
}
