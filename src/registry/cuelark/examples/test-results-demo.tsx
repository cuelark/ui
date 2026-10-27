import { TestResults } from "@/registry/cuelark/ui/test-results";

export default function TestResultsDemo() {
  return (
    <TestResults
      className="w-full max-w-lg"
      suites={[
        { name: "tax.test.ts", tests: [{ name: "returns 0 without a tax ID", status: "pass", duration: 3 }, { name: "rounds to the cent", status: "pass", duration: 2 }] },
        {
          name: "invoice.test.ts",
          tests: [
            { name: "totals include tax", status: "pass", duration: 6 },
            { name: "credit notes are negative", status: "fail", duration: 9, error: "expected -42.5 to equal -42.50\n  at invoice.test.ts:31" },
            { name: "multi-currency (pending)", status: "skip" },
          ],
        },
      ]}
    />
  );
}
