/** Long-tail keywords, titles and descriptions for icon pages. */

/**
 * Concept groups: words people use interchangeably when looking for the same icon. Matching is bidirectional, so
 * a search for "agent" also finds bot and robot icons, and a robot icon ranks for "ai icon" and "assistant icon".
 */
export const CONCEPTS: string[][] = [
  ["agent", "bot", "robot", "ai", "assistant", "chatbot", "automation", "android"],
  ["ai", "sparkle", "sparkles", "magic", "wand", "stars", "brain"],
  ["brain", "mind", "intelligence", "thinking", "idea", "neural"],
  ["idea", "lightbulb", "bulb", "light", "tip", "insight"],
  ["user", "person", "profile", "account", "avatar", "member", "customer", "people"],
  ["users", "people", "team", "group", "community", "members", "contacts"],
  ["settings", "gear", "cog", "preferences", "config", "options", "tune", "sliders", "adjustments"],
  ["search", "magnifying", "find", "lookup", "explore", "zoom"],
  ["home", "house", "dashboard", "main", "start"],
  ["mail", "email", "envelope", "inbox", "letter", "message"],
  ["chat", "message", "comment", "conversation", "bubble", "talk", "sms", "messenger"],
  ["bell", "notification", "alert", "alarm", "reminder"],
  ["heart", "like", "love", "favorite", "favourite", "health"],
  ["star", "favorite", "rating", "review", "bookmark"],
  ["bookmark", "save", "saved", "ribbon", "tag"],
  ["close", "x", "cancel", "dismiss", "times", "remove", "xmark", "cross"],
  ["check", "tick", "done", "success", "checkmark", "complete", "approve", "verified", "confirm"],
  ["plus", "add", "new", "create", "insert"],
  ["minus", "subtract", "remove", "less"],
  ["trash", "delete", "bin", "remove", "garbage", "waste", "discard"],
  ["edit", "pencil", "pen", "write", "modify", "compose", "draw"],
  ["calendar", "date", "schedule", "event", "planner", "day", "month"],
  ["clock", "time", "watch", "history", "timer", "hour", "schedule"],
  ["cart", "shopping", "basket", "checkout", "buy", "store", "ecommerce", "bag"],
  ["money", "cash", "dollar", "payment", "currency", "price", "billing", "finance", "coin"],
  ["card", "credit", "payment", "debit", "wallet", "billing"],
  ["lock", "secure", "security", "password", "padlock", "private", "protected"],
  ["shield", "security", "protection", "safe", "guard", "privacy", "antivirus"],
  ["key", "password", "access", "auth", "login", "credential"],
  ["eye", "view", "show", "visible", "visibility", "watch", "preview"],
  ["download", "save", "get", "import", "inbox"],
  ["upload", "share", "export", "publish", "send"],
  ["share", "send", "export", "forward", "social", "network"],
  ["send", "paper plane", "plane", "submit", "deliver"],
  ["link", "url", "chain", "hyperlink", "connect", "attachment"],
  ["copy", "duplicate", "clipboard", "clone", "paste"],
  ["file", "document", "page", "paper", "doc", "sheet"],
  ["folder", "directory", "files", "archive", "collection"],
  ["image", "picture", "photo", "gallery", "media", "img"],
  ["camera", "photo", "picture", "snapshot", "capture"],
  ["video", "film", "movie", "camera", "recording", "media", "play"],
  ["music", "audio", "sound", "song", "note", "melody"],
  ["volume", "sound", "speaker", "audio", "mute"],
  ["mic", "microphone", "voice", "record", "audio", "podcast"],
  ["phone", "call", "telephone", "mobile", "contact"],
  ["menu", "hamburger", "navigation", "bars", "nav", "list"],
  ["grid", "apps", "layout", "dashboard", "tiles", "category"],
  ["list", "items", "todo", "checklist", "tasks", "menu"],
  ["filter", "funnel", "sort", "refine", "sliders"],
  ["refresh", "reload", "sync", "update", "rotate", "repeat", "loop"],
  ["arrow", "direction", "pointer", "navigate", "next", "move"],
  ["chevron", "caret", "angle", "arrow", "expand", "collapse"],
  ["external", "open", "new tab", "launch", "out"],
  ["login", "sign in", "enter", "door", "auth"],
  ["logout", "sign out", "exit", "leave", "door"],
  ["sun", "light", "day", "brightness", "weather", "light mode"],
  ["moon", "night", "dark", "dark mode", "sleep"],
  ["cloud", "storage", "weather", "sync", "upload", "saas"],
  ["weather", "rain", "snow", "storm", "forecast", "cloud", "sun"],
  ["fire", "flame", "hot", "trending", "burn"],
  ["bolt", "lightning", "flash", "energy", "power", "zap", "electric", "fast"],
  ["battery", "charge", "power", "energy"],
  ["wifi", "wireless", "internet", "signal", "network", "connection"],
  ["globe", "world", "earth", "internet", "web", "language", "international", "planet"],
  ["map", "location", "navigation", "route", "directions"],
  ["pin", "location", "map", "place", "marker", "address", "gps"],
  ["chart", "graph", "analytics", "statistics", "stats", "report", "data", "insights"],
  ["trending", "growth", "increase", "up", "rise", "progress"],
  ["database", "storage", "server", "data", "db", "sql"],
  ["server", "hosting", "backend", "rack", "infrastructure"],
  ["code", "developer", "programming", "brackets", "html", "dev", "coding"],
  ["terminal", "console", "command", "cli", "shell", "prompt"],
  ["bug", "issue", "error", "debug", "insect"],
  ["warning", "alert", "caution", "error", "danger", "exclamation", "attention"],
  ["info", "information", "help", "about", "details"],
  ["help", "question", "support", "faq", "lifebuoy", "info"],
  ["flag", "report", "country", "banner", "milestone"],
  ["gift", "present", "reward", "surprise", "birthday", "promo"],
  ["award", "trophy", "medal", "prize", "winner", "achievement", "badge"],
  ["rocket", "launch", "startup", "fast", "boost", "ship"],
  ["car", "vehicle", "auto", "drive", "transport"],
  ["truck", "delivery", "shipping", "transport", "logistics"],
  ["plane", "flight", "airplane", "travel", "airport"],
  ["book", "read", "library", "docs", "documentation", "guide", "learn"],
  ["school", "education", "graduation", "learn", "student", "course", "university"],
  ["work", "briefcase", "job", "business", "career", "office"],
  ["building", "office", "company", "enterprise", "business", "city"],
  ["store", "shop", "market", "retail", "storefront"],
  ["laptop", "computer", "notebook", "device", "pc"],
  ["monitor", "desktop", "screen", "display", "computer"],
  ["mobile", "phone", "smartphone", "device", "cell"],
  ["keyboard", "type", "typing", "input", "keys"],
  ["printer", "print", "paper", "office"],
  ["headphones", "headset", "audio", "music", "support"],
  ["thumbs up", "like", "approve", "good", "yes"],
  ["smile", "emoji", "happy", "face", "emotion", "mood"],
  ["fingerprint", "biometric", "identity", "touch id", "auth"],
  ["qr", "barcode", "scan", "code"],
  ["power", "on", "off", "shutdown", "switch"],
  ["inbox", "tray", "messages", "mail"],
  ["archive", "box", "storage", "backup"],
  ["attachment", "paperclip", "attach", "clip", "file"],
  ["scissors", "cut", "trim", "crop"],
  ["crop", "resize", "trim", "frame"],
  ["layers", "stack", "depth", "levels"],
  ["puzzle", "plugin", "extension", "integration", "addon"],
  ["webhook", "api", "integration", "connect", "plug"],
  ["github", "git", "repository", "code", "open source"],
  ["git", "branch", "merge", "commit", "version control"],
];

