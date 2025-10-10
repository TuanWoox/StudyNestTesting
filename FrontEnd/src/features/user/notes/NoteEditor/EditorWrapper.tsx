import React from 'react';
import Editor from '@/components/Editor/Editor';
import { OutputBlockData } from "@editorjs/editorjs";

interface EditorWrapperProps {
    noteId: string;
    content: string;
    onChange: (content: string) => void;
    darkMode: boolean;
}

const parseContentToBlocks = (content: string): OutputBlockData[] => {
    try {
        const parsed = JSON.parse(content);
        if (parsed.blocks) return parsed.blocks;
    } catch {
        return [{ type: "paragraph", data: { text: content } }];
    }
    return [];
};

const EditorWrapper: React.FC<EditorWrapperProps> = ({ noteId, content, onChange, darkMode }) => {
    return (
        <div
            className={`h-full rounded-2xl transition-all duration-300 backdrop-blur-lg ${darkMode
                ? "bg-gray-800/50 border-2 border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                : "bg-white border-2 border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                } hover:border-blue-300/50 focus-within:border-blue-500/50 focus-within:shadow-lg`}
            style={{
                overflow: "auto",
                scrollbarWidth: "none"
            }}
        >
            <Editor
                holderElementId={`editorjs-${noteId}`}
                data={parseContentToBlocks(content)}
                onChangeOutside={(outputData) => onChange(JSON.stringify(outputData))}
            />
        </div>
    );
};

export default EditorWrapper;
