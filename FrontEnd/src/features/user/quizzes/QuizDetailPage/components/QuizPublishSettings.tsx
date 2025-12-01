import React, { useState } from "react";
import { Switch, Input, Button, Space, Typography, theme, Collapse } from "antd";
import { GlobalOutlined, LinkOutlined, SaveOutlined, CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { useAntDesignTheme } from "@/hooks/common";
import usePublishQuiz from "@/hooks/quizHook/usePublishQuiz";
import { toast } from "sonner";
import { useChangeFriendlyUrl } from "@/hooks/quizHook/useChangeFriendlyUrl";

const { Text } = Typography;
const { useToken } = theme;
const { Panel } = Collapse;

interface QuizPublishSettingsProps {
    quiz: any;
    onDirtyChange: (isDirty: boolean) => void;
    showConfirmDiscard: (action: () => void) => void;
}

export const QuizPublishSettings: React.FC<QuizPublishSettingsProps> = ({
    quiz,
    onDirtyChange,
    showConfirmDiscard,
}) => {
    const { token } = useToken();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [editedFriendlyUrl, setEditedFriendlyUrl] = useState("");
    const { borderColor, shadowColor } = useAntDesignTheme();
    const { mutate: publishQuiz, isPending: isPublishing } = usePublishQuiz();
    const { mutate: changeFriendlyUrl, isPending: isChangingUrl } = useChangeFriendlyUrl();

    const handleTogglePublish = async (checked: boolean) => {
        publishQuiz(quiz.id);
    };

    const handleEditUrl = () => {
        setEditedFriendlyUrl(quiz.friendlyURL || "");
        setIsEditingUrl(true);
        onDirtyChange(true);
    };

    const handleSaveUrl = async () => {
        const trimmedUrl = editedFriendlyUrl.trim();

        if (!trimmedUrl) {
            toast.error("Friendly URL cannot be empty");
            return;
        }

        if (trimmedUrl.length < 3) {
            toast.error("Friendly URL must be at least 3 characters");
            return;
        }

        if (trimmedUrl.length > 100) {
            toast.error("Friendly URL must be less than 100 characters");
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUrl)) {
            toast.error("Friendly URL can only contain letters, numbers, hyphens, and underscores");
            return;
        }

        changeFriendlyUrl(
            { quizId: quiz.id, newFriendlyUrl: trimmedUrl },
            {
                onSuccess: (data) => {
                    if (data) {
                        setIsEditingUrl(false);
                        setEditedFriendlyUrl("");
                        onDirtyChange(false);
                    }
                },
            }
        );
    };

    const handleCancelUrlEdit = () => {
        showConfirmDiscard(() => {
            setEditedFriendlyUrl("");
            setIsEditingUrl(false);
            onDirtyChange(false);
        });
    };

    const handleCopyUrl = () => {
        const urlToCopy = quiz.friendlyURL;
        navigator.clipboard.writeText(urlToCopy).then(() => {
            toast.success("URL copied to clipboard!");
        }).catch(() => {
            toast.error("Failed to copy URL");
        });
    };

    return (
        <Collapse
            defaultActiveKey={[]}
            style={{
                marginTop: isMobile ? token.marginSM : token.margin,
                border: `2px solid ${borderColor}`,
                borderRadius: 0,
                boxShadow: `4px 4px 0px ${shadowColor}`,
                backgroundColor: token.colorBgContainer,
            }}
        >
            <Panel
                header={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <GlobalOutlined />
                        <Text strong>Quiz Visibility Settings</Text>
                    </div>
                }
                key="1"
            >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Control whether this quiz is publicly accessible
                        </Text>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Switch
                            checked={quiz.isPublic}
                            onChange={handleTogglePublish}
                            loading={isPublishing}
                            checkedChildren="Public"
                            unCheckedChildren="Private"
                        />
                        <Text strong style={{ fontSize: 14 }}>
                            {quiz.isPublic ? "Quiz is Public" : "Quiz is Private"}
                        </Text>
                    </div>

                    {quiz.isPublic && (
                        <div
                            style={{
                                marginTop: 16,
                                padding: 16,
                                backgroundColor: token.colorBgLayout,
                                border: `1px solid ${token.colorBorder}`,
                            }}
                        >
                            <div style={{ marginBottom: 12 }}>
                                <Text strong style={{ fontSize: 14 }}>
                                    <LinkOutlined style={{ marginRight: 8 }} />
                                    Friendly URL
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                                    Customize the public URL for this quiz
                                </Text>
                            </div>

                            {isEditingUrl ? (
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        prefix={<LinkOutlined />}
                                        value={editedFriendlyUrl}
                                        onChange={(e) => setEditedFriendlyUrl(e.target.value)}
                                        placeholder="my-awesome-quiz"
                                        style={{
                                            borderRadius: 0,
                                            fontSize: 14,
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSaveUrl}
                                        loading={isChangingUrl}
                                        style={{
                                            borderRadius: 0,
                                            border: `1px solid ${borderColor}`,
                                            boxShadow: `2px 2px 0 ${shadowColor}`,
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={handleCancelUrlEdit}
                                        style={{
                                            borderRadius: 0,
                                            border: `1px solid ${borderColor}`,
                                            boxShadow: `2px 2px 0 ${shadowColor}`,
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Space.Compact>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            backgroundColor: token.colorBgContainer,
                                            border: `1px solid ${token.colorBorder}`,
                                            marginBottom: 8,
                                            fontFamily: "monospace",
                                            fontSize: 13,
                                        }}
                                    >
                                        <Text code>{quiz.friendlyURL}</Text>
                                    </div>
                                    <Space size="small">
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={handleCopyUrl}
                                            style={{
                                                borderRadius: 0,
                                                border: `1px solid ${borderColor}`,
                                                boxShadow: `2px 2px 0 ${shadowColor}`,
                                            }}
                                        >
                                            Copy URL
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={handleEditUrl}
                                            style={{
                                                borderRadius: 0,
                                                border: `1px solid ${borderColor}`,
                                                boxShadow: `2px 2px 0 ${shadowColor}`,
                                            }}
                                        >
                                            Edit URL
                                        </Button>
                                    </Space>
                                </div>
                            )}
                        </div>
                    )}
                </Space>
            </Panel>
        </Collapse>
    );
};
