import { useEffect, useRef } from "react";
import { useCreateEditor } from "../../hooks/editorHook/useCreateEditor";
import { OutputBlockData } from "@editorjs/editorjs";

interface EditorProps {
    holderElementId?: string;
    data?: OutputBlockData[];
    onChangeOutside?: (outputData: any) => void;
    readOnly?: boolean;
}

const Editor = ({ holderElementId = "editorjs", data = [], onChangeOutside, readOnly = false }: EditorProps) => {
    const editorRef = useCreateEditor({ holderElementId, data, onChangeOutside, readOnly });
    const previousHolderIdRef = useRef<string | null>(null);

    // Re-render when holderElementId changes (switching notes)
    useEffect(() => {
        if (editorRef.current && data) {
            // If this is the first render or holderElementId changed
            if (previousHolderIdRef.current === null || previousHolderIdRef.current !== holderElementId) {
                editorRef.current.isReady.then(() => {
                    editorRef.current?.render({ blocks: data });
                    previousHolderIdRef.current = holderElementId;
                });
            }
        }
    }, [holderElementId, data, editorRef]);

    return <div id={holderElementId} className="editor-output"></div>;
};

export default Editor;