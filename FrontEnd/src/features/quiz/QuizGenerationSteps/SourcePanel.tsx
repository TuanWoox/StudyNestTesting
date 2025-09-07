import React, { useEffect } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Empty,
  Row,
  Col,
  Tag,
  Space,
} from "antd";
import {
  SearchOutlined,
  CheckCircleTwoTone,
  FileOutlined,
} from "@ant-design/icons";
import type { NoteCard } from "../NoteDummyData";
import type { FormInstance } from "antd";

const { Title, Text, Paragraph } = Typography;

interface SourcePanelProps {
  notes: NoteCard[];
  selectedNoteId?: string;
  query: string;
  form: FormInstance;
  setQuery: (query: string) => void;
  setSelectedNoteId: (id: string) => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({
  notes,
  selectedNoteId,
  query,
  form,
  setQuery,
  setSelectedNoteId,
}) => {
  const fmt = (d: Date | string) => new Date(d).toLocaleDateString();

  // Keep hidden form field in sync with external selectedNoteId
  useEffect(() => {
    if (selectedNoteId) {
      form.setFieldsValue({ noteId: selectedNoteId });
    } else {
      form.resetFields(["noteId"]);
    }
  }, [selectedNoteId, form]);

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
        {!notes || notes.length === 0 ? (
          <Empty description="No notes found" />
        ) : (
          <Row gutter={[16, 16]}>
            {notes.map((note) => {
              const isSelected = note.id === selectedNoteId;
              return (
                <Col xs={24} md={12} key={note.id}>
                  <Card
                    hoverable
                    style={{
                      cursor: "pointer",
                      borderColor: isSelected ? "#1677ff" : undefined,
                      background: isSelected ? "#e6f4ff" : undefined,
                    }}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      form.setFieldsValue({ noteId: note.id });
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      {isSelected && (
                        <CheckCircleTwoTone
                          twoToneColor="#52c41a"
                          style={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            fontSize: 18,
                          }}
                        />
                      )}
                      <Title level={5} style={{ marginBottom: 4 }}>
                        {note.title}
                      </Title>
                      <Paragraph
                        type="secondary"
                        style={{ marginBottom: 8 }}
                        ellipsis={{ rows: 2 }}
                      >
                        {note.excerpt}
                      </Paragraph>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          marginBottom: 8,
                        }}
                      >
                        {(note.tags ?? []).map((tag) => (
                          <Tag key={`${note.id}-${tag}`}>{tag}</Tag>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                        }}
                      >
                        <Text type="secondary">{note.status}</Text>
                        <Text type="secondary">
                          Updated: {fmt(note.updatedAt)}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Space>
    </Card>
  );
};
