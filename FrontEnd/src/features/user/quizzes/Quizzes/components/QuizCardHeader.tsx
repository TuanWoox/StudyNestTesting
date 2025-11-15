import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

interface QuizCardHeaderProps {
  title: string;
  noteTitle: string;
}

const QuizCardHeader: React.FC<QuizCardHeaderProps> = ({
  title,
  noteTitle,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div style={{ flex: 1, paddingRight: 8 }}>
        <Title
          level={5}
          style={{
            margin: 0,
            marginBottom: 8,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {title}
        </Title>
        <Text
          type="secondary"
          style={{
            fontSize: 13,
            display: "block",
            marginBottom: 4,
            fontFamily: "monospace",
          }}
        >
          Source: {noteTitle}
        </Text>
      </div>
    </div>
  );
};

export default QuizCardHeader;
