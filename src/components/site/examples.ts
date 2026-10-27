import type * as React from "react";

const modules = import.meta.glob<{ default: React.ComponentType }>("/src/registry/cuelark/examples/*.tsx", { eager: true });

/** Live example components by registry name, e.g. `examples["button-demo"]`. */
export const examples: Record<string, React.ComponentType> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split("/").pop()!.replace(/\.tsx$/, ""), mod.default]),
);
