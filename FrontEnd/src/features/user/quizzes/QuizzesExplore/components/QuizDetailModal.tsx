import React, { useState } from "react";
import { Modal, Typography, Space, Divider, theme, Tag, Button, Collapse } from "antd";
import {
    QuestionCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    ForkOutlined,
    CloseOutlined,
    DownOutlined,
    UpOutlined,
    LinkOutlined,
} from "@ant-design/icons";
import { QuizDetail } from "@/types/quiz/quiz";
import { formatDMY } from "@/utils/date";
import { QuestionItem } from "@/features/user/quizzes/QuizDetailPage/components/QuestionItem";

const { Title, Text } = Typography;
const { useToken } = theme;

interface QuizDetailModalProps {
    visible: boolean;
    quiz: QuizDetail | null;
    onClose: () => void;
    onFork: (quizId: string) => void;
    isForkingId: string | null;
    isForking: boolean;
}

const QuizDetailModal: React.FC<QuizDetailModalProps> = ({
    visible,
    quiz,
    onClose,
    onFork,
    isForkingId,
    isForking,
}) => {
    const { token } = useToken();
    const [expandedAll, setExpandedAll] = useState(false);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);

    if (!quiz) return null;

    const borderColor = `${token.colorPrimary}55`;
    const shadowColor = `${token.colorPrimary}55`;

    const difficultyColors: { [key: string]: string } = {
        easy: token.colorSuccess,
        medium: token.colorWarning,
        hard: token.colorError,
    };

    const handleExpandAll = () => {
        if (expandedAll) {
            setActiveKeys([]);
        } else {
            setActiveKeys(quiz.questions?.map((q) => q.id) || []);
        }
        setExpandedAll(!expandedAll);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={[
                <Button
                    key="close"
                    onClick={onClose}
                    icon={<CloseOutlined />}
                    style={{
                        borderRadius: 0,
                        boxShadow: `2px 2px 0 ${shadowColor}`,
                        border: `1px solid ${borderColor}`,
                        fontFamily: "monospace",
                    }}
                >
                    Close
                </Button>,
                <Button
                    key="fork"
                    type="primary"
                    icon={<ForkOutlined />}
                    onClick={() => {
                        onFork(quiz.id);
                        onClose();
                    }}
                    loading={isForkingId === quiz.id && isForking}
                    disabled={isForking}
                    style={{
                        borderRadius: 0,
                        fontWeight: 600,
                        boxShadow: `2px 2px 0 ${token.colorPrimary}55`,
                        border: `1px solid ${token.colorPrimary}E0`,
                        fontFamily: "monospace",
                    }}
                >
                    Fork Quiz
                </Button>,
            ]}
            width={900}
            centered
            styles={{
                mask: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                },
                content: {
                    backgroundColor: token.colorBgElevated,
                    border: `1px solid ${borderColor}`,
                    boxShadow: `4px 4px 0 ${shadowColor}`,
                    borderRadius: 0,
                    fontFamily: "monospace",
                    maxHeight: "90vh",
                },
                body: {
                    maxHeight: "calc(90vh - 140px)",
                    overflowY: "auto",
                    paddingRight: 8,
                    scrollbarWidth: "none",
                    scrollbarColor: `${token.colorPrimary} ${token.colorBgContainer}`,
                },
            }}
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* Title */}
                <div>
                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            fontFamily: "monospace",
                            fontWeight: 700,
                        }}
                    >
                        {quiz.title}
                    </Title>
                </div>

                <Divider style={{ margin: "12px 0", borderColor }} />

                {/* Creator Info */}
                <div>
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <UserOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                            <Text strong style={{ fontFamily: "monospace", fontSize: 15 }}>
                                Created by:
                            </Text>
                            <Text style={{ fontFamily: "monospace", fontSize: 15 }}>
                                {quiz.owner?.userName || "Unknown"}
                            </Text>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <CalendarOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                            <Text strong style={{ fontFamily: "monospace", fontSize: 15 }}>
                                Created on:
                            </Text>
                            <Text style={{ fontFamily: "monospace", fontSize: 15 }}>
                                {formatDMY(quiz.dateCreated)}
                            </Text>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <QuestionCircleOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                            <Text strong style={{ fontFamily: "monospace", fontSize: 15 }}>
                                Questions:
                            </Text>
                            <Text style={{ fontFamily: "monospace", fontSize: 15 }}>
                                {quiz.questions?.length || 0}
                            </Text>
                        </div>

                        {quiz.difficulty && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor:
                                            difficultyColors[quiz.difficulty.toLowerCase()] || token.colorPrimary,
                                    }}
                                />
                                <Text strong style={{ fontFamily: "monospace", fontSize: 15 }}>
                                    Difficulty:
                                </Text>
                                <Tag
                                    color={difficultyColors[quiz.difficulty.toLowerCase()]}
                                    style={{
                                        borderRadius: 0,
                                        fontFamily: "monospace",
                                        fontWeight: 600,
                                        textTransform: "capitalize",
                                        border: "none",
                                    }}
                                >
                                    {quiz.difficulty}
                                </Tag>
                            </div>
                        )}

                        {quiz.friendlyURL && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <LinkOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                                <Text strong style={{ fontFamily: "monospace", fontSize: 15 }}>
                                    URL:
                                </Text>
                                <Text
                                    code
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: 14,
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {quiz.friendlyURL}
                                </Text>
                            </div>
                        )}
                    </Space>
                </div>

                <Divider style={{ margin: "12px 0", borderColor }} />

                {/* Questions Preview */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <Title level={5} style={{ fontFamily: "monospace", margin: 0 }}>
                            Questions Preview
                        </Title>
                        <Button
                            size="small"
                            icon={expandedAll ? <UpOutlined /> : <DownOutlined />}
                            onClick={handleExpandAll}
                            style={{
                                fontFamily: "monospace",
                                borderRadius: 0,
                                boxShadow: `2px 2px 0 ${shadowColor}`,
                                border: `1px solid ${borderColor}`,
                            }}
                        >
                            {expandedAll ? "Collapse All" : "Expand All"}
                        </Button>
                    </div>
                    <Collapse
                        activeKey={activeKeys}
                        onChange={(keys) => {
                            setActiveKeys(keys as string[]);
                            setExpandedAll(keys.length === quiz.questions?.length);
                        }}
                        accordion={false}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                        }}
                        items={quiz.questions?.map((question, index) => ({
                            key: question.id,
                            label: (
                                <div
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fontFamily: "monospace",
                                    }}
                                >
                                    Question {index + 1}: {question.name}
                                </div>
                            ),
                            children: (
                                <QuestionItem
                                    question={question}
                                    index={index}
                                />
                            ),
                            style: {
                                marginBottom: 8,
                                border: `1px solid ${borderColor}`,
                                backgroundColor: token.colorBgContainer,
                                boxShadow: `2px 2px 0 ${shadowColor}`,
                                borderRadius: 0,
                            },
                        }))}
                    />
                </div>
            </Space>
        </Modal>
    );
};

export default QuizDetailModal;
