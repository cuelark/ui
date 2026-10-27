import { Sources } from "@/registry/cuelark/ui/sources";

const sources = [
  { title: "Responsive design · Tailwind CSS", url: "https://tailwindcss.com/docs/responsive-design" },
  { title: "Dialog · Radix Primitives", url: "https://www.radix-ui.com/primitives/docs/components/dialog" },
  { title: "ScrollTrigger · GSAP Docs", url: "https://gsap.com/docs/v3/Plugins/ScrollTrigger" },
  { title: "Registry · shadcn/ui", url: "https://ui.shadcn.com/docs/registry" },
  { title: "Prefers reduced motion · MDN", url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion" },
];

export default function SourcesDemo() {
  return <Sources sources={sources} className="w-full max-w-xl" />;
}
