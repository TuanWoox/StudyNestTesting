import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Flex,
  Card,
  Typography,
  Skeleton,
  Empty,
  Row,
  Col,
  Pagination,
  Input,
  theme,
  Statistic,
  Space,
  Modal,
  Grid,
} from "antd";
import {
  PlusOutlined,
  WarningOutlined,
  SearchOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import useGetAllQuiz from "@/hooks/quizHook/useGetAllQuiz";
import useDeleteQuiz from "@/hooks/quizHook/useDeleteQuiz";
import useDebounce from "@/hooks/common/useDebounce";
import QuizCard from "./components/QuizCard";

const { Title, Text } = Typography;
const { useToken } = theme;
const { confirm } = Modal;
const { useBreakpoint } = Grid;

const Quizzes: React.FC = () => {
  const { token } = useToken();
  const screens = useBreakpoint();

  // Theme constants
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch quizzes
  const {
    data: quizData,
    isPending,
    isError,
    error,
    refetch,
  } = useGetAllQuiz({
    pageNumber: page - 1,
    pageSize,
    sortByNewest: true,
    searchTerm: debouncedSearchTerm,
  });

  const { deleteQuizAsync, isLoading: isDeleting } = useDeleteQuiz();

  const quizzes = quizData?.data || [];
  const totalElements = quizData?.page.totalElements || 0;
  const hasQuizzes = quizzes && quizzes.length > 0;

  // Calculate stats - only show available data
  const totalQuizzes = totalElements;

  // Handle pagination
  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Handle quiz deletion
  const handleDelete = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;

    try {
      setDeletingQuizId(quizToDelete.id);
      setShowDeleteModal(false);
      await deleteQuizAsync(quizToDelete.id);
      const currentPageItemCount = quizzes.length;
      const isLastItemOnPage = currentPageItemCount === 1;
      const isNotFirstPage = page > 1;

      if (isLastItemOnPage && isNotFirstPage) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    } finally {
      setDeletingQuizId(null);
      setQuizToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
  };

  // Render error state
  if (isError || (!isPending && !quizData)) {
    return (
      <div style={{ padding: "24px", width: "100%" }}>
        <Card
          style={{
            margin: "0 auto",
            textAlign: "center",
            padding: "48px 24px",
          }}
        >
          <Empty
            image={
              <WarningOutlined
                style={{ fontSize: 48, color: token.colorError }}
              />
            }
            description={
              <Text type="danger">
                {error?.message || "Unable to load quiz list"}
              </Text>
            }
          >
            <Button type="primary" onClick={() => refetch()}>
              Try Again
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: screens.md ? "16px 24px" : "12px 16px",
        paddingBottom: "80px",
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        backgroundColor: token.colorBgLayout,
        scrollbarWidth: "none",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* Header */}
        <Flex
          justify="space-between"
          align="flex-start"
          wrap="wrap"
          gap={16}
          style={{ marginBottom: 32 }}
        >
          <div style={{ flex: "1 1 auto", minWidth: 250 }}>
            <Title
              level={2}
              style={{
                margin: 0,
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              My Quizzes
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: 15,
                marginTop: 4,
                display: "block",
                fontFamily: "monospace",
              }}
            >
              Manage and retake your created quizzes
            </Text>
          </div>
          <Space wrap size={[8, 8]} style={{ flex: "0 0 auto" }}>
            <Input
              placeholder="Search quizzes..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              size="large"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: 240,
                minWidth: 200,
                borderRadius: 0,
                fontFamily: "monospace",
                border: borderColor,
              }}
              allowClear
            />
            <Link to="/user/quiz/generate">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  borderRadius: 0,
                  fontFamily: "monospace",
                  border: borderColor,
                  fontWeight: 600,
                }}
              >
                Create New Quiz
              </Button>
            </Link>
          </Space>
        </Flex>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={24} md={24}>
            <Card
              style={{
                border: borderColor,
                borderRadius: 0,
                boxShadow: shadowColor,
                backgroundColor: token.colorBgContainer,
              }}
            >
              <Statistic
                title="Total Quizzes Created"
                value={totalQuizzes}
                prefix={<FileTextOutlined />}
                valueStyle={{
                  color: token.colorPrimary,
                  fontWeight: 600,
                  fontFamily: "monospace",
                  fontSize: "28px",
                }}
                formatter={(value) => (
                  <span style={{ fontFamily: "monospace" }}>{value}</span>
                )}
              />
            </Card>
          </Col>
        </Row>
        {/* Quiz Grid */}
        {isPending ? (
          <Row gutter={[16, 16]} style={{ marginBottom: 100 }}>
            {[...Array(pageSize)].map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card
                  style={{
                    border: borderColor,
                    borderRadius: 0,
                    boxShadow: shadowColor,
                    backgroundColor: token.colorBgContainer,
                  }}
                >
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : hasQuizzes ? (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 100 }}>
              {quizzes.map((quiz, index) => (
                <Col key={quiz.id} xs={24} sm={12} md={8}>
                  <QuizCard
                    quiz={quiz}
                    index={index}
                    page={page}
                    pageSize={pageSize}
                    onDelete={handleDelete}
                    deletingId={deletingQuizId}
                    isDeleting={isDeleting}
                  />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Card
            style={{
              textAlign: "center",
              padding: "48px 24px",
              marginBottom: 100,
              border: borderColor,
              borderRadius: 0,
              boxShadow: shadowColor,
              backgroundColor: token.colorBgContainer,
            }}
          >
            <Empty
              description="You haven't created any quizzes yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/user/quiz/generate">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{
                    borderRadius: 0,
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  Create Your First Quiz
                </Button>
              </Link>
            </Empty>
          </Card>
        )}

        {/* Pagination - Positioned within content area */}
        {totalElements > pageSize && (
          <div
            style={{
              position: "sticky",
              bottom: 55,
              zIndex: 10,
              width: "100%",
            }}
          >
            <Flex justify="center">
              <div
                style={{
                  padding: screens.md ? "8px 16px" : "4px 12px",
                  background: token.colorBgElevated,
                  border: borderColor,
                  boxShadow: shadowColor,
                }}
              >
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={totalElements}
                  onChange={handleTableChange}
                  showSizeChanger={false}
                  size={screens.md ? "default" : "small"}
                  simple={screens.xs}
                  showTotal={
                    screens.md
                      ? (total, range) =>
                          `${range[0]}-${range[1]} of ${total} quizzes`
                      : undefined
                  }
                  responsive
                />
              </div>
            </Flex>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Quiz"
        open={showDeleteModal}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        confirmLoading={deletingQuizId === quizToDelete?.id && isDeleting}
        centered
        styles={{
          content: {
            background: token.colorBgElevated,
            border: borderColor,
            boxShadow: shadowColor,
            fontFamily: "monospace",
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ExclamationCircleOutlined
            style={{ fontSize: 24, color: token.colorError }}
          />
          <div>
            <p style={{ margin: 0, fontFamily: "monospace" }}>
              Are you sure you want to delete quiz "{quizToDelete?.title}"?
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                color: token.colorTextSecondary,
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            >
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quizzes;
