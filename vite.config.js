import { defineViewProject } from "./vite.view.config.js";

/**
 * Dev: https://localhost:443 (or VIEW_DEV_PORT) with PEMs in `certs/` (see npm run ssl:localhost).
 * WHY: lightningcss minify chokes on Veela `::slotted` composition in bundled CSS — skip CSS minify for this lib.
 */
export default defineViewProject({
    name: "markdown-view",
    root: import.meta.dirname,
    defaultDevPort: 443,
    sslDir: "certs",
    buildExtend: {
        cssMinify: false
    }
});
