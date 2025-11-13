import React from "react";
import { Empty, Button, Pagination, theme, Grid, Card, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import NoteCard from "@/features/user/notes/Notes/components/NoteCard";
import { Folder, Note } from "@/types/note/notes";


interface Props {
    notes: Note[];
    selectedNote: Note | null;
    handleOpenEditor: (note: Note) => void;
    totalElements: number;
    page: number;
    pageSize: number;
    handleTableChange: (page: number, pageSize: number) => void;
    handleCreateNote: (folder?: Folder) => void;
    isLoading?: boolean;
}

const AllNotesView: React.FC<Props> = ({
    notes,
    selectedNote,
    handleOpenEditor,
    totalElements,
    page,
    pageSize,
    handleTableChange,
    handleCreateNote,
    isLoading = false
}) => {
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();
    const borderColor = `${token.colorPrimary}E0`;
    const shadowColor = `${token.colorPrimary}55`;

    // show skeleton placeholders while loading
    if (isLoading) {
        const placeholders = Array.from({ length: pageSize });
        return (
            <div
                className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ marginBottom: 100, fontFamily: '"Courier New", monospace' }}
            >
                {placeholders.map((_, index) => (
                    <Card
                        key={index}
                        style={{
                            border: `1.5px solid ${borderColor}`,
                            borderRadius: 0,
                            boxShadow: `4px 4px 0 ${shadowColor}`,
                            backgroundColor: token.colorBgContainer,
                        }}
                    >
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                ))}
            </div>
        );
    };

    if (notes.length === 0) {
        return (
            <Empty
                description="No notes found. Create your first note!"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ marginTop: 40 }}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleCreateNote()}
                >
                    Create New Note
                </Button>
            </Empty>
        );
    };

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ fontFamily: '"Courier New", monospace' }}>
                {notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        isSelected={selectedNote?.id === note.id}
                        onSelect={() => handleOpenEditor(note)}
                        isDeleteAvailable
                    />
                ))}
            </div>

            {totalElements > pageSize && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            padding: screens.md ? '8px 16px' : '4px 12px',
                            background: token.colorBgElevated,
                            boxShadow: `3px 3px 0 ${shadowColor}`,
                            border: `2px solid ${borderColor}`,
                            marginTop: '20px'
                        }}
                    >
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={totalElements}
                            onChange={handleTableChange}
                            showSizeChanger={false}
                            size={screens.md ? 'default' : 'small'}
                            showTotal={screens.md ?
                                ((total, range) => `${range[0]}-${range[1]} of ${total} notes`)
                                : undefined}
                            responsive
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AllNotesView;
