/**
 * Markdown viewer demo bootstrap: shared shell context + optional `?md=` / `?url=` / `?path=` open.
 */
import * as viewModule from "view-entry";
import { mountViewModule, type ShellContext, type View, type ViewModule } from "views/types";
import { ViewerChannelAction } from "views/apis/channel-actions";

declare const __VIEW_PROJECT_NAME__: string;

function pickRemoteMarkdownHref(): string | null {
    const sp = new URLSearchParams(location.search);
    const raw = ["url", "md", "path", "src", "open"].map((k) => sp.get(k)).find((v) => v?.trim())?.trim();
    if (!raw) return null;
    try {
        return new URL(raw, location.href).href;
    } catch {
        return null;
    }
}

const app = document.querySelector<HTMLElement>("#app") ?? document.body;
const status = document.querySelector<HTMLElement>("[data-demo-status]");

const shellContext: ShellContext = {
    navigate: (viewId, options) => {
        globalThis.dispatchEvent(new CustomEvent("view:demo:navigate", { detail: { viewId, options } }));
        if (status) status.textContent = `navigate: ${viewId}`;
    },
    showMessage: (message) => {
        if (status) status.textContent = message;
    }
};

const initialUrl = pickRemoteMarkdownHref();

void mountViewModule(app, viewModule as ViewModule, {
    id: __VIEW_PROJECT_NAME__,
    shellContext,
    ...(initialUrl
        ? {
              params: {
                  source: initialUrl,
                  url: initialUrl,
                  src: initialUrl,
                  path: initialUrl
              }
          }
        : {})
}).then(async (mounted) => {
    if (!initialUrl) return;
    const view = mounted.view as View;
    if (typeof view.invokeChannelApi === "function") {
        await view.invokeChannelApi(ViewerChannelAction.OpenMarkdownUrl, {
            url: initialUrl,
            filename: new URL(initialUrl).pathname.split("/").pop() || undefined,
            source: initialUrl,
            src: initialUrl,
            path: initialUrl
        });
    }
}).catch((error) => {
    console.error(error);
    app.textContent = error instanceof Error ? error.message : String(error);
});
