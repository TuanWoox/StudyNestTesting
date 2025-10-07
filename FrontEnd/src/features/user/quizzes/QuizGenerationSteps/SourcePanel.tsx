import React, { useEffect, useMemo } from "react";
import { Card, Form, Input, Empty, Row, Col, Space, Spin } from "antd";
import { SearchOutlined, FileOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import useGetAllNote from "@/hooks/noteHook/useGetAllNote";
import NoteCard from "@/features/user/notes/NoteSidebar/NoteCard";
import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector";

interface SourcePanelProps {
  selectedNoteId?: string;
  query: string;
  form: FormInstance;
  setQuery: (query: string) => void;
  setSelectedNoteId: (id: string) => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({
  selectedNoteId,
  query,
  form,
  setQuery,
  setSelectedNoteId,
}) => {
  // Fetch notes from API
  const { data: notesData, isLoading } = useGetAllNote();

  // Get dark mode setting from Redux
  const { mode } = useReduxSelector((state) => state.theme);
  const isDarkMode = mode === "dark";

  // Transform and filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!notesData?.data) return [];

    const q = query.trim().toLowerCase();
    if (!q) return notesData.data;

    return notesData.data.filter((note) => {
      const inTitle = note.title.toLowerCase().includes(q);
      const inTags = note.noteTags?.some((nt) =>
        nt.tag?.name.toLowerCase().includes(q)
      );
      return inTitle || inTags;
    });
  }, [notesData, query]);
  // Keep hidden form field in sync with external selectedNoteId
  useEffect(() => {
    if (selectedNoteId) {
      form.setFieldsValue({ noteId: selectedNoteId });
    } else {
      form.resetFields(["noteId"]);
    }
  }, [selectedNoteId, form]);

  // Auto-select first note when data loads and no selection exists
  useEffect(() => {
    if (notesData?.data?.length && !selectedNoteId) {
      const firstNoteId = notesData.data[0].id;
      setSelectedNoteId(firstNoteId);
      form.setFieldsValue({ noteId: firstNoteId });
    }
  }, [notesData, selectedNoteId, form, setSelectedNoteId]);

  return (
    <Card
      style={{ borderRadius: 16 }}
      bodyStyle={{ padding: 20 }}
      title={
        <Space>
          <FileOutlined />
          <span>Select Source Material</span>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Form form={form} layout="vertical">
          {/* Hidden field to validate a note is selected */}
          <Form.Item
            name="noteId"
            rules={[{ required: true, message: "Please select a note!" }]}
            style={{ display: "none" }}
            initialValue={selectedNoteId}
          >
            <Input />
          </Form.Item>
        </Form>

        <Input
          allowClear
          placeholder="Search by title or tag (e.g., React, DB)"
          prefix={<SearchOutlined />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginBottom: 8, width: "100%" }}
        />

        {/* Notes grid */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : !filteredNotes || filteredNotes.length === 0 ? (
          <Empty description="No notes found" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredNotes.map((note) => {
              const isSelected = note.id === selectedNoteId;

              return (
                <Col xs={24} md={12} key={note.id}>
                  <NoteCard
                    note={note}
                    darkMode={isDarkMode}
                    isSelected={isSelected}
                    onSelect={() => {
                      setSelectedNoteId(note.id);
                      form.setFieldsValue({ noteId: note.id });
                    }}
                  />
                </Col>
              );
            })}
          </Row>
        )}
      </Space>
    </Card>
  );
};
