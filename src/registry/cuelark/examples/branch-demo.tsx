import { Branch } from "@/registry/cuelark/ui/branch";

export default function BranchDemo() {
  return (
    <Branch
      className="w-full max-w-lg text-sm leading-relaxed"
      versions={[
        <p key="1">Move the tax rule into a helper and call it from both places.</p>,
        <p key="2">Create one tax() helper, use it in the API and the PDF renderer, and test both paths so they cannot drift again.</p>,
        <p key="3">Centralize tax in tax(): zero without a tax ID, cent-rounded otherwise. Both the API and PDFs call it; two new tests lock the behavior in.</p>,
      ]}
    />
  );
}
