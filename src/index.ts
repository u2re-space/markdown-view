/**
 * CrossWord viewer module entry — exposes the shell-integrated {@link CwViewViewer} custom element
 * (default export = CE constructor; `new X(options)` + `.render()`).
 *
 * Shell / window ids: primary **`viewer`**, aliases **`markdown`**, **`markdown-view`**, … — see
 * `shells/window-frame` `normalizeMarkdownViewWindowId`.
 */
export { CwViewViewer, warmViewerMarkdownEngine, TAG } from "./needs-to-API";
export { CwViewViewer as ViewerView } from "./needs-to-API";
export type { ViewerColorScheme } from "./theme";
export {
    coerceViewerColorScheme,
    normalizeViewerSetColorSchemePayload,
    resolveViewerColorSchemePreference,
    resolveViewerOptionsColorScheme
} from "./theme";

import { CwViewViewer } from "./needs-to-API";

export default CwViewViewer;
