import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

interface QuizCardActionsProps {
  quizId: string;
  onDelete: (quizId: string) => void;
  isDeleting: boolean;
  deletingId: string | null;
}

const QuizCardActions: React.FC<QuizCardActionsProps> = ({
  quizId,
  onDelete,
  isDeleting,
  deletingId,
}) => {
  const screens = useBreakpoint();

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "stretch",
        flexWrap: "wrap",
      }}
    >
      <Link to={`/user/quiz/quizAttempt/${quizId}`} style={{ flex: 1 }}>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          block
          size="middle"
          style={{
            borderRadius: 0,
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {!screens.xs && "Take Quiz"}
        </Button>
      </Link>
      <Link to={`/user/quiz/${quizId}`} style={{ flex: 1 }}>
        <Button
          icon={<EyeOutlined />}
          block
          size="middle"
          style={{
            borderRadius: 0,
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {!screens.xs && "Details"}
        </Button>
      </Link>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <Button
          danger
          type="default"
          icon={<DeleteOutlined />}
          size="middle"
          loading={deletingId === quizId && isDeleting}
          disabled={isDeleting && deletingId !== quizId}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(quizId);
          }}
          style={{
            borderRadius: 0,
            fontFamily: "monospace",
            fontWeight: 600,
            minWidth: "44px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          title="Delete quiz"
        />
      </div>
    </div>
  );
};

export default QuizCardActions;
