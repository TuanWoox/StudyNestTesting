import React from "react";
import { Link } from "react-router-dom";
import { Button, Flex, Typography, Space, Input, theme } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

interface QuizHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const { token } = useToken();
  const borderColor = `2px solid ${token.colorPrimary}E0`;

  return (
    <Flex
      justify="space-between"
      align="flex-start"
      wrap="wrap"
      gap={16}
      style={{ marginBottom: 32 }}
    >
      <div style={{ flex: "1 1 auto", minWidth: 250 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          My Quizzes
        </Title>
        <Text
          type="secondary"
          style={{
            fontSize: 15,
            marginTop: 4,
            display: "block",
            fontFamily: "monospace",
          }}
        >
          Manage and retake your created quizzes
        </Text>
      </div>
      <Space wrap size={[8, 8]} style={{ flex: "0 0 auto" }}>
        <Input
          placeholder="Search quizzes..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          size="large"
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: 240,
            minWidth: 200,
            borderRadius: 0,
            fontFamily: "monospace",
            border: borderColor,
          }}
          allowClear
        />
        <Link to="/user/quiz/generate">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{
              borderRadius: 0,
              fontFamily: "monospace",
              border: borderColor,
              fontWeight: 600,
            }}
          >
            Create New Quiz
          </Button>
        </Link>
      </Space>
    </Flex>
  );
};

export default QuizHeader;
