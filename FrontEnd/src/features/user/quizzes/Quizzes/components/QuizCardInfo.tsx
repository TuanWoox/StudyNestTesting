import React from "react";
import { Typography, Space } from "antd";

const { Text } = Typography;

interface QuizCardInfoProps {
  totalQuestions: number;
  dateCreated: string;
}

const QuizCardInfo: React.FC<QuizCardInfoProps> = ({
  totalQuestions,
  dateCreated,
}) => {
  return (
    <div style={{ flex: 1, marginBottom: 16 }}>
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary" style={{ fontFamily: "monospace" }}>
            Questions:
          </Text>
          <Text strong style={{ fontSize: 16, fontFamily: "monospace" }}>
            {totalQuestions}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary" style={{ fontFamily: "monospace" }}>
            Created:
          </Text>
          <Text strong style={{ fontSize: 14, fontFamily: "monospace" }}>
            {dateCreated}
          </Text>
        </div>
      </Space>
    </div>
  );
};

export default QuizCardInfo;
