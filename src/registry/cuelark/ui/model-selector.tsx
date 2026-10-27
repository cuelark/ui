"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/cuelark/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/cuelark/ui/popover";
import { cn } from "@/lib/utils";

type Model = { id: string; name: string; provider: string; context?: string; tags?: string[] };

type ModelSelectorProps = {
  models: Model[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
};

const tint = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

function ProviderMark({ provider }: { provider: string }) {
  const h = tint(provider);
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-md text-[0.625rem] font-semibold" style={{ background: `oklch(0.92 0.05 ${h})`, color: `oklch(0.38 0.1 ${h})` }}>
      {provider[0]}
    </span>
  );
}

/**
 * Pick the model for the next message. The compact pill fits a composer toolbar; the list searches by name,
 * provider or tag and shows context size and capabilities at a glance, grouped by provider.
 */
function ModelSelector({ models, value, defaultValue, onValueChange, className }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? models[0]?.id);
  const current = models.find((m) => m.id === (value ?? internal));
  const providers = [...new Set(models.map((m) => m.provider))];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Model: ${current?.name ?? "none"}`}
          className={cn("flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-muted data-[state=open]:text-foreground", className)}
        >
          {current && <ProviderMark provider={current.provider} />}
          <span className="font-medium">{current?.name ?? "Model"}</span>
          <ChevronDownIcon className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Search models…" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            {providers.map((p) => (
              <CommandGroup key={p} heading={p}>
                {models
                  .filter((m) => m.provider === p)
                  .map((m) => (
                    <CommandItem
                      key={m.id}
                      value={m.id}
                      keywords={[m.name, m.provider, ...(m.tags ?? [])]}
                      onSelect={() => {
                        setInternal(m.id);
                        onValueChange?.(m.id);
                        setOpen(false);
                      }}
                    >
                      <ProviderMark provider={m.provider} />
                      <span className="grid flex-1">
                        <span className="font-medium">{m.name}</span>
                        <span className="flex gap-1.5 text-[0.6875rem] text-muted-foreground">
                          {m.context && <span className="font-mono">{m.context}</span>}
                          {m.tags?.map((t) => (
                            <span key={t}>· {t}</span>
                          ))}
                        </span>
                      </span>
                      {m.id === current?.id && <CheckIcon className="size-4 !text-foreground" />}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ModelSelector };
export type { Model, ModelSelectorProps };
