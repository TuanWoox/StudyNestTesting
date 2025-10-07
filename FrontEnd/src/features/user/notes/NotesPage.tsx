import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Note, Folder, Tag } from "@/types/note/notes";
import { EStatus } from "@/utils/enums/EStatus";
import useGetAllFolder from "@/hooks/folderHook/useGetAllFolder";
import useGetAllTag from "@/hooks/tagHook/useGetAllTag";
import useGetAllNote from "@/hooks/noteHook/useGetAllNote";
import NoteSidebar from "./NoteSidebar/NoteSidebar";
import NoteEditor from "./NoteEditor/NoteEditor";
import ModalCreateFolder from "./ModalCreateFolder";
import ModalUpdateFolder from "./ModalUpdateFolder";
import ModalDeleteFolder from "./ModalDeleteFolder";

const NotesPage: React.FC = () => {
    const darkMode = useOutletContext<boolean>();

    const {
        data: noteData,
        isLoading: loadingNotes,
        isError: errorNotes,
    } = useGetAllNote({ pageSize: -1, pageNumber: 0 });

    const {
        data: tagData,
        isLoading: loadingTags,
        isError: errorTags,
    } = useGetAllTag({ pageSize: -1, pageNumber: 0 });

    // Gọi API lấy folders có phân trang
    const {
        data: folderData,
        isLoading: loadingFolders,
        isError: errorFolders,
    } = useGetAllFolder({ pageSize: -1, pageNumber: 0 });

    const folders = folderData?.data || []; // `data` là mảng thư mục trong PagedData
    const tags = tagData?.data || [];
    const notes = noteData?.data || [];

    const [notesState, setNotesState] = useState<Note[]>(notes);
    // const [tagsState, setTagsState] = useState<Tag[]>(tags);

    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

    const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [isEditorVisible, setIsEditorVisible] = useState(false);


    if (loadingNotes || loadingFolders || loadingTags)
        return <div className="p-4">Loading...</div>;
    if (errorNotes || errorFolders || errorTags) return <div className="p-4 text-red-500">Failed to load folders.</div>;

    const handleCreateNote = () => {
        const newNote: Note = {
            id: `note-${Date.now()}`,
            title: "Untitled Note",
            content: "",
            status: EStatus.InProgress,
            ownerId: "1",
            noteTags: [],
            folder: undefined,
        };
        setSelectedNote(newNote);
        setIsEditorVisible(true);
    };

    const handleUpdateNote = (updatedNote: Note) => {
        setNotesState((prev) => {
            const exists = prev.some((note) => note.id === updatedNote.id);
            if (exists) {
                return prev.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note
                );
            } else {
                return [updatedNote, ...prev];
            }
        });
        setSelectedNote(updatedNote);
    };

    const handleDeleteNote = (id: string) => {
        setNotesState((prev) => prev.filter((note) => note.id !== id));
        if (selectedNote?.id === id) setSelectedNote(null);
    };

    const handleOpenEditor = (note: Note) => {
        setSelectedNote(note);
        setIsEditorVisible(true);
    };

    const handleCloseEditor = () => {
        setIsEditorVisible(false);
        setSelectedNote(null);
    };

    return (
        <div
            className={`flex flex-1 min-h-0 overflow-hidden transition-colors duration-300 ${darkMode ? "bg-[#0f0f0f] text-gray-100" : "bg-gray-50 text-gray-900"
                }`}
        >
            <NoteSidebar
                darkMode={darkMode}
                notes={notes}
                folders={folders} // dùng dữ liệu từ API
                tags={tags}
                selectedNote={selectedNote}
                handleOpenEditor={handleOpenEditor}
                handleCreateNote={handleCreateNote}
                setIsModalCreateVisible={setIsModalCreateVisible}
                setIsModalUpdateVisible={setIsModalUpdateVisible}  // truyền thêm
                setIsModalDeleteVisible={setIsModalDeleteVisible}  // truyền thêm
                setSelectedFolder={setSelectedFolder}              // truyền thêm
            />
            <ModalCreateFolder
                visible={isModalCreateVisible}
                onCancel={() => setIsModalCreateVisible(false)}
                darkMode={darkMode}
            />
            <ModalUpdateFolder
                visible={isModalUpdateVisible}
                onCancel={() => setIsModalUpdateVisible(false)}
                darkMode={darkMode}
                folder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
            />
            <ModalDeleteFolder
                visible={isModalDeleteVisible}
                onCancel={() => setIsModalDeleteVisible(false)}
                darkMode={darkMode}
                folder={selectedFolder}
            />
            <NoteEditor
                visible={isEditorVisible}
                onClose={handleCloseEditor}
                darkMode={darkMode}
                note={selectedNote}
                folders={folders}
                tags={tags}
                handleUpdateNote={handleUpdateNote}
                handleDeleteNote={handleDeleteNote}
            />
        </div>
    );
};

export default NotesPage;
