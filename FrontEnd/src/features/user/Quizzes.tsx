import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ConfigProvider,
  Flex,
  Space,
  Table,
  Card,
  Typography,
  Skeleton,
  Empty,
  Popconfirm,
} from "antd";
import type { TableProps } from "antd";
import { QuizList } from "@/types/quiz/quiz";
import {
  DeleteOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import useGetAllQuiz from "@/hooks/quizHook/useGetAllQuiz";
import useDeleteQuiz from "@/hooks/quizHook/useDeleteQuiz";
import { formatDMY } from "@/utils/date";

const { Title, Text } = Typography;

const Quizzes: React.FC = () => {
  // Use the hook to fetch all quizzes
  const { data: quizzes, isPending, isError, error } = useGetAllQuiz();
  const { deleteQuiz, deleteQuizAsync, isLoading } = useDeleteQuiz();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const columns: TableProps<QuizList>["columns"] = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: QuizList, index: number) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record: QuizList) => (
        <Link to={`/user/quiz/${record.id}`}>
          <Text strong style={{ color: "#1677ff", cursor: "pointer" }}>
            {text}
          </Text>
        </Link>
      ),
    },
    {
      title: "Total Question",
      dataIndex: "totalQuestion", // Updated to match API response field
      key: "totalQuestion",
      align: "center",
    },
    {
      title: "Date Create",
      dataIndex: "dateCreated", // Updated to match API response field
      key: "dateCreated",
      align: "center",
      render: (date: string) => formatDMY(date),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: unknown, record: { id: string }) => (
        <Space size="middle">
          <Popconfirm
            title="Delete this quiz?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: deletingId === record.id && isLoading,
            }}
            onConfirm={async () => {
              setDeletingId(record.id);
              try {
                await deleteQuizAsync(record.id);
                // success toast + query invalidate handled inside the hook
              } finally {
                setDeletingId(null);
              }
            }}
          >
            <Button
              type="link"
              danger
              style={{ fontWeight: 500 }}
              icon={<DeleteOutlined />}
              loading={deletingId === record.id && isLoading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Render skeleton while loading
  if (isPending) {
    return (
      <Card
        style={{
          width: "100%",
          height: "85%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 32 }}
        >
          <Skeleton.Input active style={{ width: 300 }} />
          <Skeleton.Button active />
        </Flex>
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  // Render error state
  if (isError || !quizzes) {
    return (
      <Card
        style={{
          width: "100%",
          height: "85%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 32,
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
              {error?.message || "Failed to load quizzes"}
            </Text>
          }
        >
          <Button type="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Empty>
      </Card>
    );
  }

  // Check if there are no quizzes
  const hasQuizzes = quizzes && quizzes.length > 0;

  return (
    <>
      <Card
        style={{
          width: "100%",
          height: "85%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 32 }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>
              AI Quiz Generator
            </Title>
            <Text type="secondary">
              Take and manage your quizzes with ease.
            </Text>
          </div>
          <Link to="/user/quiz/generate">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{ borderRadius: 6 }}
            >
              Generate
            </Button>
          </Link>
        </Flex>

        {hasQuizzes ? (
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  borderColor: "#e4e4e4",
                  headerBg: "#fafafa",
                  headerColor: "#222",
                  rowHoverBg: "#f0f5ff",
                },
              },
            }}
          >
            <Table<QuizList>
              columns={columns}
              dataSource={quizzes}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              style={{ borderRadius: 8, overflow: "hidden" }}
            />
          </ConfigProvider>
        ) : (
          <Empty
            description="No quizzes found. Generate your first quiz!"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Link to="/user/quiz/generate">
              <Button type="primary" icon={<PlusOutlined />}>
                Generate Quiz
              </Button>
            </Link>
          </Empty>
        )}
      </Card>
    </>
  );
};

export default Quizzes;
