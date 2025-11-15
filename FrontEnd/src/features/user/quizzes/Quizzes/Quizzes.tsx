import React, { useState } from "react";
import { Button, Card, Typography, Empty, theme } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import useGetAllQuiz from "@/hooks/quizHook/useGetAllQuiz";
import useDeleteQuiz from "@/hooks/quizHook/useDeleteQuiz";
import useDebounce from "@/hooks/common/useDebounce";
import QuizHeader from "./components/QuizHeader";
import QuizStats from "./components/QuizStats";
import QuizGrid from "./components/QuizGrid";
import QuizDeleteModal from "./components/QuizDeleteModal";
import QuizPagination from "./components/QuizPagination";

const { Text } = Typography;
const { useToken } = theme;

const Quizzes: React.FC = () => {
  const { token } = useToken();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

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
        padding: "16px 24px",
        paddingBottom: "80px",
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        backgroundColor: token.colorBgLayout,
        scrollbarWidth: "none",
      }}
    >
      <div style={{ width: "100%" }}>
        <QuizHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <QuizStats totalQuizzes={totalElements} />

        <QuizGrid
          quizzes={quizzes}
          isPending={isPending}
          pageSize={pageSize}
          page={page}
          onDelete={handleDelete}
          deletingId={deletingQuizId}
          isDeleting={isDeleting}
        />

        <QuizPagination
          current={page}
          pageSize={pageSize}
          total={totalElements}
          onChange={handleTableChange}
        />
      </div>

      <QuizDeleteModal
        visible={showDeleteModal}
        quizTitle={quizToDelete?.title}
        loading={deletingQuizId === quizToDelete?.id && isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Quizzes;

