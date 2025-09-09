import React, { useState } from "react";

interface ModalCreateFolderProps {
    visible: boolean;
    onCreate: (folderName: string) => void;
    onCancel: () => void;
    darkMode: boolean;
}

const ModalCreateFolder: React.FC<ModalCreateFolderProps> = ({
    visible,
    onCreate,
    onCancel,
    darkMode,
}) => {
    const [folderName, setFolderName] = useState("");

    const handleOk = () => {
        if (folderName.trim() !== "") {
            onCreate(folderName.trim());
            setFolderName("");
            onCancel();
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div
                className={`w-[400px] rounded-xl shadow-lg p-6 transition-all ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
                    }`}
            >
                {/* Title */}
                <h2 className="text-xl font-semibold mb-4">
                    Create New Folder
                </h2>

                {/* Input */}
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

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => {
                            setFolderName("");
                            onCancel();
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleOk}
                        className={`px-5 py-2 rounded-lg font-medium text-white transition ${darkMode
                            ? "bg-sky-500 hover:bg-sky-600"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateFolder;
