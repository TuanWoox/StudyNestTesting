import React from "react";
import { Card, Typography, Tag, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { NoteCard } from "../NoteDummyData";
import type { CreateQuizDTO } from "@/types/quiz/createQuizDTO";

const { Title, Text, Paragraph } = Typography;

interface ReviewPanelProps {
  selectedNote?: NoteCard;
  quizOptions?: CreateQuizDTO;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  selectedNote,
  quizOptions,
}) => {
  const fmt = (d: Date | string) => new Date(d).toLocaleDateString();
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
  const total = (quizOptions?.count_Mcq ?? 0) + (quizOptions?.count_Tf ?? 0);
  return (
    <Card
      style={{ borderRadius: 16 }}
      bodyStyle={{ padding: 20 }}
      title={
        <Space>
          <EyeOutlined />
          <span>Review &amp; Generate</span>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Selected Note
          </Title>
          {selectedNote ? (
            <Card style={{ borderRadius: 8 }}>
              <Title level={5} style={{ marginBottom: 4 }}>
                {selectedNote.title}
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                {selectedNote.excerpt}
              </Paragraph>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {selectedNote.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">{selectedNote.status}</Text>
                <Text type="secondary">
                  Updated: {fmt(selectedNote.updatedAt)}
                </Text>
              </div>
            </Card>
          ) : (
            <Text type="secondary">No note selected.</Text>
          )}
        </div>

        {quizOptions && (
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>
              Quiz Configuration
            </Title>
            <Card bordered style={{ borderRadius: 8 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Difficulty:</Text>{" "}
                  <Text>{cap(quizOptions.difficulty)}</Text>
                </div>
                <div>
                  <Text strong>Total Questions:</Text> <Text>{total}</Text>
                </div>
                <div>
                  <Text strong>Question Types:</Text>
                  <div style={{ marginLeft: 16, marginTop: 4 }}>
                    <div>
                      <Text>Multiple Choice:</Text>{" "}
                      <Text>{quizOptions.count_Mcq}</Text>
                    </div>
                    <div>
                      <Text>True/False:</Text>{" "}
                      <Text>{quizOptions.count_Tf}</Text>
                    </div>
                  </div>
                </div>
              </Space>
            </Card>
          </div>
        )}
      </Space>
    </Card>
  );
};
