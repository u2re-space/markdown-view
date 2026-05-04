/**
 * CrossWord viewer module entry — exposes the shell-integrated {@link CwViewViewer} custom element
 * for {@link ViewRegistry} (default export = CE constructor; `new X(options)` + `.render()`).
 */
export { CwViewViewer, warmViewerMarkdownEngine, TAG } from "./needs-to-API";
export { CwViewViewer as ViewerView } from "./needs-to-API";

import { CwViewViewer } from "./needs-to-API";

export default CwViewViewer;
