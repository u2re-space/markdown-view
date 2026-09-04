/**
 * Single source for markdown viewer toolbar chrome (standalone + shadow/slot modes).
 * FIND:file-markdown
 */

import { H } from "@fest-lib/lure";

export function createViewerPathBar(): HTMLElement {
    return H`
        <div
            class="view-viewer__pathbar"
            data-viewer-pathbar
            role="navigation"
            aria-label="Document path"
        >
            <div class="view-viewer__pathbar-left" role="group" aria-label="History">
                <button class="view-viewer__btn" data-action="go-back" type="button" title="Back" disabled>
                    <ui-icon class="view-viewer__toolbar-icon" icon="arrow-left" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Back</span>
                </button>
                <button class="view-viewer__btn" data-action="refresh-path" type="button" title="Reload this document">
                    <ui-icon class="view-viewer__toolbar-icon" icon="arrow-clockwise" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Refresh</span>
                </button>
            </div>
            <form class="view-viewer__pathbar-center" data-viewer-path-form>
                <input
                    class="view-viewer__path-input"
                    data-viewer-path
                    name="address"
                    type="text"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder="Path or URL…"
                    aria-label="Document path or URL"
                />
            </form>
            <div class="view-viewer__pathbar-right" role="group" aria-label="Open">
                <button class="view-viewer__btn" data-action="go-path" type="button" title="Load path or URL">
                    <ui-icon class="view-viewer__toolbar-icon" icon="arrow-right" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Go</span>
                </button>
                <button class="view-viewer__btn" data-action="open" type="button" title="Open file">
                    <ui-icon class="view-viewer__toolbar-icon" icon="folder-open" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Open</span>
                </button>
                <button class="view-viewer__btn" data-action="bind-assets" type="button" title="Bind folder for images and other relative assets">
                    <ui-icon class="view-viewer__toolbar-icon" icon="folder" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Assets</span>
                </button>
            </div>
        </div>
    ` as HTMLElement;
}

export function createViewerToolbar(): HTMLElement {
    return H`
        <div
            class="view-viewer__toolbar"
            data-viewer-toolbar
            role="toolbar"
            aria-label="Markdown document actions"
        >
            <div class="view-viewer__toolbar-left" role="group" aria-label="Document">
                <button class="view-viewer__btn" data-action="toggle-raw" type="button" title="Toggle raw/rendered view">
                    <ui-icon class="view-viewer__toolbar-icon" icon="code" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Raw</span>
                </button>
                <button class="view-viewer__btn" data-action="copy" type="button" title="Copy raw content">
                    <ui-icon class="view-viewer__toolbar-icon" icon="copy" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Copy</span>
                </button>
                <button class="view-viewer__btn" data-action="paste" type="button" title="Paste from clipboard (mobile-friendly)" aria-label="Paste from clipboard">
                    <ui-icon class="view-viewer__toolbar-icon" icon="clipboard-text" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Paste</span>
                </button>
                <button class="view-viewer__btn" data-action="download" type="button" title="Download as markdown">
                    <ui-icon class="view-viewer__toolbar-icon" icon="download" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Download</span>
                </button>
            </div>
            <div class="view-viewer__toolbar-center" role="presentation">
                <span class="view-viewer__toolbar-title" data-viewer-toolbar-title></span>
            </div>
            <div class="view-viewer__toolbar-right" role="group" aria-label="Output and workspace">
                <button class="view-viewer__btn" data-action="attach" type="button" title="Attach to Work Center">
                    <ui-icon class="view-viewer__toolbar-icon" icon="paperclip" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Attach</span>
                </button>
                <button class="view-viewer__btn" data-action="open-style-settings" type="button" title="Markdown styling, modules, plugins">
                    <ui-icon class="view-viewer__toolbar-icon" icon="paint-roller" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Style</span>
                </button>
                <button class="view-viewer__btn" data-action="copy-rendered" type="button" title="Copy rendered text">
                    <ui-icon class="view-viewer__toolbar-icon" icon="text-t" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Copy text</span>
                </button>
                <button class="view-viewer__btn" data-action="export-docx" type="button" title="Export as DOCX">
                    <ui-icon class="view-viewer__toolbar-icon" icon="file-doc" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>DOCX</span>
                </button>
                <button class="view-viewer__btn" data-action="print" type="button" title="Print content">
                    <ui-icon class="view-viewer__toolbar-icon" icon="printer" icon-style="duotone" size="20" aria-hidden="true"></ui-icon>
                    <span>Print</span>
                </button>
            </div>
        </div>
    ` as HTMLElement;
}

/** Path row + action row. Explorer-like address chrome lives on the first row. */
export function createViewerChrome(): HTMLElement {
    const chrome = H`<div class="view-viewer__chrome" data-viewer-chrome></div>` as HTMLElement;
    chrome.append(createViewerPathBar(), createViewerToolbar());
    return chrome;
}

const TOOLBAR_TAG = "cw-markdown-toolbar-frame";
const TOOLBAR_SLOT = "toolbar";

export class MarkdownToolbarFrameElement extends HTMLElement {
    ensureReady(): this {
        const self = this as HTMLElement & { dataset: DOMStringMap };
        if (self.dataset.ready === "1") return this;
        self.dataset.ready = "1";
        self.classList?.add?.("cw-markdown-toolbar-frame");

        let chrome = self.querySelector(`:scope > [slot="${TOOLBAR_SLOT}"][data-viewer-chrome]`) as HTMLElement | null;
        if (!chrome) {
            chrome = createViewerChrome();
            chrome.slot = TOOLBAR_SLOT;
            self.appendChild(chrome);
        } else if (!chrome.slot) {
            chrome.slot = TOOLBAR_SLOT;
        }

        const shadow = self.shadowRoot ?? self.attachShadow({ mode: "open" });
        if (!shadow.querySelector("[data-toolbar-panel]")) {
            const styleEl = document.createElement("style");
            styleEl.textContent = `
                :host {
                    display: block;
                    box-sizing: border-box;
                    min-inline-size: 0;
                    min-block-size: 0;
                    inline-size: 100%;
                }

                .cw-markdown-toolbar-frame__panel {
                    display: block;
                    box-sizing: border-box;
                    inline-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                }

                .cw-markdown-toolbar-frame__panel > slot {
                    display: block;
                }
            `;
            const panel = document.createElement("div");
            panel.className = "cw-markdown-toolbar-frame__panel";
            panel.toggleAttribute("data-toolbar-panel", true);
            panel.innerHTML = `<slot name="${TOOLBAR_SLOT}"></slot>`;
            shadow.replaceChildren(styleEl, panel);
        }

        return this;
    }

    connectedCallback(): this {
        return this.ensureReady();
    }
}

export function ensureMarkdownToolbarFrame(): string {
    if (!customElements.get(TOOLBAR_TAG)) {
        customElements.define(TOOLBAR_TAG, MarkdownToolbarFrameElement);
    }
    return TOOLBAR_TAG;
}
