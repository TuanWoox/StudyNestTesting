import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid } from "antd";
import {
  EyeOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

interface QuizCardActionsProps {
  quizId: string;
}

const QuizCardActions: React.FC<QuizCardActionsProps> = ({ quizId }) => {
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
      <Link to={`/user/quiz/history/${quizId}`} style={{ flex: 1 }}>
        <Button
          icon={<HistoryOutlined />}
          block
          size="middle"
          style={{
            borderRadius: 0,
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {!screens.xs && "History"}
        </Button>
      </Link>
    </div>
  );
};

export default QuizCardActions;
