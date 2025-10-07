import React, { useState, useEffect } from "react";
import { Folder } from "@/types/note/notes";
import useUpdateFolder from "@/hooks/folderHook/useUpdateFolder";

interface ModalUpdateFolderProps {
    visible: boolean;
    onCancel: () => void;
    darkMode: boolean;
    folder: Folder | null; // folder cần update
    setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>;
}

const ModalUpdateFolder: React.FC<ModalUpdateFolderProps> = ({
    visible,
    onCancel,
    darkMode,
    folder,
    setSelectedFolder
}) => {
    const [folderName, setFolderName] = useState("");
    const { updateFolder, isLoading } = useUpdateFolder();

    // Khi modal mở, set sẵn tên cũ vào input
    useEffect(() => {
        if (folder) {
            setFolderName(folder.folderName || "");
        }
    }, [folder]);

    const handleOk = () => {
        if (folder && folderName.trim() !== "") {
            updateFolder(
                { id: folder.id, folderName: folderName.trim() },
                {
                    onSuccess: () => {
                        setFolderName("");
                        onCancel();
                    },
                }
            );
        }
    };

    const handleClose = () => {
        setFolderName("");
        setSelectedFolder(null);
        onCancel();
    }

    if (!visible || !folder) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div
                className={`w-[400px] rounded-xl shadow-lg p-6 transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
                    }`}
            >
                <h2 className="text-xl font-semibold mb-4">Update Folder</h2>

                <input
                    type="text"
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2 ${darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-sky-500 focus:border-sky-500"
                        : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className={`px-4 py-2 rounded-lg font-medium transition ${darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        onClick={handleOk}
                        className={`px-5 py-2 rounded-lg font-medium text-white transition ${darkMode ? "bg-sky-500 hover:bg-sky-600" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUpdateFolder;
