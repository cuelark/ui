import { Artifact } from "@/registry/cuelark/ui/artifact";

export default function ArtifactDemo() {
  return (
    <Artifact className="h-72 w-full max-w-lg" kind="Document" title="Q4 billing changes" onDownload={() => {}} onClose={() => {}}>
      <article className="grid gap-3 p-5 text-sm leading-relaxed">
        <h3 className="text-lg font-semibold tracking-tight">Q4 billing changes</h3>
        <p className="text-muted-foreground">Tax is now computed in one helper and applied only to customers with a tax ID. Totals match across the API and PDFs.</p>
        <ul className="grid list-disc gap-1 ps-5 text-muted-foreground">
          <li>Reverse-charge VAT for B2B customers</li>
          <li>Cent-accurate rounding</li>
          <li>22 billing tests, all passing</li>
        </ul>
      </article>
    </Artifact>
  );
}
