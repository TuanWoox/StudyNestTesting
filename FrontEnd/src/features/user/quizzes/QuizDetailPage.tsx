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
    isPending,
    isError,
    error,
  } = useGetQuizDetail(id, { enabled: !!id });

  const questions = quiz?.questions ?? [];
  const { mcq, tf, msq } = questions.reduce(
    (acc, q) => {
      if (q.type === "MCQ") acc.mcq++;
      else if (q.type === "TF") acc.tf++;
      else if (q.type === "MSQ") acc.msq++;
      return acc;
    },
    { mcq: 0, tf: 0, msq: 0 }
  );

  const handleReturnQuiz = () => {
    queryClient.invalidateQueries({
      queryKey: ["quizzes"],
      refetchType: "inactive",
    });
    navigate(`/user/quiz`);
  };

  // Handle loading state
  if (isPending) {
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
      <Flex vertical gap={16} style={{ marginBottom: 24 }}>
        <Flex justify="space-between" align="center">
          <Space size={16}>
            <Title level={3} style={{ margin: 0 }}>
              {quiz.title}
            </Title>
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

        <Flex gap={8}>
          <Tag color="blue" style={{ padding: "4px 8px" }}>
            <Space>
              <span style={{ fontWeight: "bold" }}>{mcq}</span> Multiple Choice
            </Space>
          </Tag>
          <Tag color="purple" style={{ padding: "4px 8px" }}>
            <Space>
              <span style={{ fontWeight: "bold" }}>{msq}</span> Multi-Select
            </Space>
          </Tag>
          <Tag color="green" style={{ padding: "4px 8px" }}>
            <Space>
              <span style={{ fontWeight: "bold" }}>{tf}</span> True/False
            </Space>
          </Tag>
        </Flex>
      </Flex>

      <Card style={{ marginBottom: 24 }}>
        <Flex align="center" justify="space-between">
          <Space>
            <Tag color="cyan" style={{ fontSize: "14px", padding: "5px 10px" }}>
              {(quiz?.questions ?? []).length} Questions
            </Tag>
          </Space>
          <Space>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Created on {quiz.dateCreated && formatDMY(quiz.dateCreated)}
            </Text>
          </Space>
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
          {questions.map((question, index) => {
            // Use choices as they come from the API
            const sortedChoices = question.choices ? [...question.choices] : [];

            // isCorrect should already be set from the API for all question types

            return (
              <Panel
                key={question.id ?? String(index)}
                header={
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ width: "100%" }}
                  >
                    <Space size={12}>
                      <Badge
                        count={index + 1}
                        style={{
                          backgroundColor:
                            question.type === "MCQ"
                              ? "#1890ff"
                              : question.type === "MSQ"
                              ? "#722ed1"
                              : "#52c41a",
                          marginRight: 8,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Text strong style={{ fontSize: "16px" }}>
                        {question.name}
                      </Text>
                    </Space>
                    <Tag
                      color={
                        question.type === "MCQ"
                          ? "blue"
                          : question.type === "MSQ"
                          ? "purple"
                          : "green"
                      }
                      style={{ padding: "4px 8px", fontWeight: 500 }}
                    >
                      {question.type === "MCQ"
                        ? "Multiple Choice"
                        : question.type === "MSQ"
                        ? "Multi-Select"
                        : "True/False"}
                    </Tag>
                  </Flex>
                }
              >
                {question.type === "MCQ" ? (
                  <List
                    size="small"
                    bordered
                    dataSource={sortedChoices}
                    style={{
                      borderRadius: "6px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    renderItem={(choice) => {
                      const isCorrect = choice.isCorrect;
                      return (
                        <List.Item
                          style={{
                            backgroundColor: isCorrect ? "#f6ffed" : undefined,
                            borderLeft: isCorrect
                              ? "3px solid #52c41a"
                              : undefined,
                            padding: "10px 16px",
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <Space>
                            {isCorrect && (
                              <CheckCircleOutlined
                                style={{ color: "#52c41a", fontSize: "16px" }}
                              />
                            )}
                            <Text style={{ fontSize: "14px" }}>
                              {choice.text}
                            </Text>
                          </Space>
                        </List.Item>
                      );
                    }}
                  />
                ) : question.type === "MSQ" ? (
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>
                      Select all that apply:
                    </Text>
                    <List
                      size="small"
                      bordered
                      dataSource={sortedChoices}
                      renderItem={(choice) => {
                        const isCorrect = choice.isCorrect;
                        return (
                          <List.Item
                            style={{
                              backgroundColor: isCorrect
                                ? "#f0f5ff"
                                : undefined,
                              borderLeft: isCorrect
                                ? "3px solid #722ed1"
                                : undefined,
                            }}
                          >
                            <Space>
                              {isCorrect && (
                                <CheckCircleOutlined
                                  style={{ color: "#722ed1" }}
                                />
                              )}
                              <Text>{choice.text}</Text>
                            </Space>
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                ) : (
                  <List
                    size="small"
                    bordered
                    dataSource={sortedChoices}
                    style={{
                      borderRadius: "6px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    renderItem={(choice) => {
                      const isCorrect = choice.isCorrect;
                      return (
                        <List.Item
                          style={{
                            backgroundColor: isCorrect ? "#f6ffed" : undefined,
                            borderLeft: isCorrect
                              ? "3px solid #52c41a"
                              : undefined,
                            padding: "10px 16px",
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <Space>
                            {isCorrect && (
                              <CheckCircleOutlined
                                style={{ color: "#52c41a", fontSize: "16px" }}
                              />
                            )}
                            <Text
                              style={{
                                fontSize: "14px",
                                fontWeight: isCorrect ? 500 : 400,
                              }}
                            >
                              {choice.text}
                            </Text>
                          </Space>
                        </List.Item>
                      );
                    }}
                  />
                )}

                {question.explanation && (
                  <Card
                    size="small"
                    style={{
                      marginTop: 16,
                      backgroundColor: "#f0f5ff",
                      borderLeft: "3px solid #1890ff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      borderRadius: "6px",
                    }}
                    title={
                      <Space>
                        <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                        <Text strong style={{ color: "#1890ff" }}>
                          Explanation
                        </Text>
                      </Space>
                    }
                    bordered={false}
                  >
                    <Paragraph
                      style={{
                        margin: 0,
                        lineHeight: "1.6",
                        fontSize: "14px",
                      }}
                    >
                      {question.explanation}
                    </Paragraph>
                  </Card>
                )}
              </Panel>
            );
          })}
        </Collapse>
      </Flex>
    </Card>
  );
};

export default QuizDetailPage;
