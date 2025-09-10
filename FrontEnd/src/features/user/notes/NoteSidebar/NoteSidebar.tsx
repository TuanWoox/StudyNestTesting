import React, { useState } from 'react';
import { Input, Button, Space, Tooltip, Collapse } from 'antd';
import { SearchOutlined, PlusOutlined, FileTextOutlined, FolderOutlined, TagsOutlined } from '@ant-design/icons';
import NoteCard from './NoteCard';
import { Note, Folder, Tag, NoteTag } from '@/types/notes';

interface NoteSidebarProps {
    darkMode: boolean;
    notes: Note[];
    folders: Folder[];
    tags: Tag[];
    selectedNote: Note | null;
    setSelectedNote: (note: Note) => void;
    handleCreateNote: () => void;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

type ViewMode = 'all' | 'folder' | 'tag';

const NoteSidebar: React.FC<NoteSidebarProps> = ({
    darkMode,
    notes,
    folders,
    tags,
    selectedNote,
    setSelectedNote,
    handleCreateNote,
    setIsModalVisible
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('all');

    // Filter
    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFolders = folders.filter((folder) =>
        folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Folder view: lấy notes từ folder.notes
    const folderItems = filteredFolders.map((folder) => ({
        key: folder.id,
        label: (<div className="flex justify-between items-center w-full">
            <span style={{ fontWeight: 600, fontSize: 16 }}><FolderOutlined /> {folder.folderName}</span>
            <span style={{ fontSize: 12, color: '#999' }}>{folder.notes?.length || 0} notes</span>
        </div>),
        children: (folder.notes && folder.notes.length > 0) ? (
            <div className="flex flex-col gap-2">
                {folder.notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        darkMode={darkMode}
                        isSelected={selectedNote?.id === note.id}
                        onSelect={() => setSelectedNote(note)}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-3 text-gray-500 italic text-sm select-none">
                No notes in this folder
            </div>
        ),
        style: {
            background: darkMode ? "linear-gradient(135deg, #1E293B, #334155)" : "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
            borderRadius: 8,
            marginBottom: 8,
            boxShadow: darkMode
                ? '0 1px 3px rgba(0,0,0,0.6)'
                : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
        }
    }));

    // Tag view: lấy notes từ tag.noteTags[].note
    const tagItems = filteredTags.map((tag) => ({
        key: tag.id,
        label: (<div className="flex justify-between items-center w-full">
            <span style={{ fontWeight: 600, fontSize: 16 }}><TagsOutlined /> {tag.name}</span>
            <span style={{ fontSize: 12, color: '#999' }}>{tag.noteTags?.length || 0} notes</span>
        </div>),
        children: (tag.noteTags && tag.noteTags.length > 0) ? (
            <div className="flex flex-col gap-2">
                {tag.noteTags.map((noteTag: NoteTag) => (
                    noteTag.note ? (
                        <NoteCard
                            key={noteTag.note.id}
                            note={noteTag.note}
                            darkMode={darkMode}
                            isSelected={selectedNote?.id === noteTag.note.id}
                            onSelect={() => setSelectedNote(noteTag.note!)}
                        />
                    ) : null
                ))}
            </div>
        ) : (
            <div className="text-center py-3 text-gray-500 italic text-sm select-none">
                No notes with this tag
            </div>
        ),
        style: {
            background: darkMode ? "linear-gradient(135deg, #1E293B, #334155)" : "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
            borderRadius: 8,
            marginBottom: 8,
            boxShadow: darkMode
                ? '0 1px 3px rgba(0,0,0,0.6)'
                : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
        },
    }));

    return (
        <div className="w-1/4 shrink-0 h-full overflow-y-auto p-4 border-r"
            style={{
                backgroundColor: darkMode ? "#0f0f0f" : "#FFFFFF",
                borderColor: darkMode ? "#212121" : "#E5E7EB",
            }}>
            {/* Actions */}
            <div className="flex justify-between items-center mb-4">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNote}>New</Button>
                <Space size="middle">
                    <Tooltip title="All Notes">
                        <Button icon={<FileTextOutlined />} onClick={() => setViewMode("all")} type={viewMode === "all" ? "primary" : "default"} />
                    </Tooltip>
                    <Tooltip title="Folder View">
                        <Button icon={<FolderOutlined />} onClick={() => setViewMode("folder")} type={viewMode === "folder" ? "primary" : "default"} />
                    </Tooltip>
                    <Tooltip title="Tag View">
                        <Button icon={<TagsOutlined />} onClick={() => setViewMode("tag")} type={viewMode === "tag" ? "primary" : "default"} />
                    </Tooltip>
                </Space>
            </div>
            {/* Search */}
            <Input
                placeholder={
                    viewMode === "all"
                        ? "Search notes..."
                        : viewMode === "folder"
                            ? "Search folders..."
                            : "Search tags..."
                }
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    marginBottom: "10px",
                    backgroundColor: darkMode ? "#334155" : "#FFFFFF",
                    color: darkMode ? "#E2E8F0" : "#111827",
                    borderColor: darkMode ? "#475569" : "#D1D5DB",
                }}
            />
            {/* Notes / Folders / Tags */}
            <div>
                {viewMode === "all" && (
                    <div className="flex flex-col gap-3">
                        {filteredNotes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                darkMode={darkMode}
                                isSelected={selectedNote?.id === note.id}
                                onSelect={() => setSelectedNote(note)}
                            />
                        ))}
                    </div>
                )}

                {viewMode === "folder" && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ fontWeight: 625, fontSize: '18px' }}> <FolderOutlined /> Folders</h3>
                            <Button
                                type="default"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                                style={{
                                    background: darkMode ? "linear-gradient(135deg, #1E293B, #334155)" : "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
                                    border: "none",
                                    color: darkMode ? "#F1F5F9" : "#111827",
                                    fontWeight: 500,
                                    borderRadius: 8,
                                    padding: "0 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    boxShadow: darkMode
                                        ? "0 1px 3px rgba(0,0,0,0.6)"
                                        : "0 1px 3px rgba(0,0,0,0.1)",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget.style.background = darkMode
                                        ? "linear-gradient(135deg, #334155, #475569)"
                                        : "linear-gradient(135deg, #E5E7EB, #D1D5DB)");
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget.style.background = darkMode
                                        ? "linear-gradient(135deg, #1E293B, #334155)"
                                        : "linear-gradient(135deg, #F3F4F6, #E5E7EB)");
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Add Folder
                            </Button>
                        </div>
                        <Collapse
                            ghost
                            expandIconPosition="end"
                            style={{
                                backgroundColor: 'transparent',
                                borderRadius: '8px',
                            }}
                            items={folderItems} />
                    </>
                )}

                {viewMode === "tag" && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ fontWeight: 625, fontSize: '18px' }}><TagsOutlined /> Tags</h3>
                        </div>
                        <Collapse
                            ghost
                            expandIconPosition="end"
                            style={{
                                backgroundColor: darkMode ? "#0f0f0f" : "#FFFFFF",
                                borderRadius: "8px",
                            }}
                            items={tagItems} />
                    </>
                )}
            </div>
        </div>
    );
};

export default NoteSidebar;