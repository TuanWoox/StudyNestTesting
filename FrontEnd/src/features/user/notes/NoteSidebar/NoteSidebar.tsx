import React, { useState } from 'react';
import {
    Input,
    Button,
    Space,
    Tooltip,
    Collapse,
    Dropdown,
    Menu,
    Empty,
    Typography,
    theme
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    FileTextOutlined,
    FolderOutlined,
    TagsOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    FilterOutlined
} from '@ant-design/icons';
import NoteCard from './NoteCard';
import { Note, Folder, Tag, NoteTag } from '@/types/note/notes';
import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector";
import { selectDarkMode } from "@/store/themeSlice";

interface NoteSidebarProps {
    // darkMode: boolean;
    notes: Note[];
    folders: Folder[];
    tags: Tag[];
    selectedNote: Note | null;
    handleOpenEditor: (note: Note) => void;
    handleCreateNote: (folder?: Folder | undefined) => void;
    setFolderModalMode: React.Dispatch<React.SetStateAction<"delete" | "create" | "update">>;
    setIsModalFolderVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>;
}

type ViewMode = 'all' | 'folder' | 'tag';

const { Title, Text } = Typography;

const NoteSidebar: React.FC<NoteSidebarProps> = ({
    // darkMode,
    notes,
    folders,
    tags,
    selectedNote,
    handleOpenEditor,
    handleCreateNote,
    setFolderModalMode,
    setIsModalFolderVisible,
    setSelectedFolder,
}) => {
    const darkMode = useReduxSelector(selectDarkMode);
    const { token } = theme.useToken();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('all');

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredFolders = folders.filter((folder) =>
        folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Retro tone helpers
    const borderColor = `${token.colorPrimary}E0`; // 88% opacity
    const shadowColor = `${token.colorPrimary}55`; // 33% opacity
    const headerColor = token.colorText

    // Folder view
    const folderItems = filteredFolders.map((folder) => {
        const menu = (
            <Menu
                onClick={(e) => e.domEvent.stopPropagation()}
                items={[
                    {
                        key: 'create-note',
                        icon: <PlusOutlined />,
                        label: 'Create Note',
                        onClick: () => handleCreateNote(folder),
                    },
                    {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Edit Folder',
                        onClick: () => {
                            setSelectedFolder(folder);
                            setFolderModalMode('update');
                            setIsModalFolderVisible(true);
                        },
                    },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        label: 'Delete Folder',
                        onClick: () => {
                            setSelectedFolder(folder);
                            setFolderModalMode('delete');
                            setIsModalFolderVisible(true);
                        },
                    },
                ]}
            />
        );

        return {
            key: folder.id,
            label: (
                <div
                    className="flex justify-between items-center w-full overflow-hidden"
                    style={{
                        fontFamily: '"Courier New", monospace',
                        // color: darkMode ? '#E2E8F0' : '#1A202C',
                    }}
                >
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        <FolderOutlined />
                        <Tooltip title={folder.folderName} placement="topLeft">
                            <span
                                className="font-semibold line-clamp-1 cursor-pointer transition-all"
                            // style={{
                            //     color: borderColor,
                            // }}
                            >
                                {folder.folderName}
                            </span>
                        </Tooltip>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span style={{ fontSize: 12, opacity: 0.7 }}>
                            {folder.notes?.length || 0} notes
                        </span>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button
                                size="small"
                                icon={<MoreOutlined />}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: darkMode ? '#E2E8F0' : '#1A202C',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Dropdown>
                    </div>
                </div>
            ),
            children: folder.notes?.length ? (
                <div
                    className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    style={{ fontFamily: '"Courier New", monospace' }}
                >
                    {folder.notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            // darkMode={darkMode}
                            isSelected={selectedNote?.id === note.id}
                            onSelect={() => handleOpenEditor(note)}
                            isDeleteAvailable
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="text-center py-3 italic text-sm select-none"
                    style={{
                        opacity: 0.7,
                        fontFamily: '"Courier New", monospace'
                    }}
                >
                    No notes in this folder
                </div>
            ),
            style: {
                background: darkMode ? "linear-gradient(135deg, #1E293B, #334155)" : '#FDFBF8',
                borderRadius: 0,
                marginBottom: 8,
                border: `1px solid ${borderColor}`,
                boxShadow: `3px 3px 0 ${shadowColor}`,
                transition: 'all 0.3s ease',
            },
        };
    });

    // Tag view
    const tagItems = filteredTags.map((tag) => ({
        key: tag.id,
        label: (
            <div
                className="flex justify-between items-center w-full"
                style={{
                    fontFamily: '"Courier New", monospace',
                    // color: darkMode ? '#E2E8F0' : '#1A202C',
                }}
            >
                <span style={{ fontWeight: 600 }}>
                    <TagsOutlined /> {tag.name}
                </span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {tag.noteTags?.length || 0} notes
                </span>
            </div>
        ),
        children: tag.noteTags?.length ? (
            <div
                className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ fontFamily: '"Courier New", monospace' }}
            >
                {tag.noteTags.map((noteTag: NoteTag) =>
                    noteTag.note ? (
                        <NoteCard
                            key={noteTag.note.id}
                            note={noteTag.note}
                            // darkMode={darkMode}
                            isSelected={selectedNote?.id === noteTag.note.id}
                            onSelect={() => handleOpenEditor(noteTag.note!)}
                            isDeleteAvailable
                        />
                    ) : null
                )}
            </div>
        ) : (
            <div
                className="text-center py-3 italic text-sm select-none"
                style={{ opacity: 0.7 }}
            >
                No notes with this tag
            </div>
        ),
        style: {
            background: darkMode ? "linear-gradient(135deg, #1E293B, #334155)" : '#FDFBF8',
            borderRadius: 0,
            marginBottom: 8,
            border: `1px solid ${borderColor}`,
            boxShadow: `3px 3px 0 ${shadowColor}`,
        },
    }));

    return (
        <div
            className="w-full shrink-0 h-full overflow-y-auto px-6 pt-4 pb-5 border-r"
            style={{
                fontFamily: '"Courier New", monospace',
                // backgroundColor: darkMode ? '#0f0f0f' : '#FFFEFA',
                backgroundColor: token.colorBgLayout,
                borderColor: darkMode ? '#212121' : borderColor,
                scrollbarWidth: "none"
            }}
        >
            {/* Header - retro style */}
            {/* Title */}
            <div className="mb-3 flex justify-between items-center"
                style={{
                    color: `${headerColor}`
                }}>
                <div>
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            fontFamily: "monospace",
                        }}
                    >
                        Note Management
                    </Title>
                    <Text
                        type="secondary"
                        style={{
                            fontSize: 15,
                            marginTop: 4,
                            display: "block",
                            fontFamily: "monospace",
                        }}
                    >
                        Manage your notes
                    </Text>
                </div>
                <Button
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={() => handleCreateNote()}
                    style={{
                        fontWeight: 600,
                        boxShadow: `3px 3px 0 ${shadowColor}`,
                        border: `1px solid ${borderColor}`,
                        fontFamily: '"Courier New", monospace',
                        borderRadius: 0,
                        fontSize: 20,
                        lineHeight: 0.75
                    }}
                >
                    New
                </Button>
            </div>
            <div
                className={`mb-6 p-5 rounded-none border transition-all duration-300`}
                style={{
                    border: `1px solid ${borderColor}`,
                    boxShadow: `4px 4px 0 ${shadowColor}`,
                    fontFamily: '"Courier New", monospace',
                }}
            >
                {/* Search Input */}
                <div className='flex justify-between gap-4 mb-3'>
                    <Input
                        placeholder={
                            viewMode === 'all'
                                ? 'Search notes...'
                                : viewMode === 'folder'
                                    ? 'Search folders...'
                                    : 'Search tags...'
                        }
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: `1px solid ${borderColor}`,
                            boxShadow: `2px 2px 0 ${shadowColor}`,
                            fontFamily: '"Courier New", monospace',
                            fontSize: 15,
                            borderRadius: "0px"
                        }}
                    />
                    <Button
                        type="default"
                        icon={<FilterOutlined />}
                        onClick={() => console.log("Filter button click")}
                        style={{
                            fontWeight: 600,
                            boxShadow: `3px 3px 0 ${shadowColor}`,
                            border: `1px solid ${borderColor}`,
                            fontFamily: '"Courier New", monospace',
                            borderRadius: 0,
                            fontSize: 20,
                            lineHeight: 0.75
                        }}
                    >
                        Filter
                    </Button>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2">
                    <Space size="middle">
                        {[
                            { icon: <FileTextOutlined />, mode: 'all', title: 'All Notes' },
                            { icon: <FolderOutlined />, mode: 'folder', title: 'Folder View' },
                            { icon: <TagsOutlined />, mode: 'tag', title: 'Tag View' },
                        ].map(({ icon, mode, title }) => (
                            <Tooltip key={mode} title={title} getPopupContainer={(trigger) => trigger.parentElement!}>
                                <Button
                                    icon={icon}
                                    onClick={() => setViewMode(mode as ViewMode)}
                                    type={viewMode === mode ? 'primary' : 'default'}
                                    style={{
                                        border: `1px solid ${borderColor}`,
                                        boxShadow: `2px 2px 0 ${shadowColor}`,
                                        transition: 'all 0.25s ease',
                                        borderRadius: 0,
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </Space>
                </div>
            </div>


            {/* Content */}
            <div>
                {viewMode === 'all' && (
                    filteredNotes.length === 0 ? (
                        <Empty
                            description="No notes found. Create your first note!"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{ marginTop: 40 }}
                            styles={{
                                description: {
                                    fontFamily: '"Courier New", monospace'
                                }
                            }}
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleCreateNote()}
                                style={{
                                    fontFamily: '"Courier New", monospace',
                                    boxShadow: `3px 3px 0 ${shadowColor}`,
                                }}
                            >
                                Create New Note
                            </Button>
                        </Empty>
                    ) : (
                        <div
                            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            style={{ fontFamily: '"Courier New", monospace' }}
                        >
                            {filteredNotes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    // darkMode={darkMode}
                                    isSelected={selectedNote?.id === note.id}
                                    onSelect={() => handleOpenEditor(note)}
                                    isDeleteAvailable={true}
                                />
                            ))}
                        </div>
                    )
                )}

                {viewMode === "folder" && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ fontWeight: 625, fontSize: '18px', color: headerColor }}> <FolderOutlined /> Folders</h3>
                            <Button
                                type="default"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setFolderModalMode("create");
                                    setIsModalFolderVisible(true);
                                }}
                                style={{
                                    background: darkMode ? "linear-gradient(135deg, #1E293B, #334155)" : '#FDFBF8',
                                    border: `1px solid ${borderColor}`,
                                    boxShadow: `3px 3px 0 ${shadowColor}`,
                                    fontWeight: 500,
                                    borderRadius: 0,
                                    padding: "0 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
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
                                        : "#FDFBF8");
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Add Folder
                            </Button>
                        </div>
                        {(filteredFolders.length === 0 || filteredFolders.every(f => !f.notes || f.notes.length === 0)) ? (
                            <Empty
                                description="No notes in any folder"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ minHeight: 200, marginTop: 40 }}
                                styles={{
                                    description: {
                                        fontFamily: '"Courier New", monospace'
                                    }
                                }}
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleCreateNote()}
                                >
                                    Create New Note
                                </Button>
                            </Empty>
                        ) : (
                            <Collapse
                                ghost
                                expandIconPosition="end"
                                style={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                }}
                                items={folderItems}
                            />
                        )}
                    </>
                )}

                {viewMode === "tag" && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ fontWeight: 625, fontSize: '18px', color: headerColor }}><TagsOutlined /> Tags</h3>
                        </div>
                        {(filteredTags.length === 0 || filteredTags.every(t => !t.noteTags || t.noteTags.length === 0)) ? (
                            <Empty
                                description="No notes with any tag"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ minHeight: 200, marginTop: 40 }}
                                styles={{
                                    description: {
                                        fontFamily: '"Courier New", monospace'
                                    }
                                }}
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleCreateNote()}
                                >
                                    Create New Note
                                </Button>
                            </Empty>
                        ) : (
                            <Collapse
                                ghost
                                expandIconPosition="end"
                                style={{
                                    backgroundColor: darkMode ? "#0f0f0f" : "#FFFFFF",
                                    borderRadius: "8px",
                                }}
                                items={tagItems}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NoteSidebar;
