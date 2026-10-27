import { Button } from "@/registry/cuelark/ui/button";
import { Input } from "@/registry/cuelark/ui/input";
import { Label } from "@/registry/cuelark/ui/label";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/cuelark/ui/sheet";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open settings</Button>
      </SheetTrigger>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>Name, URL and default visibility.</SheetDescription>
        </SheetHeader>
        <SheetBody className="grid content-start gap-4 py-5">
          <div className="grid gap-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input id="ws-name" defaultValue="Atlas" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ws-url">URL</Label>
            <Input id="ws-url" defaultValue="atlas" leading="cuelark.com/" />
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
