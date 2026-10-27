import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/cuelark/ui/avatar";

const team = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus Torvalds", "Margaret Hamilton", "Dennis Ritchie"];

export default function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-4">
        <Avatar size="sm" status="online"><AvatarFallback name="Ada Lovelace" /></Avatar>
        <Avatar status="away"><AvatarFallback name="Grace Hopper" /></Avatar>
        <Avatar size="lg" status="busy"><AvatarFallback name="Alan Turing" /></Avatar>
        <Avatar size="lg" shape="square"><AvatarFallback name="Cuelark" /></Avatar>
      </div>
      <AvatarGroup max={5}>
        {team.map((n) => (
          <Avatar key={n}>
            <AvatarFallback name={n} />
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}
