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
            className={`flex-1 rounded-s-xl transition-all duration-300 ${darkMode
                ? "bg-gray-800/50 border-2 border-gray-700/50"
                : "bg-white border-2 border-gray-200/50"
                } hover:border-blue-300/50 focus-within:border-blue-500/50 focus-within:shadow-lg`}
            style={{
                backdropFilter: "blur(10px)",
                boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
                overflow: 'auto'
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
