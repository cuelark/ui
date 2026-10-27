import { Alert, AlertDescription, AlertTitle } from "@/registry/cuelark/ui/alert";

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert tone="info">
        <AlertTitle>New version available</AlertTitle>
        <AlertDescription>Cuelark UI 1.1 adds motion tokens. Re-run the CLI to update.</AlertDescription>
      </Alert>
      <Alert tone="success" onDismiss={() => {}}>
        <AlertTitle>Domain verified</AlertTitle>
        <AlertDescription>ui.cuelark.com is now serving over HTTPS.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>Usage at 90%</AlertTitle>
        <AlertDescription>Upgrade before the 30th to avoid throttling.</AlertDescription>
      </Alert>
      <Alert tone="destructive">
        <AlertTitle>Build failed</AlertTitle>
        <AlertDescription>Type error in src/routes/index.tsx on line 42.</AlertDescription>
      </Alert>
    </div>
  );
}
