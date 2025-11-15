import React from "react";
import { Input, Typography } from "antd";

const { TextArea } = Input;
const { Text } = Typography;

interface ExplanationInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Explanation input component
 * Optional textarea for providing explanation text
 */
export const ExplanationInput: React.FC<ExplanationInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div>
      <Text strong style={{ fontFamily: "monospace", display: "block", marginBottom: 8 }}>
        Explanation (Optional)
      </Text>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Provide an explanation for the correct answer (maximum 200 words)..."
        autoSize={{ minRows: 2, maxRows: 4 }}
        disabled={disabled}
        style={{
          fontFamily: "monospace",
        }}
      />
    </div>
  );
};
