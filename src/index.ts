import { UIElement } from "./ts/UIElement";
import { MarkdownView } from "./ts/Markdown";

//
console.log(UIElement);
console.log(MarkdownView);

// TODO! Needs to implement `setOptions` per Web Components (on initialize)
export const createView = (options: any, taskName = "viewer", registry: Map<string, HTMLElement>) => {
    if (!registry) { registry = new Map(); }
    // @ts-ignore
    return registry?.getOrInsertComputed?.(taskName, () => {
        const mdView = document.createElement("md-view");
        mdView?.setOptions?.(options);
        return mdView;
    });
}

//
export const mountView = (container: HTMLElement, options: any | HTMLElement, taskName = "viewer", registry: Map<string, HTMLElement>) => {
    const element = typeof options === "object" ? createView(options, taskName, registry) : options;
    container.appendChild(element);
    return element;
}

//
export default createView;
