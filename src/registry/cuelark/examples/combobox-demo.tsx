import { Combobox } from "@/registry/cuelark/ui/combobox";

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "tanstack-start", label: "TanStack Start", keywords: ["router"] },
  { value: "remix", label: "React Router" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite + React" },
  { value: "expo", label: "Expo", keywords: ["mobile", "native"] },
];

export default function ComboboxDemo() {
  return <Combobox options={frameworks} placeholder="Pick a framework" searchPlaceholder="Search frameworks…" aria-label="Framework" />;
}
