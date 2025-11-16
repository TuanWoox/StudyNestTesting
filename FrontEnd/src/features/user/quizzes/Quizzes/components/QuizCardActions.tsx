import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Grid } from "antd";
import {
  EyeOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { QuizTimeLimitModal } from "@/components/QuizTimeLimit/QuizTimeLimit";

const { useBreakpoint } = Grid;

interface QuizCardActionsProps {
  quizId: string;
}

const QuizCardActions: React.FC<QuizCardActionsProps> = ({ quizId }) => {
  const [isQuizTimeLimitOpen, setIsQuizTimeLimitOpen] = useState<boolean>(false);
  const navigate = useNavigate()
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

      <Button
        type="primary"
        icon={<PlayCircleOutlined />}
        block
        size="middle"
        style={{
          borderRadius: 0,
          fontFamily: "monospace",
          fontWeight: 600,
          flex: 1
        }}
        onClick={() => setIsQuizTimeLimitOpen(true)}
      >
        {!screens.xs && "Take Quiz"}
      </Button>
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

      <QuizTimeLimitModal
        open={isQuizTimeLimitOpen}
        onOpenChange={setIsQuizTimeLimitOpen}
        onConfirm={(time: number) => {
          //Set the time to local storage => so that we can take it out from other component
          if (quizId && typeof time === "number" && (time > 0 || time === -1)) {
            window.localStorage.setItem(quizId, time.toString());
          }
          setIsQuizTimeLimitOpen(false);
          navigate(`/user/quiz/quizAttempt/${quizId}`, {
            state: {
              from: "/user/quiz"
            }
          });
        }}
      />
    </div>
  );
};

export default QuizCardActions;
