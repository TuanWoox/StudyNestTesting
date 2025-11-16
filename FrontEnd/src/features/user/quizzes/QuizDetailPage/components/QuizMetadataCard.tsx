import React from "react";
import { Card, Flex, Space, Tag, Typography, theme } from "antd";
import { formatDMY } from "@/utils/date";

const { Text } = Typography;
const { useToken } = theme;

interface QuizMetadataCardProps {
  questionCount: number;
  dateCreated?: string;
}

export const QuizMetadataCard: React.FC<QuizMetadataCardProps> = ({
  questionCount,
  dateCreated,
}) => {
  const { token } = useToken();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Theme constants
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  return (
    <Card
      style={{
        marginTop: isMobile ? token.marginSM : token.margin,
        border: borderColor,
        borderRadius: 0,
        boxShadow: shadowColor,
        backgroundColor: token.colorBgContainer,
      }}
      bodyStyle={{
        padding: isMobile ? token.paddingSM : token.padding,
      }}
    >
      <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
        <Space size="small">
          <Tag
            color="blue"
            style={{
              fontSize: isMobile ? 13 : 14,
              padding: isMobile ? "4px 10px" : "5px 12px",
              borderRadius: 0,
              fontWeight: 500,
              fontFamily: "monospace",
            }}
          >
            {questionCount} Question{questionCount !== 1 ? "s" : ""}
          </Tag>
        </Space>
        <Text
          type="secondary"
          style={{
            fontSize: isMobile ? 12 : 14,
            fontFamily: "monospace",
          }}
        >
          Created {dateCreated && formatDMY(dateCreated)}
        </Text>
      </Flex>
    </Card>
  );
};
