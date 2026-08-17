/*Tag normalization: Obsidian tags -> Anki tags.

Obsidian nests tags with '/', Anki nests with '::'. Anki accepts '/' inside a
tag but treats it as a literal character, so unconverted nested tags arrive as
flat strings. Conversion happens here, in one place, for every path a tag can
take into a note (frontmatter, FILE TAGS line, per-note Tags: line, inline
#tags, folder tags).*/

export function normalizeObsidianTag(tag: string, hierarchy: boolean): string {
    let t = tag.trim()
    while (t.startsWith('#')) {
        t = t.slice(1)
    }
    // Drop stray leading/trailing separators, collapse empty segments
    const parts = t.split('/').filter(part => part.length > 0)
    return hierarchy ? parts.join('::') : parts.join('/')
}

export function normalizeTagList(tags: string[], hierarchy: boolean): string[] {
    /*Normalize a list of raw tag strings, splitting legacy space-delimited
    strings ("a b c" -> three tags) and deduplicating.*/
    const out: string[] = []
    const seen: Set<string> = new Set()
    for (const raw of tags) {
        if (!raw) {
            continue
        }
        for (const piece of raw.trim().split(/\s+/)) {
            const t = normalizeObsidianTag(piece, hierarchy)
            if (t.length && !seen.has(t)) {
                seen.add(t)
                out.push(t)
            }
        }
    }
    return out
}