/** term → related terms (union of every group containing it). */
const SYNONYMS: Record<string, string[]> = {};
for (const group of CONCEPTS) for (const term of group) SYNONYMS[term] = [...new Set([...(SYNONYMS[term] ?? []), ...group.filter((t) => t !== term)])];

/** Related words for a phrase: synonyms of each of its words, plus of the whole phrase. */
export function relatedTerms(words: string, limit = 8) {
  const parts = words.toLowerCase().split(/\s+/).filter(Boolean);
  const out = [...(SYNONYMS[parts.join(" ")] ?? []), ...parts.flatMap((p) => SYNONYMS[p] ?? [])];
  return [...new Set(out)].filter((t) => !parts.includes(t)).slice(0, limit);
}

/** For search: each query word expanded to itself plus its synonyms (single words only, to keep matches precise). */
export function expandQuery(q: string) {
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => [t, ...(SYNONYMS[t] ?? []).filter((x) => !x.includes(" "))]);
}

const unique = (xs: string[]) => [...new Set(xs.map((x) => x.trim()).filter(Boolean))];

/** Keyword list for one icon: exact, intent, framework and synonym long-tails. */
export function iconKeywords(words: string, setName: string) {
  const w = words || "icon";
  const syn = relatedTerms(w, 6);
  return unique([
    `${w} icon`,
    `${w} icon react`,
    `${w} svg`,
    `${w} svg icon`,
    `free ${w} icon`,
    `${w} icon download`,
    `animated ${w} icon`,
    `${w} icon ${setName.toLowerCase()}`,
    `${setName.toLowerCase()} ${w}`,
    `${w} icon tailwind`,
    `${w} icon shadcn`,
    `${w} icon component`,
    ...syn.map((s) => `${s} icon`),
  ]);
}

