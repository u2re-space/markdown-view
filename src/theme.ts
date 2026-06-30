/**
 * Viewer appearance: explicit light/dark can temporarily drive `document.documentElement` for standalone/API use.
 * **`system` does not write `<html>`** — shell `applyTheme` / `syncBrowserChromeTheme` stays authoritative so
 * markdown/toolbar `html[data-theme]` rules match minimal/immersive chrome.
 */

export type ViewerColorScheme = "light" | "dark" | "system";

/** Effective scheme after resolving `system` (no prefers → dark). */
export function resolveViewerColorSchemePreference(mode: ViewerColorScheme | undefined | null): "light" | "dark" {
    if (mode === "light" || mode === "dark") return mode;
    if (typeof globalThis.matchMedia === "function" && globalThis.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
    }
    return "dark";
}

export function coerceViewerColorScheme(raw: unknown): ViewerColorScheme | undefined {
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
    if (typeof raw === "string") {
        const t = raw.trim().toLowerCase();
        if (t === "light" || t === "dark" || t === "system") return t;
    }
    return undefined;
}

export function normalizeViewerSetColorSchemePayload(payload: unknown): ViewerColorScheme | undefined {
    if (payload === undefined || payload === null) return undefined;
    if (typeof payload === "string") return coerceViewerColorScheme(payload.trim());
    if (typeof payload === "object") {
        const o = payload as Record<string, unknown>;
        return coerceViewerColorScheme(o.colorScheme ?? o.scheme ?? o.theme);
    }
    return undefined;
}

export function resolveViewerOptionsColorScheme(opts: {
    colorScheme?: ViewerColorScheme;
    params?: Record<string, unknown> | null;
} | null | undefined): ViewerColorScheme | undefined {
    if (!opts) return undefined;
    if (opts.colorScheme) return opts.colorScheme;
    return coerceViewerColorScheme(opts.params?.colorScheme ?? opts.params?.theme);
}
