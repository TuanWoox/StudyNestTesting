import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Folder } from "@/types/note/notes";
import useCreateFolder from "@/hooks/folderHook/useCreateFolder";
import useUpdateFolder from "@/hooks/folderHook/useUpdateFolder";
import useDeleteFolder from "@/hooks/folderHook/useDeleteFolder";

type ModalMode = "create" | "update" | "delete";

interface ModalFolderProps {
    visible: boolean;
    mode: ModalMode;
    darkMode: boolean;
    onCancel: () => void;
    folder?: Folder | null;
    setSelectedFolder?: React.Dispatch<React.SetStateAction<Folder | null>>;
}

const ModalFolder: React.FC<ModalFolderProps> = ({
    visible,
    mode,
    darkMode,
    onCancel,
    folder,
    setSelectedFolder,
}) => {
    const [folderName, setFolderName] = useState("");

    const { createFolder, isLoading: creating } = useCreateFolder();
    const { updateFolder, isLoading: updating } = useUpdateFolder();
    const { deleteFolder, isLoading: deleting } = useDeleteFolder();

    // Khi mở modal update → tự động fill tên folder
    useEffect(() => {
        if (mode === "update" && folder) {
            setFolderName(folder.folderName || "");
        } else if (mode === "create") {
            setFolderName("");
        }
    }, [mode, folder]);

    const handleClose = () => {
        setFolderName("");
        setSelectedFolder?.(null);
        onCancel();
    };

    const handleSubmit = () => {
        if (mode === "create" && folderName.trim() !== "") {
            createFolder(
                { id: "string", folderName: folderName.trim(), ownerId: "string" },
                { onSuccess: handleClose }
            );
        } else if (mode === "update" && folder && folderName.trim() !== "") {
            updateFolder(
                { id: folder.id, folderName: folderName.trim() },
                { onSuccess: handleClose }
            );
        } else if (mode === "delete" && folder) {
            deleteFolder(folder.id, { onSuccess: handleClose });
        }
    };

    const titleMap = {
        create: "Create New Folder",
        update: "Update Folder",
        delete: "Delete Folder",
    };

    const actionTextMap = {
        create: "Create",
        update: "Update",
        delete: "Delete",
    };

    const isLoading = creating || updating || deleting;

    return (
        <Modal
            open={visible}
            title={titleMap[mode]}
            onCancel={handleClose}
            onOk={handleSubmit}
            okText={isLoading ? `${actionTextMap[mode]}ing...` : actionTextMap[mode]}
            cancelText={"Cancel"}
            okButtonProps={{
                loading: isLoading,
                danger: mode === "delete",
                style: {
                    backgroundColor:
                        mode === "delete"
                            ? darkMode
                                ? "#dc2626"
                                : "#ef4444"
                            : darkMode
                                ? "#0ea5e9"
                                : "#1677ff",
                    border: "none",
                },
            }}
            cancelButtonProps={{
                style: {
                    color: darkMode ? "#d1d5db" : "#374151",
                    backgroundColor: darkMode ? "#1f2937" : "#e5e7eb",
                    border: "none",
                },
                disabled: isLoading
            }}
            centered
            closable={false}
            maskClosable={false}
            styles={{
                mask: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                }
            }}
        >
            {mode === "delete" ? (
                <p className="text-sm">
                    Are you sure you want to delete the folder{" "}
                    <span className="font-semibold">{folder?.folderName}</span>? <br />
                    This action{" "}
                    <span className="text-red-500 font-semibold">cannot be undone.</span>
                </p>
            ) : (
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
            )}
        </Modal>
    );
};

export default ModalFolder;
