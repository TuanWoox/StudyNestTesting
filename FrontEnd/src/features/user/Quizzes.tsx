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
} from "antd";
import { QuizList } from "@/types/quiz/quiz";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import useGetAllQuiz from "@/hooks/quizHook/useGetAllQuiz";
import useDeleteQuiz from "@/hooks/quizHook/useDeleteQuiz";
import { QuizCard } from "./quizzes/components";

const { Title, Text } = Typography;

const Quizzes: React.FC = () => {
  // Pagination state
  const [page, setPage] = useState(1); // UI uses 1-based indexing
  const [pageSize, setPageSize] = useState(4);

  // Add custom styles
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (min-width: 768px) {
        .quiz-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
        }
        
        .quiz-view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3) !important;
        }
        
        .quiz-start-btn:hover {
          border-color: #1890ff !important;
          color: #1890ff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
        }
      }
      
      .quiz-card .quiz-title:hover {
        color: #1890ff;
      }
      
      .quiz-card .quiz-more-btn:hover {
        color: #1890ff !important;
        background-color: rgba(24, 144, 255, 0.1) !important;
      }
      
      @media (max-width: 767px) {
        .quiz-card {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Pass pagination parameters to the hook
  const {
    data: quizData,
    isPending,
    isError,
    error,
    refetch,
  } = useGetAllQuiz({
    pageNumber: page - 1, // Convert to 0-based for API
    pageSize,
    sortByNewest: true,
  });

  const { deleteQuizAsync, isLoading } = useDeleteQuiz();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract quizzes from the paged data structure
  const quizzes = quizData?.data || [];
  const totalElements = quizData?.page.totalElements || 0;

  // Handle pagination change
  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Handle quiz deletion
  const handleDelete = async (quizId: string) => {
    setDeletingId(quizId);
    try {
      await deleteQuizAsync(quizId);
      // Check if we're deleting the last item on the current page
      const currentPageItemCount = quizzes.length;
      const isLastItemOnPage = currentPageItemCount === 1;
      const isNotFirstPage = page > 1;

      if (isLastItemOnPage && isNotFirstPage) {
        setPage(page - 1);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Render skeleton while loading
  if (isPending) {
    return (
      <Card
        style={{
          width: "100%",
          height: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        bodyStyle={{
          padding: window.innerWidth < 768 ? 16 : 32,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={16}
          style={{ marginBottom: window.innerWidth < 768 ? 20 : 32 }}
        >
          <div
            style={{ flex: window.innerWidth < 576 ? "1 1 100%" : "0 1 auto" }}
          >
            <Skeleton.Input
              active
              style={{
                width: window.innerWidth < 576 ? "100%" : 250,
                height: window.innerWidth < 576 ? 28 : 32,
                marginBottom: 8,
              }}
            />
            <Skeleton.Input
              active
              style={{
                width: window.innerWidth < 576 ? "100%" : 350,
                height: 20,
              }}
            />
          </div>
          <Skeleton.Button
            active
            size={window.innerWidth < 576 ? "default" : "large"}
            style={{ width: window.innerWidth < 576 ? "100%" : 120 }}
          />
        </Flex>
        <Row
          gutter={[
            window.innerWidth < 576 ? 12 : 16,
            window.innerWidth < 576 ? 12 : 16,
          ]}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={8} xl={6}>
              <Card style={{ borderRadius: 12 }}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    );
  }

  // Render error state
  if (isError || !quizData) {
    return (
      <Card
        style={{
          width: "100%",
          height: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        bodyStyle={{
          padding: window.innerWidth < 768 ? 16 : 32,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Empty
          image={
            <WarningOutlined
              style={{
                fontSize: window.innerWidth < 576 ? 36 : 48,
                color: "#ff4d4f",
              }}
            />
          }
          description={
            <Text
              type="danger"
              style={{ fontSize: window.innerWidth < 576 ? 13 : 14 }}
            >
              {error?.message || "Failed to load quizzes"}
            </Text>
          }
        >
          <Button
            type="primary"
            onClick={() => refetch()}
            size={window.innerWidth < 576 ? "middle" : "large"}
          >
            Try Again
          </Button>
        </Empty>
      </Card>
    );
  }

  // Check if there are no quizzes
  const hasQuizzes = quizzes && quizzes.length > 0;

  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: window.innerWidth < 768 ? 16 : 32,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={16}
        style={{ marginBottom: window.innerWidth < 768 ? 20 : 32 }}
      >
        <div
          style={{ flex: window.innerWidth < 576 ? "1 1 100%" : "0 1 auto" }}
        >
          <Title level={window.innerWidth < 576 ? 3 : 2} style={{ margin: 0 }}>
            AI Quiz Generator
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: window.innerWidth < 576 ? 13 : 14 }}
          >
            Take and manage your quizzes with ease.
          </Text>
        </div>
        <Link to="/user/quiz/generate">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size={window.innerWidth < 576 ? "middle" : "large"}
            style={{ borderRadius: 6 }}
            block={window.innerWidth < 576}
          >
            Generate
          </Button>
        </Link>
      </Flex>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {hasQuizzes ? (
          <>
            {/* Quiz Cards Grid */}
            <Row
              gutter={[
                window.innerWidth < 576 ? 12 : 16,
                window.innerWidth < 576 ? 12 : 16,
              ]}
              style={{
                marginBottom: window.innerWidth < 768 ? 16 : 24,
              }}
            >
              {quizzes.map((quiz, index) => (
                <Col
                  key={quiz.id}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  xxl={6}
                >
                  <QuizCard
                    quiz={quiz}
                    index={index}
                    page={page}
                    pageSize={pageSize}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                    isDeleting={isLoading}
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <Flex
              justify="center"
              style={{
                paddingTop: window.innerWidth < 768 ? 8 : 16,
                paddingBottom: window.innerWidth < 768 ? 8 : 16,
                position: "sticky",
                bottom: 0,
                zIndex: 10,
              }}
            >
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalElements}
                onChange={handleTableChange}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} quizzes`
                }
              />
            </Flex>
          </>
        ) : (
          <Empty
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
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
  );
};

export default Quizzes;
