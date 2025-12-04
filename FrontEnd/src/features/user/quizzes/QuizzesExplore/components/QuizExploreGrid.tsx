import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Skeleton, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { QuizDetail } from "@/types/quiz/quiz";
import QuizExploreCard from "./QuizExploreCard";

const { useToken } = theme;

interface QuizExploreGridProps {
    quizzes: QuizDetail[];
    isPending: boolean;
    pageSize: number;
    onFork: (quizId: string) => void;
    onViewDetails: (quiz: QuizDetail) => void;
    isForkingId: string | null;
    isForking: boolean;
    onStar: (quizId: string, friendlyUrl?: string) => void;
    isStarringId: string | null;
    isStarring: boolean;
}

const QuizExploreGrid: React.FC<QuizExploreGridProps> = ({
    quizzes,
    isPending,
    pageSize,
    onFork,
    onViewDetails,
    isForkingId,
    isForking,
    onStar,
    isStarringId,
    isStarring,
}) => {
    const { token } = useToken();
    const borderColor = `2px solid ${token.colorPrimary}E0`;
    const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

    // Loading state
    if (isPending) {
        return (
            <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
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
            <EmptyState
                type="empty"
                title="No Public Quizzes Found"
                description="There are no public quizzes available at the moment. Try adjusting your search or filters."
                actionIcon={<SearchOutlined />}
            />
        );
    }

    // Quiz grid
    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
            {quizzes.map((quiz) => (
                <Col key={quiz.id} xs={24} sm={12} md={8}>
                    <QuizExploreCard
                        quiz={quiz}
                        onFork={onFork}
                        onViewDetails={onViewDetails}
                        isForkingId={isForkingId}
                        isForking={isForking}
                        onStar={onStar}
                        isStarringId={isStarringId}
                        isStarring={isStarring}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default QuizExploreGrid;
