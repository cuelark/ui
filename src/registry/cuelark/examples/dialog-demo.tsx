import { Button } from "@/registry/cuelark/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/cuelark/ui/dialog";
import { Input } from "@/registry/cuelark/ui/input";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit profile</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are visible to your team right away.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
          <label className="grid gap-1.5 text-sm font-medium">
            Name
            <Input defaultValue="Ada Lovelace" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Handle
            <Input defaultValue="ada" leading="@" />
          </label>
        </form>
        <DialogFooter divided>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
