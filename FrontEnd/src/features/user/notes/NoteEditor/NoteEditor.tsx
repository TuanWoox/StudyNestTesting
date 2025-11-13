import React, { useState, useEffect } from "react";
import { Modal, theme } from "antd";
import { Note, Folder, Tag, CreateNoteDTO, UpdateNoteDTO } from "@/types/note/notes";
import TitleInput from "./components/TitleInput";
import ActionButtons from "./components/ActionButtons";
import FolderSelect from "./components/FolderSelect";
import TagSelect from "./components/TagSelect";
import EditorWrapper from "./components/EditorWrapper";
import useCreateNote from "@/hooks/noteHook/useCreateNote";
import useCreateFolder from "@/hooks/folderHook/useCreateFolder";
import useUpdateNote from "@/hooks/noteHook/useUpdateNote";
import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector";
import { selectDarkMode } from "@/store/themeSlice";

interface NoteEditorProps {
    visible: boolean;
    onClose: () => void;
    // darkMode: boolean;
    note: Note | null;
    folders: Folder[];
    tags: Tag[];
}

const NoteEditor: React.FC<NoteEditorProps> = ({
    visible,
    onClose,
    // darkMode,
    note,
    folders,
    tags,
}) => {
    const darkMode = useReduxSelector(selectDarkMode);
    const { token } = theme.useToken();
    const { createNote, isLoading: creatingNote } = useCreateNote();
    const { updateNote, isLoading: updatingNote } = useUpdateNote();
    const { createFolderAsync } = useCreateFolder();

    const [title, setTitle] = useState("");
    const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(undefined);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [content, setContent] = useState("");

    // === Retro color tokens ===
    const borderColor = `${token.colorPrimary}E0`; // 88%
    const shadowColor = `${token.colorPrimary}55`; // 33%
    const backgroundColor = darkMode ? "#1E1E1E" : "#FFFDF8";
    const textColor = darkMode ? "#E5E7EB" : "#111827";

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setSelectedFolder(note.folder);
            setSelectedTags(note.noteTags?.map((nt) => nt.tag) || []);
            setContent(note.content);
        }
    }, [note?.id]);

    const handleSave = async () => {
        if (!note) return;

        let folderId = selectedFolder?.id || "";

        if (selectedFolder && selectedFolder.id.startsWith("temp-")) {
            const createdFolder = await createFolderAsync({
                id: "string",
                folderName: selectedFolder.folderName.trim(),
                ownerId: "string",
            });
            folderId = createdFolder.id;
            setSelectedFolder(createdFolder);
        }

        const tagsNames = selectedTags.map((tag) => tag.name);

        if (note.id.startsWith("note-")) {
            const payload: CreateNoteDTO = {
                id: "string",
                title,
                content,
                status: note.status,
                folderId,
                tagsNames,
                ownerId: note.ownerId,
            };
            createNote(payload, { onSuccess: onClose });
        } else {
            const payload: UpdateNoteDTO = {
                id: note.id,
                title,
                content,
                status: note.status,
                folderId,
                tagsNames,
                ownerId: note.ownerId,
            };
            updateNote(payload, { onSuccess: onClose });
        }
    };

    const hasUnsavedChanges = () => {
        return (
            title !== note?.title ||
            content !== note?.content ||
            selectedFolder?.id !== note?.folder?.id ||
            JSON.stringify(selectedTags.map((t) => t.id).sort()) !==
            JSON.stringify(note?.noteTags?.map((nt) => nt.tag.id).sort())
        );
    };

    if (!visible || !note) return null;

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width="95%"
            closable={false}
            keyboard
            maskClosable={false}
            styles={{
                content: {
                    padding: 0,
                    height: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor,
                    boxShadow: `6px 6px 0 ${shadowColor}`,
                    fontFamily: '"Courier New", monospace',
                    color: textColor,
                    transition: "all 0.3s ease",
                },
                body: {
                    padding: 0,
                    flex: 1, // để body chiếm hết chiều cao còn lại
                    height: "100%",
                    minHeight: "0",
                    overflowY: "hidden",
                },
                mask: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                },
            }}
        >
            <div
                className={`relative w-full h-full p-4 transition-all ${darkMode ? "text-gray-100" : "text-gray-800"
                    }`}
            >
                {/* Nội dung chính */}
                <div className="flex flex-col h-full gap-4">
                    {/* Title */}
                    <div>
                        <TitleInput
                            value={title}
                            onChange={setTitle}
                        // darkMode={darkMode} 
                        />
                    </div>

                    {/* Folder + Tags */}
                    <div className="flex flex-wrap gap-4">
                        <FolderSelect
                            selectedFolder={selectedFolder}
                            folders={folders}
                            onChange={setSelectedFolder}
                        // darkMode={darkMode}
                        />
                        <TagSelect
                            selectedTags={selectedTags}
                            tags={tags}
                            onChange={setSelectedTags}
                        // darkMode={darkMode}
                        />
                    </div>

                    {/* Editor */}
                    <div className="flex-1 min-h-0">
                        <EditorWrapper
                            noteId={note?.id || ""}
                            content={note?.content}
                            onChange={setContent}
                        // darkMode={darkMode}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-2 flex justify-end">
                        <ActionButtons
                            onSave={handleSave}
                            onClose={onClose}
                            // darkMode={darkMode}
                            isCreating={creatingNote}
                            isUpdating={updatingNote}
                            confirmBeforeClose={hasUnsavedChanges()}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default NoteEditor;
