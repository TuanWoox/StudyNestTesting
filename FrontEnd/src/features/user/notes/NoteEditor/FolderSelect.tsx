import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Folder } from '@/types/note/notes';

interface FolderSelectProps {
    selectedFolder?: Folder;
    folders: Folder[];
    onChange: (folder?: Folder) => void;
    darkMode: boolean;
}

const FolderSelect: React.FC<FolderSelectProps> = ({
    selectedFolder, folders, onChange, darkMode
}) => {
    return (
        <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                📁 Folder
            </label>
            <CreatableSelect
                isClearable
                placeholder="Choose a folder or create new..."
                value={selectedFolder ? { label: selectedFolder.folderName, value: selectedFolder.id } : null}
                options={[{ label: "None", value: "" }, ...folders.map((f) => ({ label: f.folderName, value: f.id }))]}
                onChange={(option) => {
                    if (!option || option.value === "") {
                        onChange(undefined);
                    } else {
                        const exists = folders.find((f) => f.id === option.value || f.folderName === option.label);
                        const folder = exists || {
                            id: `temp-${Date.now()}`, // đánh dấu là folder mới chưa có trên server
                            folderName: option.label,
                            ownerId: "1"
                        };
                        onChange(folder);
                    }
                }}
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        position: "absolute", // cần có
                    }),
                    menu: (base) => ({
                        ...base,
                        background: darkMode ? "#1F2937" : "#FFFFFF",
                    }),
                    menuList: (base) => ({
                        ...base,
                        maxHeight: "200px", // quan trọng để scroll
                        overflowY: "auto",  // phần cuộn nằm ở đây
                        scrollbarWidth: "thin",
                    }),
                    control: (base, state) => ({
                        ...base,
                        borderRadius: "8px",
                        border: `2px solid ${state.isFocused
                            ? (darkMode ? "#3B82F6" : "#2563EB")
                            : darkMode ? "#374151" : "#E5E7EB"}`,
                        background: darkMode ? "#1F2937" : "#FFFFFF",
                        fontSize: "16px",
                        minHeight: "54px",
                        boxShadow: state.isFocused
                            ? `0 0 0 3px ${darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)"}`
                            : "none",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: darkMode ? "#4B5563" : "#D1D5DB",
                        },
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                            ? darkMode
                                ? "#374151" // nhẹ hơn nền để vẫn nhìn thấy hover
                                : "#E5E7EB"
                            : "transparent",
                        color: darkMode
                            ? state.isFocused
                                ? "#FFFFFF" // giữ chữ trắng rõ khi hover
                                : "#D1D5DB"
                            : state.isFocused
                                ? "#111827"
                                : "#374151",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: darkMode ? "#9CA3AF" : "#6B7280",
                        fontWeight: 400,
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: darkMode ? "#F3F4F6" : "#111827",
                    }),
                }}
            />
        </div>
    );
};

export default FolderSelect;
