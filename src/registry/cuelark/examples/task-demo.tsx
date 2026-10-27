import { Task } from "@/registry/cuelark/ui/task";

export default function TaskDemo() {
  return (
    <Task
      className="w-full max-w-md"
      title="Migrate invoices to the new tax rule"
      items={[
        { label: "Write the shared tax helper", status: "done" },
        { label: "Switch the API to the helper", status: "done" },
        { label: "Switch the PDF renderer", status: "active" },
        { label: "Backfill invoices from this month", status: "todo" },
      ]}
    />
  );
}
