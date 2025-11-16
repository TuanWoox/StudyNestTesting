import React from "react";
import { Typography, theme } from "antd";

const { Text } = Typography;
const { useToken } = theme;

interface ChoiceValidationHintProps {
  type: "MCQ" | "MSQ" | "TF";
}

/**
 * Display validation requirements for choice editor based on question type
 */
export const ChoiceValidationHint: React.FC<ChoiceValidationHintProps> = ({
  type,
}) => {
  const { token } = useToken();

  const getHintText = () => {
    switch (type) {
      case "MCQ":
        return "✓ Exactly 4 choices, 1 correct answer required";
      case "MSQ":
        return "✓ Exactly 4 choices, at least 2 correct answers required";
      case "TF":
        return "✓ True/False choices with 1 correct answer (fixed text)";
      default:
        return "";
    }
  };

  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  return (
    <div
      style={{
        marginTop: 4,
        padding: "8px 12px",
        backgroundColor: token.colorInfoBg,
        borderRadius: 0,
        border: borderColor,
        boxShadow: shadowColor,
      }}
    >
      <Text type="secondary" style={{ fontSize: 12, fontFamily: "monospace" }}>
        {getHintText()}
      </Text>
    </div>
  );
};
