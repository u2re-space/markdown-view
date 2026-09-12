/**
 * Custom element wrapper used by the markdown/viewer surface.
 * FIND:raw-editor-layout
 *
 * It creates the shadow-shell that toggles between rendered prose and raw
 * source output while keeping the light-DOM render targets stable for the rest
 * of the viewer pipeline.
 */
import { ensureViewportTracking } from "@fest-lib/dom";
import { createHexEditorHost, isHexEditorHost, bytesAreUtf8Text, bytesToLatin1, latin1ToBytes } from "@fest-lib/fl-ui/markdown/hex-editor";
import { createRawEditorHost, isRawEditorHost } from "@fest-lib/fl-ui/markdown/raw-editor";
import { H } from "@fest-lib/lure";

export { createHexEditorHost, isHexEditorHost, createRawEditorHost, isRawEditorHost, bytesAreUtf8Text, bytesToLatin1, latin1ToBytes };

const FRAME_TAG = "cw-markdown-view-frame";

/** Build the shadow-panel structure that hosts the raw and rendered viewer slots. */
export function createMarkdownViewFrame(): HTMLElement {
    return H`
        <div class="view-viewer__content" data-viewer-content>
            <div class="cw-view-viewer__slot-raw">
                <slot name="raw"></slot>
            </div>
            <div class="cw-view-viewer__slot-hex">
                <slot name="hex"></slot>
            </div>
            <div class="cw-view-viewer__slot-default">
                <slot></slot>
            </div>
        </div>
    ` as HTMLElement;
}

/** Lightweight host element for viewer content that can switch between raw and prose modes. */
export class MarkdownViewFrameElement extends HTMLElement {
    ensureReady(): this {
        const self = this as HTMLElement & { dataset: DOMStringMap };
        if (self.dataset.ready === "1") return this;
        self.dataset.ready = "1";
        self.classList.add("cw-markdown-view-frame");

        let raw = self.querySelector(":scope > [data-raw-target]") as HTMLElement | null;
        const leftover = self.querySelector(":scope > .markdown-viewer-raw-host, :scope > textarea[data-raw-target]");
        if (!isRawEditorHost(raw)) {
            const next = createRawEditorHost({ slot: "raw" });
            if (raw) raw.replaceWith(next);
            else if (leftover) leftover.replaceWith(next);
            else self.appendChild(next);
            raw = next;
        } else if (!raw.slot) {
            raw.slot = "raw";
        }
        if (leftover && leftover !== raw) leftover.remove();

        let hex = self.querySelector(":scope > [data-hex-target]") as HTMLElement | null;
        if (!isHexEditorHost(hex)) {
            const next = createHexEditorHost({ slot: "hex" });
            if (hex) hex.replaceWith(next);
            else self.appendChild(next);
            hex = next;
        } else if (!hex.slot) {
            hex.slot = "hex";
        }

        let prose = self.querySelector(":scope > [data-render-target]") as HTMLElement | null;
        if (!prose) {
            prose = document.createElement("div");
            prose.className = "cw-view-viewer__prose markdown-body markdown-viewer-content result-content";
            prose.toggleAttribute("data-render-target", true);
            prose.toggleAttribute("data-cw-viewer-prose", true);
            self.appendChild(prose);
        }

        const shadow = self.shadowRoot ?? self.attachShadow({ mode: "open" });
        if (!shadow.querySelector("[data-view-frame-panel]")) {
            const styleEl = document.createElement("style");
            styleEl.textContent = `
                :host {
                    display: block;
                    box-sizing: border-box;
                    inline-size: 100%;
                    block-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    overflow: hidden;
                }

                .view-viewer__content {
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    inline-size: 100%;
                    block-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    overflow: hidden;
                }

                .cw-view-viewer__slot-raw,
                .cw-view-viewer__slot-hex,
                .cw-view-viewer__slot-default {
                    flex: 1 1 auto;
                    box-sizing: border-box;
                    min-inline-size: 0;
                    min-block-size: 0;
                    overscroll-behavior: contain;
                }

                /* WHY: raw/hex scroll lives inside the editor shadow, not this slot. */
                .cw-view-viewer__slot-raw,
                .cw-view-viewer__slot-hex {
                    overflow: hidden;
                }

                .cw-view-viewer__slot-raw > slot::slotted(cw-raw-editor),
                .cw-view-viewer__slot-hex > slot::slotted(cw-hex-editor) {
                    display: block;
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    min-width: 0;
                    min-height: 0;
                }

                /* WHY: flex-basis:auto sizes to the draft; WebView then scrolls the
                 * whole view-viewer (toolbars). Pin the slot and fill it absolutely. */
                :host-context(html[data-cwsp-native-shell="capacitor"]) .cw-view-viewer__slot-raw,
                :host-context(html[data-cwsp-native-shell="capacitor"]) .cw-view-viewer__slot-hex {
                    flex: 1 1 0%;
                    height: 0;
                    position: relative;
                    overflow: hidden;
                }

                :host-context(html[data-cwsp-native-shell="capacitor"]) .cw-view-viewer__slot-raw > slot::slotted(cw-raw-editor),
                :host-context(html[data-cwsp-native-shell="capacitor"]) .cw-view-viewer__slot-hex > slot::slotted(cw-hex-editor) {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .cw-view-viewer__slot-default {
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding-bottom: var(--virtual-keyboard-height, 0px);
                }

                .cw-view-viewer__slot-default > slot {
                    display: block;
                    block-size: 100%;
                    min-block-size: 0;
                }

                .cw-view-viewer__slot-default > slot::slotted([data-render-target]) {
                    display: block;
                    box-sizing: border-box;
                    inline-size: 100%;
                    block-size: 100%;
                    max-block-size: 100%;
                    min-inline-size: 0;
                    min-block-size: 0;
                    overflow-x: hidden;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                }

                /* WHY: data-raw is stamped on cw-view-viewer / shell, not this frame. */
                :host-context([data-raw]) .cw-view-viewer__slot-default {
                    display: none !important;
                }

                .cw-view-viewer__slot-raw {
                    display: none !important;
                    content-visibility: auto;
                }

                :host-context([data-raw]) .cw-view-viewer__slot-raw {
                    display: flex !important;
                    flex-direction: column;
                }

                .cw-view-viewer__slot-hex {
                    display: none !important;
                    content-visibility: auto;
                }

                :host-context([data-view-mode="hex"]) .cw-view-viewer__slot-default,
                :host-context([data-view-mode="hex"]) .cw-view-viewer__slot-raw {
                    display: none !important;
                }

                :host-context([data-view-mode="hex"]) .cw-view-viewer__slot-hex {
                    display: flex !important;
                    flex-direction: column;
                }
            `;
            const panel = createMarkdownViewFrame();
            panel.toggleAttribute("data-view-frame-panel", true);
            shadow.replaceChildren(styleEl, panel);
        }

        return this;
    }

    connectedCallback(): this {
        ensureViewportTracking();
        return this.ensureReady();
    }
}

/** Define the viewer frame element once and return its tag name for callers. */
export function ensureMarkdownViewFrame(): string {
    if (!customElements.get(FRAME_TAG)) {
        customElements.define(FRAME_TAG, MarkdownViewFrameElement);
    }
    return FRAME_TAG;
}
