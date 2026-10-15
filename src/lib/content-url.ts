// Shared URL policy for author-supplied destinations: Markdown links and
// images, and project github/demo/webpage metadata. Browser-safe, no deps.
//
// The native URL parser resolves the value against a fixed dummy base, so
// a relative destination reports the base's https: protocol and an
// absolute one reports its own. Only http:, https:, and (when allowed)
// mailto: pass. That rejects javascript:, data:, vbscript:, file:, and
// every other scheme, whatever its case. Control characters fail outright
// because the parser silently strips tabs and newlines, which would let
// "java\nscript:" hide its scheme from a naive check.
const BASE = 'https://content.invalid/'
// C0 controls, DEL, and C1 controls.
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/

/**
 * Returns the trimmed source URL when it is a web (http/https), relative,
 * or (with allowMailto) mailto destination. Returns null otherwise.
 * The result is the author's text, never the dummy base resolution.
 */
export function safeContentUrl(raw: string, allowMailto = false): string | null {
 const url = raw.trim()
 if (!url || CONTROL.test(url)) return null
 let protocol: string
 try {
  protocol = new URL(url, BASE).protocol
 } catch {
  return null
 }
 return protocol === 'http:' || protocol === 'https:' || (allowMailto && protocol === 'mailto:') ? url : null
}
