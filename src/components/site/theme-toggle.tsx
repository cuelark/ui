import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/registry/cuelark/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/cuelark/ui/tooltip";

/** Runs in <head> before paint: applies the saved (or system) color scheme and any saved custom theme. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);try{history.scrollRestoration="manual"}catch(e){}var c=localStorage.getItem("cuelark-theme-css");if(c){var s=new CSSStyleSheet();s.replaceSync(c);document.adoptedStyleSheets=[].concat(Array.from(document.adoptedStyleSheets),[s]);window.__cueSheet=s}}catch(e){}})()`;

export function ThemeToggle() {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle dark mode">
          <SunIcon className="hidden dark:block" />
          <MoonIcon className="dark:hidden" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}
