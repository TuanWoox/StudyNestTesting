import React from "react";
import { Link } from "react-router-dom";
import { Button, Flex, Typography, Space, Input, theme, Grid } from "antd";
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
  const screens = Grid.useBreakpoint();
  return (
    <Flex
      vertical={screens.xs}
      justify="space-between"
      align={screens.xs ? "stretch" : "center"}
      wrap={screens.xs ? "wrap" : "nowrap"}
      gap={screens.xs ? 16 : 16}
      style={{ marginBottom: 32 }}
    >
      <div style={{ flex: screens.xs ? "1 1 100%" : "0 0 auto", minWidth: screens.xs ? "100%" : 250 }}>
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
      <Space
        wrap={false}
        size={[8, 8]}
        style={{
          width: screens.xs ? "100%" : "auto",
          maxWidth: screens.xs ? "100%" : undefined,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Input
          placeholder={screens.xs ? "Search..." : "Search quizzes..."}
          prefix={<SearchOutlined />}
          value={searchTerm}
          size="large"
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
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
              paddingInline: screens.xs ? 12 : undefined,
              width: screens.xs ? "auto" : "auto",
              whiteSpace: "nowrap",
            }}
          >
            {screens.xs ? "" : "Create New Quiz"}
          </Button>
        </Link>
      </Space>
    </Flex>
  );
};

export default QuizHeader;
