import { t as e } from "./katex-DfeVvRRO.js";
//#region ../../../node_modules/marked-katex-extension/src/index.js
var t = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/, n = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/, r = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;
function i(e = {}) {
	return { extensions: [o(e, a(e, !1)), s(e, a(e, !0))] };
}
function a(t, n) {
	return (r) => e.renderToString(r.text, {
		...t,
		displayMode: r.displayMode
	}) + (n ? "\n" : "");
}
function o(e, r) {
	let i = e && e.nonStandard, a = i ? n : t;
	return {
		name: "inlineKatex",
		level: "inline",
		start(e) {
			let t, n = e;
			for (; n;) {
				if (t = n.indexOf("$"), t === -1) return;
				if ((i ? t > -1 : t === 0 || n.charAt(t - 1) === " ") && n.substring(t).match(a)) return t;
				n = n.substring(t + 1).replace(/^\$+/, "");
			}
		},
		tokenizer(e, t) {
			let n = e.match(a);
			if (n) return {
				type: "inlineKatex",
				raw: n[0],
				text: n[2].trim(),
				displayMode: n[1].length === 2
			};
		},
		renderer: r
	};
}
function s(e, t) {
	return {
		name: "blockKatex",
		level: "block",
		tokenizer(e, t) {
			let n = e.match(r);
			if (n) return {
				type: "blockKatex",
				raw: n[0],
				text: n[2].trim(),
				displayMode: n[1].length === 2
			};
		},
		renderer: t
	};
}
//#endregion
export { i as default };
