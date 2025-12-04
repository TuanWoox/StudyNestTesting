import React from "react";
import { Card, theme, Grid, Button, Space, Typography, message } from "antd";
import { ForkOutlined, CalendarOutlined, QuestionCircleOutlined, UserOutlined, EyeOutlined, LinkOutlined, StarOutlined, StarFilled, CopyOutlined } from "@ant-design/icons";
import { QuizDetail } from "@/types/quiz/quiz";
import { formatDMY } from "@/utils/date";
import { selectUserId } from "@/store/authSlice";
import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

interface QuizExploreCardProps {
    quiz: QuizDetail;
    onFork: (quizId: string) => void;
    onViewDetails: (quiz: QuizDetail) => void;
    isForkingId: string | null;
    isForking: boolean;
    onStar: (quizId: string, friendlyUrl?: string) => void;
    isStarringId: string | null;
    isStarring: boolean;
}

const QuizExploreCard: React.FC<QuizExploreCardProps> = ({
    quiz,
    onFork,
    onViewDetails,
    isForkingId,
    isForking,
    onStar,
    isStarringId,
    isStarring,
}) => {
    const { token } = useToken();
    const screens = useBreakpoint();
    const userId = useReduxSelector(selectUserId);

    const starCount = quiz.quizStars?.length || 0;
    const isStarred = quiz.quizStars?.some(star => star.userId === userId) || false;

    const borderColor = `2px solid ${token.colorPrimary}E0`;
    const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

    const difficultyColors: { [key: string]: string } = {
        easy: "#52c41a",
        medium: "#faad14",
        hard: "#f5222d",
    };

    return (
        <Card
            hoverable
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("button") || target.closest("a")) {
                    return;
                }
                onViewDetails(quiz);
            }}
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                border: borderColor,
                borderRadius: 0,
                boxShadow: shadowColor,
                backgroundColor: token.colorBgContainer,
                cursor: "pointer",
            }}
            styles={{
                body: {
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: screens.md ? "20px" : "16px",
                },
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `6px 6px 0px ${token.colorPrimary}55`;
                e.currentTarget.style.transform = "translate(-2px, -4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = shadowColor;
                e.currentTarget.style.transform = "translate(0, 0)";
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: 12 }}>
                <Title
                    level={4}
                    style={{
                        margin: 0,
                        fontFamily: "monospace",
                        fontSize: screens.md ? 18 : 16,
                        fontWeight: 700,
                    }}
                    ellipsis={{ rows: 2 }}
                >
                    {quiz.title}
                </Title>
            </div>

            {/* Info Section */}
            <div style={{ flex: 1, marginBottom: 16 }}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <UserOutlined style={{ color: token.colorPrimary }} />
                        <Text style={{ fontFamily: "monospace", fontSize: 14 }} ellipsis>
                            {quiz.owner?.userName || "Unknown"}
                        </Text>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <QuestionCircleOutlined style={{ color: token.colorPrimary }} />
                        <Text style={{ fontFamily: "monospace", fontSize: 14 }}>
                            {quiz.questions?.length || 0} Questions
                        </Text>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CalendarOutlined style={{ color: token.colorPrimary }} />
                        <Text style={{ fontFamily: "monospace", fontSize: 14 }}>
                            {formatDMY(quiz.dateCreated)}
                        </Text>
                    </div>

                    {quiz.difficulty && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        difficultyColors[quiz.difficulty.toLowerCase()] || token.colorPrimary,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                    color: difficultyColors[quiz.difficulty.toLowerCase()] || token.colorPrimary,
                                    fontWeight: 600,
                                }}
                            >
                                {quiz.difficulty}
                            </Text>
                        </div>
                    )}

                    {quiz.friendlyURL && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <LinkOutlined style={{ color: token.colorPrimary }} />
                            <Text
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: 13,
                                    color: token.colorTextSecondary,
                                    flex: 1,
                                }}
                                ellipsis
                            >
                                {quiz.friendlyURL}
                            </Text>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(quiz.friendlyURL || "");
                                    message.success("Friendly URL copied!");
                                }}
                                style={{
                                    padding: "0 4px",
                                    height: "auto",
                                    color: token.colorPrimary,
                                }}
                            />
                        </div>
                    )}
                </Space>
            </div>

            {/* Actions */}
            <div
                style={{
                    paddingTop: 16,
                    borderTop: `1px solid ${token.colorPrimary}88`,
                }}
            >
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(quiz);
                        }}
                        block
                        style={{
                            borderRadius: 0,
                            fontWeight: 600,
                            boxShadow: `2px 2px 0 ${token.colorPrimary}55`,
                            border: `1px solid ${token.colorPrimary}E0`,
                        }}
                    >
                        View Details
                    </Button>
                    <Space size={8} style={{ width: "100%", display: "flex" }}>
                        <Button
                            type={isStarred ? "primary" : "default"}
                            icon={isStarred ? <StarFilled /> : <StarOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onStar(quiz.id, quiz.friendlyURL);
                            }}
                            loading={isStarringId === quiz.id && isStarring}
                            disabled={isStarring}
                            style={{
                                borderRadius: 0,
                                fontWeight: 600,
                                boxShadow: `2px 2px 0 ${token.colorPrimary}55`,
                                border: `1px solid ${token.colorPrimary}E0`,
                                flex: 1,
                                backgroundColor: isStarred ? token.colorWarning : undefined,
                                borderColor: isStarred ? token.colorWarning : undefined,
                            }}
                        >
                            {starCount}
                        </Button>
                        <Button
                            type="primary"
                            icon={<ForkOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onFork(quiz.id);
                            }}
                            loading={isForkingId === quiz.id && isForking}
                            disabled={isForking}
                            style={{
                                borderRadius: 0,
                                fontWeight: 600,
                                boxShadow: `2px 2px 0 ${token.colorPrimary}55`,
                                border: `1px solid ${token.colorPrimary}E0`,
                                flex: 2,
                            }}
                        >
                            Fork Quiz
                        </Button>
                    </Space>
                </Space>
            </div>
        </Card>
    );
};

export default QuizExploreCard;
