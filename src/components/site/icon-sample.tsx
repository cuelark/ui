import { iconTitle, svgMarkup, type IconData } from "@/lib/icons";

/** A grid of real icons in the first HTML response. Selecting and copying stays in the explorer below. */
export function IconSample({ setId, icons }: { setId: string; icons: { name: string; data: IconData }[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
      {icons.map((icon) => (
        <li key={icon.name} className="grid justify-items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center">
          <span className="text-2xl text-foreground" dangerouslySetInnerHTML={{ __html: svgMarkup(icon.data) }} />
          <span className="w-full truncate text-[0.6875rem]">{iconTitle(icon.name, setId)}</span>
          <span className="w-full truncate font-mono text-[0.625rem] text-muted-foreground">{icon.name}</span>
        </li>
      ))}
    </ul>
  );
}
