import * as React from "react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CheckIcon, HandIcon } from "lucide-react";

import { gsap, motionScale, useGSAP } from "@/lib/motion";
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/cuelark/ui/avatar";
import { Badge } from "@/registry/cuelark/ui/badge";
import { Rating } from "@/registry/cuelark/ui/rating";
import { Slider } from "@/registry/cuelark/ui/slider";
import { Switch } from "@/registry/cuelark/ui/switch";
import { cn } from "@/lib/utils";


type Piece = { id: string; pos: React.CSSProperties; depth: number; tilt: number; className?: string; children: React.ReactNode };

const chip = "rounded-2xl border border-border bg-card/90 p-3 shadow-raised backdrop-blur-md";

const PIECES: Piece[] = [
  {
    id: "switch",
    pos: { left: "2%", top: "10%" },
    depth: 0.6,
    tilt: -6,
    children: (
      <label className={cn(chip, "flex items-center gap-3 text-sm font-medium")}>
        Notifications <Switch defaultChecked />
      </label>
    ),
  },
  {
    id: "rating",
    pos: { left: "3%", top: "64%" },
    depth: 1,
    tilt: 4,
    children: (
      <div className={cn(chip, "grid gap-1.5")}>
        <span className="cue-label">Rate this</span>
        <Rating defaultValue={4} label="Rate Cuelark UI" />
      </div>
    ),
  },
  {
    id: "badge",
    pos: { left: "10%", top: "40%" },
    depth: 1.4,
    tilt: -10,
    children: (
      <Badge variant="signal" dot="pulse" className="h-8 px-3.5 text-sm shadow-raised">
        Live
      </Badge>
    ),
  },
  {
    id: "toast",
    pos: { right: "2%", top: "8%" },
    depth: 0.8,
    tilt: 5,
    children: (
      <div className={cn(chip, "flex items-center gap-2.5 pe-4 text-sm")}>
        <span className="grid size-6 place-items-center rounded-full bg-signal text-signal-foreground">
          <CheckIcon className="size-3.5" strokeWidth={3} />
        </span>
        <span className="grid">
          <span className="font-medium">Deployed</span>
          <span className="text-xs text-muted-foreground">web · 41s</span>
        </span>
      </div>
    ),
  },
  {
    id: "slider",
    pos: { right: "2%", top: "56%" },
    depth: 1.2,
    tilt: -4,
    className: "w-52",
    children: (
      <div className={cn(chip, "grid gap-2 pb-4")}>
        <span className="cue-label">Volume</span>
        <Slider defaultValue={[64]} aria-label="Volume" />
      </div>
    ),
  },
  {
    id: "kbd",
    pos: { right: "13%", top: "36%" },
    depth: 1.6,
    tilt: 12,
    children: (
      <span className="flex gap-1 rounded-xl border border-border bg-card p-1.5 shadow-raised">
        <kbd className="cue-kbd h-7 min-w-7 text-sm">⌘</kbd>
        <kbd className="cue-kbd h-7 min-w-7 text-sm">K</kbd>
      </span>
    ),
  },
  {
    id: "avatars",
    pos: { right: "7%", top: "82%" },
    depth: 0.7,
    tilt: 3,
    children: (
      <div className={cn(chip, "flex items-center gap-2 py-2 pe-3.5 text-xs text-muted-foreground")}>
        <AvatarGroup>
          {["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((n) => (
            <Avatar key={n} size="sm">
              <AvatarFallback name={n} />
            </Avatar>
          ))}
        </AvatarGroup>
        +2.4k devs
      </div>
    ),
  },
];

/**
 * Real components scattered around the hero headline. They bob gently, drift with the pointer at different
 * depths (parallax), and can be grabbed and thrown: GSAP Draggable with Inertia, bounded to the hero.
 * Controls inside stay usable: clicks on switches, sliders and stars never start a drag.
 */
export function HeroPlayground() {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      // Draggable touches the DOM when registered, so register on the client only.
      gsap.registerPlugin(Draggable, InertiaPlugin);
      const scale = motionScale(root);
      const pieces = Array.from(root.querySelectorAll<HTMLElement>("[data-piece]"));

      // Entrance: pieces settle in from slightly further away, one after another.
      gsap.fromTo(pieces, { opacity: 0, scale: 0.92, y: 16 * scale }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "cue", stagger: 0.07, delay: 0.3 });
      if (!scale) {
        pieces.forEach((p) => gsap.set(p.querySelector("[data-float]"), { rotate: Number((p.querySelector("[data-float]") as HTMLElement).dataset.tilt) }));
        return;
      }

      pieces.forEach((piece, i) => {
        const float = piece.querySelector<HTMLElement>("[data-float]")!;
        gsap.set(float, { rotate: Number(float.dataset.tilt) });
        gsap.to(float, { y: (i % 2 ? -1 : 1) * (6 + (i % 3) * 3), rotate: `+=${i % 2 ? 1.5 : -1.5}`, duration: 2.4 + (i % 4) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        Draggable.create(piece, {
          bounds: root,
          inertia: true,
          edgeResistance: 0.75,
          zIndexBoost: true,
          onPress() {
            gsap.to(float, { scale: 1.06, duration: 0.2, ease: "cue" });
          },
          onRelease() {
            gsap.to(float, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" });
          },
        });
      });

      // Parallax on a separate layer so it never fights Draggable's x/y.
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        root.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
          const d = Number(layer.dataset.depth);
          gsap.to(layer, { x: -nx * 28 * d * scale, y: -ny * 20 * d * scale, duration: 0.8, ease: "cue", overwrite: "auto" });
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="false" className="pointer-events-none absolute inset-0 hidden xl:block">
      {PIECES.map((p) => (
        <div key={p.id} data-piece className="pointer-events-auto absolute cursor-grab opacity-0 active:cursor-grabbing" style={p.pos}>
          <div data-depth={p.depth}>
            <div data-float data-tilt={p.tilt} className={p.className}>
              {p.children}
            </div>
          </div>
        </div>
      ))}
      <span className="cue-label absolute bottom-4 left-[4%] flex items-center gap-1.5">
        <HandIcon className="size-3.5" /> Everything here is live. Grab one and throw it.
      </span>
    </div>
  );
}
