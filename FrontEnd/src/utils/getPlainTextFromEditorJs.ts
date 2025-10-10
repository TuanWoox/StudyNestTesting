const stripHtml = (html: string) =>
    typeof html === "string"
        ? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        : String(html ?? "").trim();

export const getPlainTextFromEditorJs = (content: string): string => {
    try {
        const parsed = typeof content === "string" ? JSON.parse(content) : content;
        const blocks = Array.isArray(parsed?.blocks) ? parsed.blocks : [];
        const parts: string[] = [];

        for (const block of blocks) {
            if (!block || !block.type) continue;
            const type = String(block.type).toLowerCase();
            const data = block.data ?? {};

            switch (type) {
                // văn bản thuần -> strip html
                case "paragraph":
                case "header":
                case "quote": {
                    const text = data.text ?? data.caption ?? "";
                    parts.push(stripHtml(text));
                    break;
                }

                // warning (title + message)
                case "warning": {
                    const title = data.title ?? "";
                    const message = data.message ?? "";
                    parts.push(`${stripHtml(title)} ${stripHtml(message)}`.trim());
                    break;
                }

                // alert/info-like blocks
                case "alert":
                case "note":
                case "alert-tool": {
                    parts.push(stripHtml(data.message ?? data.text ?? ""));
                    break;
                }

                // list (ordered/unordered) -> items có thể là mảng string hoặc object { content }
                case "list": {
                    const items = Array.isArray(data.items) ? data.items : [];
                    const itemTexts = items.map((it: any) =>
                        typeof it === "string" ? stripHtml(it) : stripHtml(it.content ?? "")
                    );
                    parts.push(itemTexts.join(", "));
                    break;
                }

                // checklist plugin (tương tự)
                case "checklist": {
                    const items = Array.isArray(data.items) ? data.items : [];
                    parts.push(
                        items.map((it: any) => stripHtml(it.content ?? "")).join(", ")
                    );
                    break;
                }

                // table -> flatten cells
                case "table": {
                    const table = Array.isArray(data.content) ? data.content : [];
                    parts.push(
                        table
                            .map((row: any) =>
                                Array.isArray(row) ? row.map((c: any) => stripHtml(c)).join(" | ") : stripHtml(String(row))
                            )
                            .join(" ; ")
                    );
                    break;
                }

                // math/code -> trả về raw text
                case "math":
                case "mathblock":
                case "code": {
                    parts.push(String(data.code ?? data.math ?? "").trim());
                    break;
                }

                // image / embed / raw / linkTool / delimiter ... => bỏ qua
                case "image":
                case "embed":
                case "linktool":
                case "raw":
                case "delimiter":
                case "video":
                case "audio":
                    // intentionally skip visual/media blocks
                    break;

                // default: cố gắng lấy text từ data (an toàn)
                default: {
                    const maybeText =
                        data.text ?? data.message ?? data.caption ?? data.content ?? "";
                    if (maybeText) parts.push(stripHtml(maybeText));
                    break;
                }
            }
        }

        const result = parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
        return result.slice(0, 150); // giới hạn preview 150 ký tự
    } catch (error) {
        return "";
    }
};