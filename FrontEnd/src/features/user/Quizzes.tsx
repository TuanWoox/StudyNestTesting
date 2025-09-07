import React, { useEffect, useState } from "react";
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
  Tooltip,
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const columns: TableProps<QuizList>["columns"] = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_: unknown, __: QuizList, idx: number) =>
        (page - 1) * pageSize + idx + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 300, // Fixed width for title column
      ellipsis: {
        showTitle: false, // Prevent default tooltip
      },
      render: (text, record: QuizList) => (
        <Tooltip placement="topLeft" title={text}>
          <Link to={`/user/quiz/${record.id}`}>
            <Text
              strong
              style={{
                color: "#1677ff",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {text}
            </Text>
          </Link>
        </Tooltip>
      ),
    },
    {
      title: "Total Question",
      dataIndex: "totalQuestion",
      key: "totalQuestion",
      align: "center",
      width: 100,
    },
    {
      title: "Date Create",
      dataIndex: "dateCreated",
      key: "dateCreated",
      align: "center",
      width: 100,
      render: (date: string) => formatDMY(date),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 140,
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
          height: "100%", // Fill available space
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 32,
          height: "100%", // Fill card height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 32 }}
        >
          <Skeleton.Input active style={{ width: 300 }} />
          <Skeleton.Button active />
        </Flex>
        <Skeleton active paragraph={{ rows: 5 }} style={{ flex: 1 }} />
      </Card>
    );
  }

  // Render error state
  if (isError || !quizzes) {
    return (
      <Card
        style={{
          width: "100%",
          height: "100%", // Fill available space
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 32,
          height: "100%", // Fill card height
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
    <main
      style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}
    >
      <Card
        style={{
          width: "100%",
          height: "100%", // Fill available space
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: 32,
          height: "100%", // Fill card height
          display: "flex",
          flexDirection: "column",
        }}
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

        {/* This div creates a flex container that will expand to fill remaining space */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {hasQuizzes ? (
            <div className="table-fill">
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
                  rowKey="id"
                  columns={columns}
                  dataSource={quizzes}
                  pagination={{
                    current: page,
                    pageSize,
                    onChange: (p, ps) => {
                      setPage(p);
                      setPageSize(ps);
                    },
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                    position: ["bottomRight"],
                  }}
                  tableLayout="fixed" // fixed column widths
                  sticky
                  size="middle"
                  style={{
                    height: "93%",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                />
              </ConfigProvider>
            </div>
          ) : (
            <Empty
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
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
        </div>
      </Card>
    </main>
  );
};

export default Quizzes;
