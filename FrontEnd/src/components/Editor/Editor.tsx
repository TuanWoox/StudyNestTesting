import { useEffect } from "react";
import { useCreateEditor } from "../../hooks/editorHook/useCreateEditor";
import { OutputBlockData } from "@editorjs/editorjs";

interface EditorProps {
    holderElementId?: string;
    data?: OutputBlockData[];
    onChangeOutside?: (outputData: any) => void;
}

const Editor = ({ holderElementId = "editorjs", data = [], onChangeOutside }: EditorProps) => {
    const editorRef = useCreateEditor({ holderElementId, data, onChangeOutside });

    // Chỉ render lại khi holderElementId thay đổi (tức là chuyển note)
    useEffect(() => {
        if (editorRef.current && data) {
            editorRef.current.render({ blocks: data });
        }
    }, [holderElementId]); // Chỉ phụ thuộc vào holderElementId

    return <div id={holderElementId} className="editor-output"></div>;
};

export default Editor;