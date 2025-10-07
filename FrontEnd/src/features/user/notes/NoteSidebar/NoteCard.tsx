import React from 'react';
import { Card, Tag as AntTag } from 'antd';
import { Note } from '@/types/note/notes';

interface NoteCardProps {
    note: Note;
    darkMode: boolean;
    isSelected: boolean;
    onSelect: () => void;
}

const getPlainTextFromEditorJs = (content: string): string => {
    try {
        const parsed = JSON.parse(content);
        if (!parsed.blocks || !Array.isArray(parsed.blocks)) return "";

        // Lấy text từ mỗi block
        const texts = parsed.blocks.map((block: any) => {
            switch (block.type) {
                case "header":
                case "paragraph":
                case "quote":
                    return block.data.text;
                case "list":
                    return block.data.items.join(", ");
                case "checklist":
                    return block.data.items.map((i: any) => i.text).join(", ");
                default:
                    return "";
            }
        });

        return texts.filter(Boolean).join(" ").slice(0, 150); // Giới hạn 150 ký tự
    } catch (error) {
        return "";
    }
};


const NoteCard: React.FC<NoteCardProps> = ({
    note,
    darkMode,
    isSelected,
    onSelect
}) => {
    // Lấy tags từ note.noteTags[].tag
    const tags = note.noteTags?.map(nt => nt.tag) || [];

    return (
        <Card
            onClick={onSelect}
            style={{
                userSelect: "none",
                backgroundColor: darkMode ? "#2D3748" : "#F7FAFC",
                color: darkMode ? "#F7FAFC" : "#1A202C",
                border: isSelected
                    ? `3px solid ${darkMode ? "#4299E1" : "#3182CE"}`
                    : `1px solid ${darkMode ? "#4A5568" : "#CBD5E0"}`,
                cursor: "pointer",
                borderRadius: "16px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isSelected
                    ? darkMode
                        ? "0 8px 25px rgba(66, 153, 225, 0.4), 0 0 0 1px rgba(66, 153, 225, 0.1)"
                        : "0 8px 25px rgba(49, 130, 206, 0.3), 0 0 0 1px rgba(49, 130, 206, 0.1)"
                    : darkMode
                        ? "0 4px 15px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)"
                        : "0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
                transform: isSelected ? "translateY(-2px)" : "translateY(0)",
                width: "100%",              // ✅ chiếm 100% ô grid
                margin: "0 auto",           // ✅ căn giữa khi lẻ cột
            }}
            className={`hover:scale-[1.01] hover:-translate-y-1 ${darkMode ? "hover:bg-gray-600 hover:shadow-xl" : "hover:bg-white hover:shadow-xl"
                }`}
            styles={{
                body: {
                    padding: "18px",
                },
            }}
        >
            <h3 className="font-bold text-lg mb-3 truncate">{note.title}</h3>
            <p className="text-sm mb-4 line-clamp-2">
                {getPlainTextFromEditorJs(note.content) || "No content"}
            </p>
            <div className="flex items-center mb-3 px-2 py-1 rounded-lg">
                <span className="text-sm mr-2">📁</span>
                <span className="text-xs font-medium">
                    {note?.folder?.folderName || "No Folder"}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <AntTag key={tag.id} style={{
                            backgroundColor: darkMode ? "#553C9A" : "#E9D8FD",
                            color: darkMode ? "#F7FAFC" : "#553C9A",
                            borderRadius: "12px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: 600,
                            border: "none",
                        }}>
                            #{tag.name}
                        </AntTag>
                    ))
                ) : (
                    <span className="text-xs italic px-2 py-1 rounded">
                        No tags
                    </span>
                )}
            </div>
        </Card>
    );
};

export default NoteCard;