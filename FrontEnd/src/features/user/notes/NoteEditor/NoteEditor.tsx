import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Note, Folder, Tag, NoteTag, CreateNoteDTO, UpdateNoteDTO } from '@/types/note/notes';
import TitleInput from './TitleInput';
import ActionButtons from './ActionButtons';
import FolderSelect from './FolderSelect';
import TagSelect from './TagSelect';
import EditorWrapper from './EditorWrapper';
import useCreateNote from '@/hooks/noteHook/useCreateNote';
import useDeleteNote from '@/hooks/noteHook/useDeleteNote';
import useCreateFolder from '@/hooks/folderHook/useCreateFolder';
import useUpdateNote from '@/hooks/noteHook/useUpdateNote';

interface NoteEditorProps {
    visible: boolean;
    onClose: () => void;
    darkMode: boolean;
    note: Note | null;
    folders: Folder[];
    tags: Tag[];
    handleUpdateNote: (note: Note) => void;
    handleDeleteNote: (id: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
    visible, onClose, darkMode, note, folders, tags, handleUpdateNote, handleDeleteNote
}) => {
    const { createNote, isLoading: creatingNote } = useCreateNote();
    const { updateNote, isLoading: updatingNote } = useUpdateNote();
    const { deleteNote, isLoading: deletingNote } = useDeleteNote();
    const { createFolderAsync, isLoading: creatingFolder } = useCreateFolder();

    const [title, setTitle] = useState("");
    const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(undefined);
    // Lấy tags từ note.noteTags[].tag
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [content, setContent] = useState("");


    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setSelectedFolder(note.folder);
            setSelectedTags(note.noteTags?.map(nt => nt.tag) || []);
            setContent(note.content);
        }
    }, [note?.id]);

    const handleSave = async () => {
        if (!note) return;

        let folderId = selectedFolder?.id || "";

        // Nếu folder mới chưa có id thực, gọi API tạo folder trước
        if (selectedFolder && selectedFolder.id.startsWith("temp-")) {
            const createdFolder = await createFolderAsync({
                id: "string", folderName: selectedFolder.folderName.trim(), ownerId: "string",
            });
            folderId = createdFolder.id;
            setSelectedFolder(createdFolder);
        };

        const tagsNames = selectedTags.map(tag => tag.name);
        console.log("folderId", folderId);

        // Nếu note chưa có id thật (id tạm), gọi API tạo note
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
            createNote(payload
                , {
                    onSuccess: () => {
                        onClose();
                    }
                });
        } else {
            // Nếu đã có id thật, gọi API update (nếu có)
            const payload: UpdateNoteDTO = {
                id: note.id,
                title,
                content,
                status: note.status,
                folderId: selectedFolder ? selectedFolder.id : "",
                ownerId: note.ownerId,
            };
            updateNote(payload, {
                onSuccess: () => { onClose(); }
            });
        };
    };

    const handleDelete = () => {
        if (note) {
            // Nếu note là note ảo (id tạm), chỉ xóa ở local
            if (note.id.startsWith("note-")) {
                handleDeleteNote(note.id);
                onClose();
            } else {
                // Nếu note đã lưu DB, gọi API xóa
                deleteNote(note.id, {
                    onSuccess: () => {
                        handleDeleteNote(note.id); // xóa khỏi state ở NotesPage
                        onClose();
                    }
                });
            }
        }
    };

    if (!visible || !note) return null;

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null} // ẩn footer mặc định
            centered
            width="95%" // tương tự w-[95%]
            destroyOnHidden // xoá state khi đóng để tránh lỗi Editor data cũ
            closable={false} // tắt nút mặc định để dùng ✕ custom
            keyboard // cho phép ESC đóng
            maskClosable={false} // ko cho phép click ngoài để đóng
            styles={{
                content: { padding: 0 }, // xoá padding mặc định của ant-modal-content
            }}
            bodyStyle={{
                padding: 0,
                borderRadius: "1rem", // rounded-2xl
                maxHeight: "90vh",
                overflowY: "auto",
                background: darkMode ? "#111827" : "#ffffff", // gần bg-gray-900
                boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                scrollbarWidth: "thin",
            }}
            maskStyle={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)", // hiệu ứng blur nền
            }}
        >
            <div
                className={`relative w-full transition-all ${darkMode ? "text-gray-100" : "text-gray-800"
                    }`}
            >
                {/* ✕ nút đóng custom */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                >
                    ✕
                </button>

                <div className="flex flex-col h-full p-6">
                    {/* Title + Buttons */}
                    <div className="flex items-start justify-between mb-4">
                        <TitleInput value={title} onChange={setTitle} darkMode={darkMode} />
                        <ActionButtons
                            onSave={handleSave}
                            onDelete={handleDelete}
                            darkMode={darkMode}
                            isCreating={creatingNote}
                            isDeleting={deletingNote}
                            isUpdating={updatingNote}
                        />
                    </div>

                    {/* Folder + Tags */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <FolderSelect
                            selectedFolder={selectedFolder}
                            folders={folders}
                            onChange={setSelectedFolder}
                            darkMode={darkMode}
                        />
                        <TagSelect
                            selectedTags={selectedTags}
                            tags={tags}
                            onChange={setSelectedTags}
                            darkMode={darkMode}
                        />
                    </div>

                    {/* Nội dung */}
                    <EditorWrapper
                        noteId={note?.id || ""}
                        content={note?.content}
                        onChange={setContent}
                        darkMode={darkMode}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default NoteEditor;