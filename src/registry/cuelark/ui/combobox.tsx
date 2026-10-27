"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/cuelark/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/cuelark/ui/popover";
import { cn } from "@/lib/utils";

type ComboboxOption = { value: string; label: string; keywords?: string[]; disabled?: boolean };

type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

/** A searchable select: a popover trigger plus a filtered command list with a gliding highlight. */
function Combobox({
  options,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results.",
  disabled,
  className,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const selected = options.find((o) => o.value === current);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={props["aria-label"]}
          disabled={disabled}
          data-slot="combobox-trigger"
          className={cn(
            "flex h-ctl-md w-56 items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-sm shadow-control outline-none transition-[border-color,box-shadow] duration-150 ease-cue hover:border-ring/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  keywords={[o.label, ...(o.keywords ?? [])]}
                  disabled={o.disabled}
                  onSelect={(v) => {
                    const next = v === current ? "" : v;
                    setInternal(next);
                    onValueChange?.(next);
                    setOpen(false);
                  }}
                >
                  {o.label}
                  <CheckIcon className={cn("ms-auto size-4 !text-primary", o.value === current ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
