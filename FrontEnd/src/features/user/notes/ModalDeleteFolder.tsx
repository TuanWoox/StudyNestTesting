import React from "react";
import { Folder } from "@/types/note/notes";
import useDeleteFolder from "@/hooks/folderHook/useDeleteFolder";

interface ModalDeleteFolderProps {
    visible: boolean;
    onCancel: () => void;
    darkMode: boolean;
    folder: Folder | null; // folder cần xoá
}

const ModalDeleteFolder: React.FC<ModalDeleteFolderProps> = ({
    visible,
    onCancel,
    darkMode,
    folder,
}) => {
    const { deleteFolder, isLoading } = useDeleteFolder();

    const handleDelete = () => {
        if (folder) {
            deleteFolder(folder.id, {
                onSuccess: () => {
                    onCancel();
                },
            });
        }
    };

    if (!visible || !folder) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div
                className={`w-[400px] rounded-xl shadow-lg p-6 transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
                    }`}
            >
                <h2 className="text-xl font-semibold mb-4">Delete Folder</h2>
                <p className="text-sm mb-6">
                    Are you sure you want to delete the folder{" "}
                    <span className="font-semibold">{folder.folderName}</span>?
                    <br />
                    This action <span className="text-red-500 font-semibold">cannot be undone.</span>
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className={`px-4 py-2 rounded-lg font-medium transition ${darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        onClick={handleDelete}
                        className={`px-5 py-2 rounded-lg font-medium text-white transition ${darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                            }`}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDeleteFolder;
