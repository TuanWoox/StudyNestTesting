import React from "react";
import { Typography, Button, Space, Grid, theme } from "antd";
import { ArrowLeftOutlined, HistoryOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { useToken } = theme;

interface QuizHistoryHeaderProps {
  quizTitle: string;
  totalAttempts: number;
  onBack: () => void;
}

const QuizHistoryHeader: React.FC<QuizHistoryHeaderProps> = ({
  quizTitle,
  totalAttempts,
  onBack,
}) => {
  const screens = useBreakpoint();
  const { token } = useToken();

  return (
    <div
      style={{
        marginBottom: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Title
          level={2}
          style={{
            margin: 0,
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          Quiz History
        </Title>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{
            fontFamily: "monospace",
            borderRadius: 0,
            fontWeight: 600,
          }}
        >
          Back to Quizzes
        </Button>
      </div>

      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        <Text
          style={{
            fontSize: screens.md ? 16 : 14,
            fontFamily: "monospace",
            fontWeight: 500,
            display: "block",
          }}
        >
          {quizTitle}
        </Text>

        <Text
          type="secondary"
          style={{
            fontSize: screens.md ? 14 : 13,
            fontFamily: "monospace",
          }}
        >
          {totalAttempts} {totalAttempts === 1 ? "attempt" : "attempts"} found
        </Text>
      </Space>
    </div>
  );
};

export default QuizHistoryHeader;
