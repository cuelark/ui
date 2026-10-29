/**
 * A tiny syntax highlighter for the short, predictable snippets on icon pages (TSX components, SVG markup, shell
 * commands). It runs the same on the server and in the browser, so pages ship only the raw code instead of
 * highlighted HTML plus a second copy of it for hydration. Colors come from the .hl-* rules in globals.css.
 */

const KEYWORDS = new Set(["import", "from", "export", "default", "function", "return", "const", "let", "type", "interface", "as", "extends", "new", "if", "else", "true", "false", "null", "undefined"]);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const span = (cls: string, s: string) => `<span class="hl-${cls}">${esc(s)}</span>`;

const TSX = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?)([A-Za-z][\w.:-]*)|([A-Za-z_$][\w-]*)(?==)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
const BASH = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'[^'\n]*')|(^|\s)(npx|pnpm|npm|yarn|bunx|dlx)(?=\s)|(https?:\/\/\S+)|(\s--?[\w-]+)/gm;

export function highlightLite(code: string, lang: "tsx" | "bash"): string {
  const re = lang === "bash" ? BASH : TSX;
  let out = "";
  let last = 0;
  for (const m of code.matchAll(re)) {
    const at = m.index ?? 0;
    out += esc(code.slice(last, at));
    last = at + m[0].length;
    if (lang === "bash") {
      const [, comment, str, lead, cmd, url, flag] = m;
      out += comment ? span("c", comment) : str ? span("s", str) : cmd ? esc(lead ?? "") + span("f", cmd) : url ? span("s", url) : flag ? span("k", flag) : esc(m[0]);
      continue;
    }
    const [, comment, str, open, tag, attr, num, word] = m;
    if (comment) out += span("c", comment);
    else if (str) out += span("s", str);
    else if (tag) out += esc(open ?? "") + span(/^[A-Z]/.test(tag) ? "f" : "t", tag);
    else if (attr) out += span("a", attr);
    else if (num) out += span("n", num);
    else if (word) out += KEYWORDS.has(word) ? span("k", word) : esc(word);
  }
  out += esc(code.slice(last));
  const lines = out.split("\n").map((l) => `<span class="line">${l}</span>`).join("\n");
  return `<pre class="hl"><code>${lines}</code></pre>`;
}