export function iconSeoTitle(title: string, setName: string) {
  return `${title} Icon (${setName}): Free SVG & Animated React Icon`;
}

export function iconSeoDescription(title: string, setName: string, license: string, words: string) {
  const syn = relatedTerms(words, 3);
  const also = syn.length ? ` Also known as ${syn.map((s) => `${s} icon`).join(", ")}.` : "";
  return `Free ${title.toLowerCase()} icon from ${setName} (${license}). Download the SVG, copy it as a static or animated React component, or install it with the shadcn CLI.${also}`;
}

/** High-intent icon searches that get their own indexable results page (/icons/search/<term>) and sitemap entry. */
export const POPULAR_SEARCHES = [
  "agent", "ai", "assistant", "bot", "robot", "chatbot", "automation", "brain", "idea", "workflow", "api", "plugin", "integration",
  "arrow", "arrow-right", "arrow-left", "arrow-up", "arrow-down", "chevron", "chevron-down", "chevron-right", "home", "user", "users", "settings",
  "search", "menu", "close", "check", "plus", "minus", "trash", "edit", "pencil", "heart", "star", "bell", "mail", "phone", "calendar", "clock",
  "lock", "unlock", "eye", "eye-off", "download", "upload", "share", "link", "copy", "file", "folder", "image", "camera", "video", "play", "pause",
  "music", "mic", "volume", "chat", "message", "comment", "send", "cart", "shopping-bag", "credit-card", "wallet", "dollar", "money", "chart",
  "bar-chart", "pie-chart", "trending-up", "database", "server", "cloud", "code", "terminal", "github", "git", "bug", "globe", "map", "location",
  "pin", "compass", "sun", "moon", "weather", "fire", "bolt", "battery", "wifi", "bluetooth", "power", "refresh", "sync", "filter", "sort", "grid",
  "list", "layout", "dashboard", "bookmark", "tag", "flag", "gift", "award", "trophy", "shield", "key", "info", "warning", "alert", "help",
  "question", "logout", "login", "external-link", "cursor", "hand", "thumbs-up", "smile", "robot", "sparkles", "magic", "brain", "rocket",
  "car", "truck", "plane", "bike", "book", "graduation", "briefcase", "building", "store", "printer", "keyboard", "mouse", "laptop", "mobile",
  "tablet", "monitor", "headphones", "qr-code", "fingerprint", "notification", "inbox", "archive", "attachment", "paperclip", "scissors",
  "facebook", "twitter", "instagram", "linkedin", "youtube", "whatsapp", "discord", "slack", "google", "apple", "android", "windows",
];

/** "arrow-right" → "arrow right" */
export const termFromSlug = (slug: string) => decodeURIComponent(slug).replace(/[-_+]+/g, " ").trim().toLowerCase();
export const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
