import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNotes } from '@/hooks/useNotes';
import { useFolders } from '@/hooks/useFolders';
import { useTags } from '@/hooks/useTags';
import NoteSidebar from './NoteSidebar/NoteSidebar';
import NoteEditor from './NoteEditor/NoteEditor';
import EmptyState from './EmptyState';
import ModalCreateFolder from './ModalCreateFolder';
import { Note, Folder, Tag } from '@/types/notes';
import { EStatus } from '@/utils/enums/EStatus';

const NotesPage: React.FC = () => {
    const darkMode = useOutletContext<boolean>();
    const { data: notes = [], isLoading: loadingNotes } = useNotes();
    const { data: folders = [], isLoading: loadingFolders } = useFolders();
    const { data: tags = [], isLoading: loadingTags } = useTags();

    const [notesState, setNotesState] = useState<Note[]>(notes);
    const [foldersState, setFoldersState] = useState<Folder[]>(folders);
    const [tagsState, setTagsState] = useState<Tag[]>(tags);

    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    if (loadingNotes || loadingFolders || loadingTags) return <div className="p-4">Loading...</div>;

    // Tạo note mới
    const handleCreateNote = () => {
        const newNote: Note = {
            id: `note-${Date.now()}`,
            title: 'Untitled Note',
            content: '',
            status: EStatus.InProgress,
            ownerId: '1',
            noteTags: [],
            folder: undefined
        };
        setSelectedNote(newNote);
    };

    // Giả lập update hoặc thêm note
    const handleUpdateNote = (updatedNote: Note) => {
        // TODO: Replace with API call
        setNotesState(prev => {
            const exists = prev.some(note => note.id === updatedNote.id);
            if (exists) {
                return prev.map(note => note.id === updatedNote.id ? updatedNote : note);
            } else {
                return [updatedNote, ...prev];
            }
        });
        setSelectedNote(updatedNote);
    };

    // Giả lập xóa note
    const handleDeleteNote = (id: string) => {
        // TODO: Replace with API call
        setNotesState(prev => prev.filter(note => note.id !== id));
        if (selectedNote?.id === id) setSelectedNote(null);
    };

    // Giả lập thêm folder
    const handleAddFolder = (folderName: string) => {
        // TODO: Replace with API call
        const newFolder: Folder = {
            id: `folder-${Date.now()}`,
            folderName,
            ownerId: '1',
            notes: [],
        };
        setFoldersState(prev => [...prev, newFolder]);
        return newFolder;
    };

    // Giả lập thêm tag
    const handleAddTag = (tagName: string) => {
        // TODO: Replace with API call
        const newTag: Tag = {
            id: `tag-${Date.now()}`,
            name: tagName,
            noteTags: [],
        };
        setTagsState(prev => [...prev, newTag]);
        return newTag;
    };
    // TODO: Thêm mutation update note, create folder, create tag nếu cần

    return (
        <div className={`flex flex-1 min-h-0 overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-[#0f0f0f] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <NoteSidebar
                darkMode={darkMode}
                notes={notes}
                folders={folders}
                tags={tags}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                handleCreateNote={handleCreateNote}
                setIsModalVisible={setIsModalVisible}
            />
            <div className="flex-1 min-h-0">
                {selectedNote ? (
                    <NoteEditor
                        darkMode={darkMode}
                        note={selectedNote}
                        folders={foldersState}
                        tags={tagsState}
                        // TODO: Thêm handleUpdateNote, handleDeleteNote, handleAddFolder, handleAddTag nếu cần
                        handleUpdateNote={handleUpdateNote}
                        handleDeleteNote={handleDeleteNote}
                        handleAddFolder={handleAddFolder}
                        handleAddTag={handleAddTag}
                    />
                ) : (
                    <EmptyState darkMode={darkMode} handleCreateNote={handleCreateNote} />
                )}
            </div>
            <ModalCreateFolder
                visible={isModalVisible}
                onCreate={handleAddFolder}
                onCancel={() => setIsModalVisible(false)}
                darkMode={darkMode}
            />
        </div>
    );
};

export default NotesPage;