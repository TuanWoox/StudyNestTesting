import React, { useState, useEffect } from 'react';
import { Note, Folder, Tag, NoteTag } from '@/types/notes';
import TitleInput from './TitleInput';
import ActionButtons from './ActionButtons';
import FolderSelect from './FolderSelect';
import TagSelect from './TagSelect';
import EditorWrapper from './EditorWrapper';

interface NoteEditorProps {
    darkMode: boolean;
    note: Note;
    folders: Folder[];
    tags: Tag[];
    handleUpdateNote: (note: Note) => void;
    handleDeleteNote: (id: string) => void;
    handleAddFolder: (folderName: string) => Folder;
    handleAddTag: (tagName: string) => Tag;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
    darkMode, note, folders, tags, handleUpdateNote, handleDeleteNote, handleAddFolder, handleAddTag
}) => {
    const [title, setTitle] = useState(note.title);
    const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(note.folder);
    // Lấy tags từ note.noteTags[].tag
    const [selectedTags, setSelectedTags] = useState<Tag[]>(note.noteTags?.map(nt => nt.tag) || []);
    const [content, setContent] = useState(note.content);

    useEffect(() => {
        setTitle(note.title);
        setSelectedFolder(note.folder);
        setSelectedTags(note.noteTags?.map(nt => nt.tag) || []);
        setContent(note.content);
    }, [note.id]);

    const handleSave = () => {
        // Chuyển selectedTags thành noteTags
        const noteTags: NoteTag[] = selectedTags.map(tag => ({
            noteId: note.id,
            tagId: tag.id,
            tag,
        }));
        handleUpdateNote({ ...note, title, folder: selectedFolder, noteTags, content });
    };

    return (
        <div className={`flex flex-col h-full p-6 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <div className="flex items-start justify-between mb-4 ">
                <TitleInput value={title} onChange={setTitle} darkMode={darkMode} />
                <ActionButtons onSave={handleSave} onDelete={() => handleDeleteNote(note.id)} darkMode={darkMode} />
            </div>

            <div className="flex gap-4 mb-4">
                <FolderSelect selectedFolder={selectedFolder} folders={folders} onChange={setSelectedFolder} onAddFolder={handleAddFolder} darkMode={darkMode} />
                <TagSelect selectedTags={selectedTags} tags={tags} onChange={setSelectedTags} onAddTag={handleAddTag} darkMode={darkMode} />
            </div>

            <EditorWrapper noteId={note.id} content={note.content} onChange={setContent} darkMode={darkMode} />
        </div>
    );
};

export default NoteEditor;
