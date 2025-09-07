import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Flex,
  Button,
  Space,
  Tag,
  List,
  Skeleton,
  Collapse,
  Badge,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  FormOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import useGetQuizDetail from "@/hooks/quizHook/useGetQuizDetail";
import { useQueryClient } from "@tanstack/react-query";
import { formatDMY } from "@/utils/date";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const QuizDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const {
    data: quiz,
    isLoading,
    isError,
    error,
  } = useGetQuizDetail(id, { enabled: !!id });
  const questions = quiz?.questions ?? []; // default to []
  const { mcq, tf } = questions.reduce(
    (acc, q) => {
      if (q.type === "MCQ") acc.mcq++;
      if (q.type === "TF") acc.tf++;
      return acc;
    },
    { mcq: 0, tf: 0 }
  );

  const handleReturnQuiz = () => {
    queryClient.invalidateQueries({
      queryKey: ["quizzes"],
      refetchType: "inactive",
    });
    navigate(`/user/quiz`);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card
        style={{
          width: "100%",
          overflow: "auto",
          margin: "0 auto",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 32,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  // Handle error state
  if (isError || !quiz) {
    return (
      <Card
        style={{
          width: "100%",
          overflow: "auto",
          margin: "0 auto",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 32,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty
          image={<WarningOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />}
          description={
            <Text type="danger">
              {error?.message || "Failed to load quiz details"}
            </Text>
          }
        >
          <Button onClick={handleReturnQuiz} type="primary">
            Back to Quizzes
          </Button>
        </Empty>
      </Card>
    );
  }

  // Quiz data successfully loaded
  return (
    <Card
      style={{
        width: "100%",
        overflow: "auto",
        margin: "0 auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{
        padding: 32,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Space size={16}>
          <Title level={3} style={{ margin: 0 }}>
            {quiz.title}
          </Title>
          <Tag color="blue">{mcq} MCQ</Tag>
          <Tag color="green">{tf} True/False</Tag>
        </Space>
        <Space>
          <Button type="primary" icon={<FormOutlined />}>
            Take Quiz
          </Button>
          <Link to="/user/quiz">
            <Button icon={<ArrowLeftOutlined />}>Back to Quizzes</Button>
          </Link>
        </Space>
      </Flex>

      <Card style={{ marginBottom: 24 }}>
        <Flex align="center" justify="space-between">
          <div>
            <Text strong>
              Total Questions: {(quiz?.questions ?? []).length}
            </Text>{" "}
          </div>
          <div>
            <Text strong>Created:</Text>{" "}
            <Text>{quiz.dateCreated && formatDMY(quiz.dateCreated)}</Text>
          </div>
        </Flex>
      </Card>

      <Title level={4} style={{ marginBottom: 16 }}>
        Questions
      </Title>

      <Flex vertical gap={16} style={{ flex: 1, overflow: "auto" }}>
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <RightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: "#fff" }}
        >
          {questions.map((question, index) => (
            <Panel
              key={question.id ?? String(index)}
              header={
                <Flex justify="space-between" align="center">
                  <Space>
                    <Badge
                      count={index + 1}
                      style={{
                        backgroundColor:
                          question.type === "MCQ" ? "#1890ff" : "#52c41a",
                        marginRight: 8,
                      }}
                    />
                    <Text strong>{question.name}</Text>
                  </Space>
                  <Tag color={question.type === "MCQ" ? "blue" : "green"}>
                    {question.type === "MCQ" ? "Multiple Choice" : "True/False"}
                  </Tag>
                </Flex>
              }
            >
              {question.type === "MCQ" ? (
                <List
                  size="small"
                  bordered
                  dataSource={question.choices ?? []} // 👈 safe default
                  renderItem={(choice, choiceIndex) => (
                    <List.Item
                      style={{
                        backgroundColor:
                          choiceIndex === question.correctIndex
                            ? "#f6ffed"
                            : undefined,
                        borderLeft:
                          choiceIndex === question.correctIndex
                            ? "3px solid #52c41a"
                            : undefined,
                      }}
                    >
                      <Space>
                        {choiceIndex === question.correctIndex && (
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        )}
                        <Text>{choice.text}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              ) : (
                <Card
                  size="small"
                  style={{
                    backgroundColor: "#f6ffed",
                    borderLeft: "3px solid #52c41a",
                  }}
                >
                  <Text>
                    Correct Answer:{" "}
                    <Text strong>
                      {question.correctTrueFalse ? "True" : "False"}
                    </Text>
                  </Text>
                </Card>
              )}

              {question.explanation && (
                <Card
                  size="small"
                  style={{
                    marginTop: 16,
                    backgroundColor: "#f0f5ff",
                    borderLeft: "3px solid #1890ff",
                  }}
                  title={
                    <Space>
                      <QuestionCircleOutlined />
                      <Text>Explanation</Text>
                    </Space>
                  }
                  bordered={false}
                >
                  <Paragraph style={{ margin: 0 }}>
                    {question.explanation}
                  </Paragraph>
                </Card>
              )}
            </Panel>
          ))}
        </Collapse>
      </Flex>
    </Card>
  );
};

export default QuizDetailPage;
