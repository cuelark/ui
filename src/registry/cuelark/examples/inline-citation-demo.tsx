import { InlineCitation } from "@/registry/cuelark/ui/inline-citation";

export default function InlineCitationDemo() {
  return (
    <p className="max-w-lg text-sm leading-relaxed">
      Tailwind v4 moves configuration into CSS with the @theme directive
      <InlineCitation index={1} source={{ title: "Tailwind CSS v4.0", url: "https://tailwindcss.com/blog/tailwindcss-v4", excerpt: "Configure your project in CSS instead of JavaScript." }} />, and every GSAP plugin
      became free for commercial use in version 3.13
      <InlineCitation index={2} source={{ title: "GSAP is now 100% free", url: "https://gsap.com/blog/3-13", excerpt: "All of GSAP, including the bonus plugins, is free for everyone." }} />.
    </p>
  );
}
