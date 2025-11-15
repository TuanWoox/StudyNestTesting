import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Skeleton, Empty, Button, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { QuizList } from "@/types/quiz/quiz";
import QuizCard from "./QuizCard";

const { useToken } = theme;

interface QuizGridProps {
  quizzes: QuizList[];
  isPending: boolean;
  pageSize: number;
  page: number;
  onDelete: (quizId: string) => void;
  deletingId: string | null;
  isDeleting: boolean;
}

const QuizGrid: React.FC<QuizGridProps> = ({
  quizzes,
  isPending,
  pageSize,
  page,
  onDelete,
  deletingId,
  isDeleting,
}) => {
  const { token } = useToken();
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  // Loading state
  if (isPending) {
    return (
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
    );
  }

  // Empty state
  if (!quizzes || quizzes.length === 0) {
    return (
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
    );
  }

  // Quiz grid
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 100 }}>
      {quizzes.map((quiz, index) => (
        <Col key={quiz.id} xs={24} sm={12} md={8}>
          <QuizCard
            quiz={quiz}
            index={index}
            page={page}
            pageSize={pageSize}
            onDelete={onDelete}
            deletingId={deletingId}
            isDeleting={isDeleting}
          />
        </Col>
      ))}
    </Row>
  );
};

export default QuizGrid;
