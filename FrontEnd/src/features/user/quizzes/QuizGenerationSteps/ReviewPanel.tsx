import React from "react";
import { Card, Typography, Tag, Space, Row, Col, Divider } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Note } from "@/types/note/notes";
import type { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import { formatDMY } from "@/utils/date";

const { Title, Text, Paragraph } = Typography;

interface ReviewPanelProps {
  selectedNote?: Note;
  quizOptions?: CreateQuizDTO;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  selectedNote,
  quizOptions,
}) => {
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
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
            <Card
              style={{ borderRadius: 8 }}
              bordered
              className="note-preview-card"
              headStyle={{ padding: "12px 16px" }}
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    {selectedNote.title}
                  </Title>
                  <Tag
                    color={
                      selectedNote.status === "Published"
                        ? "success"
                        : "processing"
                    }
                  >
                    {selectedNote.status}
                  </Tag>
                </div>
              }
            >
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                {selectedNote.content
                  ? selectedNote.content.substring(0, 150) +
                    (selectedNote.content.length > 150 ? "..." : "")
                  : "No content available"}
              </Paragraph>

              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {selectedNote.noteTags &&
                    selectedNote.noteTags.length > 0 ? (
                      selectedNote.noteTags.map((nt) => (
                        <Tag key={nt.tag.id} color="blue">
                          {nt.tag.name}
                        </Tag>
                      ))
                    ) : (
                      <Text type="secondary">No tags</Text>
                    )}
                  </div>
                </Col>

                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: 12,
                    }}
                  >
                    <Space>
                      <Text type="secondary">
                        Folder: {selectedNote.folder?.folderName || "No folder"}
                      </Text>
                    </Space>
                    <Text type="secondary">
                      Updated:{" "}
                      {formatDMY(
                        selectedNote.dateModified ||
                          selectedNote.dateCreated ||
                          ""
                      )}
                    </Text>
                  </div>
                </Col>
              </Row>
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
                <Row gutter={[16, 16]} align="middle">
                  <Col span={12}>
                    <Card
                      size="small"
                      style={{ background: "#f9f9f9", borderRadius: 8 }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: "bold" }}>
                          {cap(quizOptions.difficulty)}
                        </div>
                        <Text type="secondary">Difficulty</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      size="small"
                      style={{ background: "#f9f9f9", borderRadius: 8 }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: "bold" }}>
                          {quizOptions.language}
                        </div>
                        <Text type="secondary">Language</Text>
                      </div>
                    </Card>
                  </Col>
                </Row>

                <div style={{ marginTop: 8 }}>
                  <Text strong>Total Questions: </Text>
                  <Text>
                    {quizOptions.count_Mcq +
                      quizOptions.count_Msq +
                      quizOptions.count_Tf}
                  </Text>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div>
                  <Text strong>Question Distribution:</Text>
                </div>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card
                      size="small"
                      style={{
                        textAlign: "center",
                        background: "#e6f7ff",
                        borderRadius: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#1890ff",
                          }}
                        >
                          {quizOptions.count_Mcq}
                        </div>
                        <Text>Multiple Choice</Text>
                      </div>
                    </Card>
                  </Col>

                  <Col span={8}>
                    <Card
                      size="small"
                      style={{
                        textAlign: "center",
                        background: "#f9f0ff",
                        borderRadius: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#722ed1",
                          }}
                        >
                          {quizOptions.count_Msq}
                        </div>
                        <Text>Multi-Select</Text>
                      </div>
                    </Card>
                  </Col>

                  <Col span={8}>
                    <Card
                      size="small"
                      style={{
                        textAlign: "center",
                        background: "#f6ffed",
                        borderRadius: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#52c41a",
                          }}
                        >
                          {quizOptions.count_Tf}
                        </div>
                        <Text>True/False</Text>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Card>
          </div>
        )}
      </Space>
    </Card>
  );
};
