import React from "react";
import { Empty, Space, Typography, Button, theme } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useToken } = theme;

interface QuestionListEmptyProps {
  onAddQuestion: () => void;
}

export const QuestionListEmpty: React.FC<QuestionListEmptyProps> = ({
  onAddQuestion,
}) => {
  const { token } = useToken();

  // Theme constants
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  return (
    <Empty
      image={
        <InboxOutlined
          style={{ fontSize: 64, color: token.colorTextDisabled }}
        />
      }
      description={
        <Space direction="vertical" size={token.marginXS}>
          <Text
            strong
            style={{
              fontSize: 16,
              color: token.colorText,
              fontFamily: "monospace",
            }}
          >
            No Questions Yet
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: 14, fontFamily: "monospace" }}
          >
            Click "Add Question" to create your first question
          </Text>
        </Space>
      }
      style={{
        padding: "60px 20px",
        backgroundColor: token.colorBgLayout,
        borderRadius: 0,
        border: borderColor,
        boxShadow: shadowColor,
      }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddQuestion}
        size="large"
        style={{
          borderRadius: 0,
          height: 44,
          paddingLeft: 32,
          paddingRight: 32,
          fontFamily: "monospace",
          fontWeight: 600,
        }}
      >
        Add Your First Question
      </Button>
    </Empty>
  );
};
