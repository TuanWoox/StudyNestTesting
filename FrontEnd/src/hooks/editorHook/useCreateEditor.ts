import { useEffect, useRef } from 'react';
import EditorJS, {
    OutputBlockData,
    OutputData,
    ToolConstructable,
} from '@editorjs/editorjs';

// ─── Text & Typography ────────────────────────────────────────────────
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Alert from 'editorjs-alert';
import CoolBytesDelimiter from '@coolbytes/editorjs-delimiter';

// ─── Lists ────────────────────────────────────────────────────────────
import List from '@editorjs/list';

// ─── Media & Embeds ───────────────────────────────────────────────────
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import EJLaTeX from 'editorjs-latex';

// ─── Tables ───────────────────────────────────────────────────────────
import Table from '@editorjs/table';

// ─── Code ─────────────────────────────────────────────────────────────
import AceCodeEditorJS from 'ace-code-editorjs';
import aceConfig from '../../config/aceCodeConfig';

// ─── Inline Tools ─────────────────────────────────────────────────────
import InlineCode from '@editorjs/inline-code';
import createGenericInlineTool from 'editorjs-inline-tool';
import Strikethrough from '@sotaproject/strikethrough';
import ColorPlugin from 'editorjs-text-color-plugin';

// ─── Block Tune Tools ─────────────────────────────────────────────────
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import TextVariantTune from '@editorjs/text-variant-tune';
import NoticeTune from 'editorjs-notice';
import IndentTune from 'editorjs-indent-tune';

// ─── Plugins ──────────────────────────────────────────────────────────
import Undo from 'editorjs-undo';
import DragDrop from 'editorjs-drag-drop';
import MultiBlockSelectionPlugin from 'editorjs-multiblock-selection-plugin';
import instance from '@/config/axiosConfig';
import { ImageToolTune } from 'editorjs-image-resize-crop';

const baseURL = import.meta.env.VITE_API_URL

export interface InputForCreateEditor {
    holderElementId?: string;
    data?: OutputBlockData[];
    onChangeOutside?: (outputData: OutputData) => void;
    readOnly?: boolean;
}

export function useCreateEditor({
    holderElementId = 'editorJs',
    data = [],
    onChangeOutside,
    readOnly = false,
}: InputForCreateEditor) {
    const editorRef = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: holderElementId,
                autofocus: false,
                placeholder: 'Type something amazing...',
                data: { blocks: data },
                readOnly,

                tools: {
                    // ── Text & Typography ────────────────────────────────
                    header: { class: Header as unknown as ToolConstructable },
                    paragraph: {
                        class: Paragraph as unknown as ToolConstructable,
                        inlineToolbar: true,
                    },
                    quote: Quote,
                    warning: Warning,
                    alert: Alert,
                    delimiter: CoolBytesDelimiter,

                    // ── Lists ───────────────────────────────────────────
                    list: List,

                    // ── Media & Embed ──────────────────────────────────
                    image: {
                        class: ImageTool,
                        tunes: ['alignmentTune', 'imageResize'], // Allow users to choose left, center, right
                        config: {
                            uploader: {
                                uploadByFile(file) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    const uploadLink = baseURL === "/api/v1" ? "/Image" : `${baseURL}/Image`;
                                    return instance.post(uploadLink, formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' },
                                    }).then(({ data }) => ({
                                        success: data?.result?.success,
                                        file: { url: data?.result?.file?.url },
                                    }));
                                },
                            },
                        },
                    },
                    embed: Embed,
                    Math: {
                        class: EJLaTeX,
                        shortcut: 'CMD+SHIFT+M',
                    },

                    // ── Tables ─────────────────────────────────────────
                    table: Table,

                    // ── Code ───────────────────────────────────────────
                    code: {
                        class: AceCodeEditorJS,
                        config: aceConfig,
                    },

                    // ── Inline Tools ───────────────────────────────────
                    bold: {
                        class: createGenericInlineTool({
                            sanitize: { strong: {}, b: {} },
                            shortcut: 'CMD+B',
                            tagName: 'STRONG',
                            toolboxIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>`,
                        }),
                        title: 'Bold',
                    },
                    italic: {
                        class: createGenericInlineTool({
                            sanitize: { i: {}, em: {} },
                            shortcut: 'CMD+I',
                            tagName: 'I',
                            toolboxIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/></svg>`,
                        }),
                        title: 'Italic',
                    },
                    underline: {
                        class: createGenericInlineTool({
                            sanitize: { u: {} },
                            shortcut: 'CMD+U',
                            tagName: 'U',
                            toolboxIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>`,
                        }),
                        title: 'Underline',
                    },
                    strikethrough: {
                        class: Strikethrough,
                        title: 'Strikethrough',
                    },
                    inlineCode: {
                        class: InlineCode,
                        title: 'Inline Code',
                    },
                    Marker: {
                        class: ColorPlugin,
                        config: {
                            defaultColor: '#FFBF00',
                            type: 'marker',
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M18.5 1.15c-.53 0-1.04.21-1.41.59l-1.68 1.68 3.54 3.54 1.68-1.68c.78-.78.78-2.05 0-2.83l-.71-.7c-.37-.38-.88-.6-1.42-.6zM15.31 4.5l-9.98 9.98c-.12.12-.21.28-.25.45l-.93 4.41c-.11.52.35.98.87.87l4.41-.93c.17-.04.33-.13.45-.25l9.99-9.98-3.56-3.55zM5 19H3v2h2v2h2v-2h2v-2H7v-2H5v2z"/></svg>`,
                        },
                        title: 'Highlight',
                    },
                    Color: {
                        class: ColorPlugin,
                        config: {
                            colorCollections: [
                                '#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF',
                                '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF',
                            ],
                            defaultColor: '#FF1300',
                            type: 'text',
                            customPicker: true,
                        },
                        title: 'Text Color',
                    },

                    // ── Block Tunes ─────────────────────────────────────
                    alignmentTune: AlignmentTuneTool,
                    textVariantTune: TextVariantTune,
                    noticeTune: NoticeTune,
                    indentTune: {
                        class: IndentTune as unknown as ToolConstructable,
                    },
                    imageResize: {
                        class: ImageToolTune as unknown as ToolConstructable,
                        config: { resize: true, crop: false },
                    },
                },

                tunes: [
                    'textVariantTune',
                    'alignmentTune',
                    'noticeTune',
                    'indentTune',
                ],

                onReady: () => {
                    new Undo({ editor });
                    new DragDrop(editor);
                    editorRef.current = editor;

                    const multiblockPlugin = new MultiBlockSelectionPlugin({
                        editor,
                        version: EditorJS.version,
                    });

                    editor.isReady.then(() => multiblockPlugin.listen());

                    window.addEventListener(
                        MultiBlockSelectionPlugin.SELECTION_CHANGE_EVENT,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (ev: any) => {
                            const selectedBlocks = ev.detail.selectedBlocks;
                            console.log('Selected blocks:', selectedBlocks);
                        }
                    );
                },

                onChange: async () => {
                    if (onChangeOutside && editorRef.current) {
                        const outputData = await editorRef.current.save();
                        onChangeOutside(outputData);
                    }
                },
            });
        }

        return () => {
            editorRef.current?.destroy();
            editorRef.current = null;
        };
    }, [holderElementId]); // CHỈ phụ thuộc vào holderElementId

    return editorRef;
}
