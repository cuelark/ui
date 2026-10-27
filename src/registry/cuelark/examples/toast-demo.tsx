import { Button } from "@/registry/cuelark/ui/button";
import { Toaster, toast } from "@/registry/cuelark/ui/toast";

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="secondary" onClick={() => toast("Draft saved", { description: "Synced to all your devices." })}>
        Default
      </Button>
      <Button variant="secondary" onClick={() => toast.success("Deployed to production", { action: { label: "View", onClick: () => {} } })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.error("Payment failed", { description: "Your card was declined." })}>
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.promise(new Promise((r) => setTimeout(r, 1800)), { loading: "Uploading 3 files…", success: "Upload complete", error: "Upload failed" })}
      >
        Promise
      </Button>
      <Toaster />
    </div>
  );
}
