import React, { useState, useEffect } from "react";
import { Typography, Flex, Button, Space, Input, message } from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  FormOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useUpdateQuiz from "@/hooks/quizHook/useUpdateQuiz";
import { validateQuizTitle } from "../utils/validation";

const { Title } = Typography;

interface QuizHeaderProps {
  quiz: any;
  onDirtyChange: (isDirty: boolean) => void;
  showConfirmDiscard: (action: () => void) => void;
  onTakeQuiz: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  quiz,
  onDirtyChange,
  showConfirmDiscard,
  onTakeQuiz,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(quiz.title);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { updateQuizAsync, isLoading: isUpdatingQuiz } = useUpdateQuiz();

  useEffect(() => {
    setEditedTitle(quiz.title);
  }, [quiz.title]);

  const handleEditTitle = () => {
    setIsEditingTitle(true);
    onDirtyChange(true);
  };

  const handleSaveTitle = async () => {
    const error = validateQuizTitle(editedTitle);
    if (error) {
      message.error(error);
      return;
    }

    try {
      await updateQuizAsync({
        id: quiz.id,
        title: editedTitle,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          name: q.name,
          type: q.type,
          explanation: q.explanation || "",
          choices: q.choices,
        })),
      });
      message.success("Title updated successfully");
      setIsEditingTitle(false);
      onDirtyChange(false);
    } catch (error) {
      console.error("Failed to update title:", error);
      message.error("Failed to update title");
    }
  };

  const handleCancelTitleEdit = () => {
    showConfirmDiscard(() => {
      setEditedTitle(quiz.title);
      setIsEditingTitle(false);
      onDirtyChange(false);
    });
  };

  const handleReturnQuiz = () => {
    showConfirmDiscard(() => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      navigate(`/user/quiz`);
    });
  };

  return (
    <Flex
      vertical
      gap={16}
      style={{
        marginBottom: 0,
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Space size={isMobile ? 8 : 16} style={{ flex: 1, minWidth: 0 }}>
          {isEditingTitle ? (
            <Space wrap>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                maxLength={300}
                style={{
                  width: isMobile ? 200 : 400,
                  minWidth: 150,
                }}
                size="large"
                autoFocus
                disabled={isUpdatingQuiz}
                onPressEnter={handleSaveTitle}
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveTitle}
                size="large"
                loading={isUpdatingQuiz}
              >
                {!isMobile && "Save"}
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancelTitleEdit}
                size="large"
                disabled={isUpdatingQuiz}
              >
                {!isMobile && "Cancel"}
              </Button>
            </Space>
          ) : (
            <Space style={{ overflow: "hidden" }}>
              <Title
                level={3}
                style={{
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: isMobile ? "200px" : "500px",
                }}
                title={quiz.title}
              >
                {quiz.title}
              </Title>
              <Button
                icon={<EditOutlined />}
                onClick={handleEditTitle}
                type="text"
                style={{ color: "#1890ff" }}
                size={isMobile ? "small" : "middle"}
              >
                {!isMobile && "Edit"}
              </Button>
            </Space>
          )}
        </Space>

        <Space wrap>
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={onTakeQuiz}
            size={isMobile ? "middle" : "large"}
            style={{ whiteSpace: "nowrap" }}
          >
            {!isMobile && "Take Quiz"}
          </Button>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleReturnQuiz}
            size={isMobile ? "middle" : "large"}
            style={{ whiteSpace: "nowrap" }}
          >
            {!isMobile && "Back"}
          </Button>
        </Space>
      </Flex>
    </Flex>
  );
};

export default QuizHeader;
