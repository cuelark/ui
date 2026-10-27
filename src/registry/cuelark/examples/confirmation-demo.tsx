import { Confirmation } from "@/registry/cuelark/ui/confirmation";

export default function ConfirmationDemo() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Confirmation title="Send the weekly report to 24 recipients?" description="The agent drafted the email from this week's dashboard." />
      <Confirmation risk="high" title="Run a command in production" description="This deletes rows and cannot be undone." command="psql $DATABASE_URL -c &quot;delete from sessions where expires_at < now()&quot;" />
    </div>
  );
}
