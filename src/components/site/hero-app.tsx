import * as React from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3Icon, BellIcon, FolderIcon, HomeIcon, InboxIcon, PlusIcon, SearchIcon, SettingsIcon, UsersIcon } from "lucide-react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/cuelark/ui/avatar";
import { Badge } from "@/registry/cuelark/ui/badge";
import { Button } from "@/registry/cuelark/ui/button";
import { Input } from "@/registry/cuelark/ui/input";
import { NumberTicker } from "@/registry/cuelark/ui/number-ticker";
import { Progress } from "@/registry/cuelark/ui/progress";
import { Switch } from "@/registry/cuelark/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/cuelark/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { icon: HomeIcon, label: "Overview", active: true },
  { icon: InboxIcon, label: "Inbox", count: 12 },
  { icon: BarChart3Icon, label: "Analytics" },
  { icon: FolderIcon, label: "Projects" },
  { icon: UsersIcon, label: "Team" },
  { icon: SettingsIcon, label: "Settings" },
];

const STATS = [
  { label: "Revenue", value: 48250, format: { style: "currency", currency: "USD", maximumFractionDigits: 0 } as Intl.NumberFormatOptions, delta: "+12.4%" },
  { label: "Active users", value: 3840, format: {}, delta: "+8.1%" },
  { label: "Conversion", value: 4.7, format: { minimumFractionDigits: 1 }, delta: "+0.6%" },
];

const DEPLOYS = [
  { name: "web", branch: "main", status: "Ready", time: "2m" },
  { name: "api", branch: "feat/search", status: "Building", time: "now" },
  { name: "docs", branch: "main", status: "Ready", time: "1h" },
];

/** A small real app assembled from the library, shown in the hero. It tilts back and flattens as you scroll in. */
export function HeroApp() {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const frame = ref.current;
      if (!frame) return;
      const scale = motionScale(frame);
      if (!scale) return;
      gsap.fromTo(
        frame,
        { rotateX: 14 * Math.min(scale, 1.5), scale: 0.94, y: 24 },
        { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: frame, start: "top 95%", end: "top 35%", scrub: 0.5 } },
      );
    },
    { scope: ref },
  );

  return (
    <div className="[perspective:1600px]">
      <div
        ref={ref}
        className="relative origin-top overflow-hidden rounded-2xl bg-background text-left shadow-[0_0_0_1px_var(--border),0_30px_80px_-30px_var(--cl-shade),0_12px_30px_-20px_var(--cl-shade)] will-change-transform"
      >
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="mx-auto rounded-md bg-background px-3 py-0.5 font-mono text-[0.6875rem] text-muted-foreground shadow-[0_0_0_1px_var(--border)]">app.acme.com</span>
        </div>
        <div className="grid min-h-[30rem] grid-cols-1 md:grid-cols-[13rem_1fr]">
          <aside className="hidden flex-col gap-1 border-e border-border bg-muted/30 p-3 md:flex">
            <div className="mb-3 flex items-center gap-2 px-2 pt-1 text-sm font-semibold">
              <span className="grid size-6 place-items-center rounded-md bg-foreground font-mono text-[0.625rem] text-background">A</span>
              Acme Inc.
            </div>
            {NAV.map(({ icon: Icon, label, active, count }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm ${active ? "bg-background font-medium text-foreground shadow-[0_0_0_1px_var(--border),0_1px_2px_var(--cl-shade)]" : "text-muted-foreground"}`}
              >
                <Icon className="size-4" />
                {label}
                {count && (
                  <Badge size="sm" mono className="ms-auto">
                    {count}
                  </Badge>
                )}
              </div>
            ))}
            <div className="mt-auto grid gap-2 rounded-lg border border-dashed border-border p-3">
              <span className="text-xs font-medium">Storage</span>
              <Progress value={68} size="sm" aria-label="Storage used" />
              <span className="font-mono text-[0.6875rem] text-muted-foreground">6.8 of 10 GB</span>
            </div>
          </aside>
          <div className="grid content-start gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid gap-0.5">
                <span className="cue-label">Overview</span>
                <span className="text-lg font-semibold tracking-tight">Good morning, Ada</span>
              </div>
              <div className="ms-auto flex items-center gap-2">
                <Input size="sm" aria-label="Search" placeholder="Search…" leading={<SearchIcon />} trailing={<kbd className="cue-kbd">⌘K</kbd>} className="hidden w-52 sm:flex" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon-sm" aria-label="Notifications">
                      <BellIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent kbd="N">Notifications</TooltipContent>
                </Tooltip>
                <Button size="sm">
                  <PlusIcon /> New project
                </Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.label} className="grid gap-2 rounded-xl border border-border bg-card p-4">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <div className="flex items-end justify-between">
                    <NumberTicker value={s.value} format={s.format} className="text-2xl font-semibold tracking-tight" />
                    <span className="font-mono text-xs text-success">{s.delta}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card">
              <Tabs defaultValue="deploys" className="gap-0">
                <div className="flex items-center justify-between border-b border-border px-4">
                  <TabsList variant="underline" className="h-11 border-0">
                    <TabsTrigger value="deploys">Deployments</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Auto-deploy <Switch size="sm" defaultChecked />
                  </label>
                </div>
                <TabsContent value="deploys">
                  <ul className="divide-y divide-border">
                    {DEPLOYS.map((d) => (
                      <li key={d.name} className="flex items-center gap-3 px-4 py-3 text-sm">
                        <span className="font-medium">{d.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{d.branch}</span>
                        <Badge size="sm" variant={d.status === "Ready" ? "success" : "warning"} dot={d.status === "Ready" ? true : "pulse"} className="ms-auto">
                          {d.status}
                        </Badge>
                        <span className="w-10 text-right font-mono text-xs text-muted-foreground">{d.time}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="team" className="flex items-center justify-between p-4">
                  <AvatarGroup max={4}>
                    {["Ada Lovelace", "Grace Hopper", "Alan Turing", "Linus Torvalds", "Katherine Johnson"].map((n) => (
                      <Avatar key={n} size="sm">
                        <AvatarFallback name={n} />
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Button variant="secondary" size="sm">
                    Invite
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
