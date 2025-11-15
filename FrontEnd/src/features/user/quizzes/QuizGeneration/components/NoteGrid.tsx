import React from "react";
import { Row, Col, Empty, Spin } from "antd";
import { Note } from "@/types/note/notes";
import NoteCard from "@/features/user/notes/NoteSidebar/NoteCard";
import type { FormInstance } from "antd";

interface NoteGridProps {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId?: string;
  form: FormInstance;
  onSelectNote: (noteId: string) => void;
}

export const NoteGrid: React.FC<NoteGridProps> = ({
  notes,
  isLoading,
  selectedNoteId,
  form,
  onSelectNote,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return <Empty description="No notes found" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;

        return (
          <Col xs={24} md={12} key={note.id}>
            <NoteCard
              note={note}
              isSelected={isSelected}
              onSelect={() => {
                onSelectNote(note.id);
                form.setFieldsValue({ noteId: note.id });
              }}
              isDeleteAvailable={false}
            />
          </Col>
        );
      })}
    </Row>
  );
};
