import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import {
    Input,
    ModalProps,
    Typography,
    Card,
    Tag,
    Space,
    Divider,
    Collapse,
    Button,
} from "antd";
import {
    SearchOutlined,
    FileTextOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons";
import StudynestModal from "@/components/StudyNestModal/StudynestModal";
import { useAntDesignTheme } from "@/hooks/common";
import useForkQuiz from "@/hooks/quizHook/useForkQuiz";
import Spinner from "@/components/Spinner/Spinner";
import { QuestionItem } from "@/features/user/quizzes/QuizDetailPage/components/QuestionItem";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import useGetQuizDetailByFriendlyUrl from "@/hooks/quizHook/useGetQuizDetailByFriendlyURL";
const { Title, Text } = Typography;

export interface QuizForkModalRef {
    open: () => void;
    close: () => void;
}

interface QuizForkModalProps {
    // Add props as needed
}

const QuizForkModal = forwardRef<QuizForkModalRef, QuizForkModalProps>((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [quizFriendlyUrl, setQuizFriendlyUrl] = useState("");
    const [quizFriendlyUrlToSearch, setQuizFriendlyUrlToSearch] = useState("");
    const [initialFetching, setInitialFetching] = useState(true);
    const { borderColor, shadowColor, modalStyles } = useAntDesignTheme();
    const { mutate: forkQuiz, isPending: isForking } = useForkQuiz();
    const { data, refetch: fetchQuizDetail, isLoading: isFetching } = useGetQuizDetailByFriendlyUrl(quizFriendlyUrlToSearch, { enabled: false });

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => {
            setVisible(false);
            setQuizFriendlyUrl("");
        },
    }));

    useEffect(() => {
        if (quizFriendlyUrlToSearch.trim()) {
            fetchQuizDetail();
        }
    }, [quizFriendlyUrlToSearch, fetchQuizDetail]);

    useEffect(() => {
        setInitialFetching(false)
    }, [isFetching]);

    const customModalStyles: ModalProps["styles"] = {
        ...modalStyles,
        body: {
            ...modalStyles.body,
            padding: "12px",
        },
    };

    const handleClose = () => {
        setVisible(false);
        setQuizFriendlyUrl("");
        setQuizFriendlyUrlToSearch("");
        setInitialFetching(true);
    };

    const handleFork = () => {
        if (data?.id) {
            forkQuiz(data.id, {
                onSuccess: (data) => {
                    if (data) {
                        handleClose();
                    }
                },
            });
        }
    };

    const handleFetchQuiz = () => {
        setQuizFriendlyUrlToSearch(quizFriendlyUrl.trim());
    };

    const renderFooter = () => {
        const buttonStyle = {
            borderRadius: 0,
            border: `1px solid ${borderColor}`,
            boxShadow: `2px 2px 0 ${shadowColor}`,
            fontWeight: 600,
        };

        if (data) {
            return (
                <div className="flex justify-end gap-2 mb-4 mr-4 ml-4">
                    <Button onClick={handleClose} style={buttonStyle}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleFork}
                        loading={isForking}
                        style={buttonStyle}
                    >
                        Fork Quiz
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex justify-end gap-2 mb-4 mr-4 ml-4">
                <Button onClick={handleClose} style={buttonStyle}>
                    Close
                </Button>
            </div>
        );
    };

    return (
        <StudynestModal
            visible={visible}
            onClose={handleClose}
            customStyles={customModalStyles}
            customFooter={renderFooter()}
            width="80vw"
        >
            <div>
                <Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>
                    Fork Quiz
                </Title>

                <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>
                    Enter Quiz Friendly Url
                </Title>

                <Input
                    placeholder="Enter quiz friendly URL..."
                    prefix={<SearchOutlined />}
                    value={quizFriendlyUrl}
                    onChange={(e) => setQuizFriendlyUrl(e.target.value)}
                    onPressEnter={handleFetchQuiz}
                    disabled={isFetching}
                    style={{
                        borderRadius: 0,
                        border: `1px solid ${borderColor}`,
                        boxShadow: `2px 2px 0 ${shadowColor}`,
                        fontSize: 15,
                        marginBottom: 12,
                    }}
                />

                {isFetching ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                        <Spinner />
                    </div>
                ) : data ? (
                    <div style={{ marginTop: 16, maxHeight: "60vh", overflowY: "auto", scrollbarWidth: "none" }}>
                        <Card
                            style={{
                                borderRadius: 0,
                                border: `1px solid ${borderColor}`,
                                boxShadow: `2px 2px 0 ${shadowColor}`,
                                marginBottom: 16,
                            }}
                        >
                            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                {/* Quiz Title */}
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                        {data.title}
                                    </Text>
                                </div>

                                {/* Owner Information */}
                                {data.owner && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <UserOutlined style={{ color: "#8c8c8c" }} />
                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                            Created by: <Text strong>{data.owner.userName || data.owner.email}</Text>
                                        </Text>
                                    </div>
                                )}

                                <Divider style={{ margin: "8px 0" }} />

                                {/* Quiz Metadata */}
                                <Space wrap size="small">
                                    <Tag
                                        icon={<FileTextOutlined />}
                                        color="blue"
                                        style={{ borderRadius: 0 }}
                                    >
                                        {data.questions?.length || 0} Questions
                                    </Tag>
                                    {data.difficulty && (
                                        <Tag
                                            icon={<TrophyOutlined />}
                                            color={
                                                data.difficulty === "Easy"
                                                    ? "green"
                                                    : data.difficulty === "Medium"
                                                        ? "gold"
                                                        : "red"
                                            }
                                            style={{ borderRadius: 0 }}
                                        >
                                            {data.difficulty}
                                        </Tag>
                                    )}
                                </Space>
                            </Space>
                        </Card>

                        {/* Questions Preview */}
                        {data.questions && data.questions.length > 0 && (
                            <div>
                                <Text strong style={{ fontSize: 14, marginBottom: 8, display: "block" }}>
                                    Questions Preview
                                </Text>
                                <Collapse
                                    accordion={false}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                    }}
                                    items={data.questions.map((question, index) => ({
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
                                            marginBottom: 12,
                                            backgroundColor: "white",
                                            borderRadius: 0,
                                            border: `1px solid ${borderColor}`,
                                            boxShadow: `2px 2px 0 ${shadowColor}`,
                                            overflow: "hidden",
                                        },
                                    }))}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        type="empty"
                        title={initialFetching ? "Find The Quiz" : "No Public Quiz Found"}
                    />
                )}
            </div>
        </StudynestModal>
    );
});

QuizForkModal.displayName = "QuizForkModal";

export default QuizForkModal;
