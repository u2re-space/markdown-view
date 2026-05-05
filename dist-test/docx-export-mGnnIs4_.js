//#region ../../projects/subsystem/runtime/docx-export.ts
async function e(e, t = "document.docx") {
	let n = new Blob([e], { type: "text/markdown;charset=utf-8" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = t.replace(/\.docx$/i, ".md"), i.click(), URL.revokeObjectURL(r);
}
//#endregion
export { e as downloadMarkdownAsDocx };
