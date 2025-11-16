import React from "react";
import { Input, Checkbox, Radio, Typography, theme } from "antd";
import type { Choice } from "@/types/quiz/quiz";

const { Text } = Typography;
const { useToken } = theme;

interface ChoiceInputProps {
  choice: Choice;
  index: number;
  type: "MCQ" | "MSQ" | "TF";
  onTextChange: (index: number, text: string) => void;
  onCorrectChange: (index: number, isCorrect: boolean) => void;
  disabled?: boolean;
}

/**
 * Single choice input row with checkbox/radio and text input
 * Handles correct state and text editing for one choice
 */
export const ChoiceInput: React.FC<ChoiceInputProps> = ({
  choice,
  index,
  type,
  onTextChange,
  onCorrectChange,
  disabled = false,
}) => {
  const { token } = useToken();

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 16px",
        backgroundColor: choice.isCorrect
          ? token.colorSuccessBg
          : token.colorFillAlter,
        borderRadius: 0,
        border: choice.isCorrect
          ? `2px solid ${token.colorSuccess}`
          : `1px solid ${token.colorBorder}`,
        boxShadow: choice.isCorrect
          ? `4px 4px 0px ${token.colorSuccess}55`
          : "none",
        borderLeft: choice.isCorrect
          ? `4px solid ${token.colorSuccess}`
          : `4px solid ${token.colorFillSecondary}`,
      }}
    >
      {/* Correct indicator - Radio for MCQ/TF, Checkbox for MSQ */}
      {type === "MSQ" ? (
        <Checkbox
          checked={choice.isCorrect}
          onChange={(e) => onCorrectChange(index, e.target.checked)}
          disabled={disabled}
          style={{ flexShrink: 0 }}
        />
      ) : (
        <Radio
          checked={choice.isCorrect}
          onChange={(e) => onCorrectChange(index, e.target.checked)}
          disabled={disabled}
          style={{ flexShrink: 0 }}
        />
      )}

      {/* Choice text input */}
      <Input
        value={choice.text}
        onChange={(e) => onTextChange(index, e.target.value)}
        placeholder={`Choice ${index + 1}`}
        disabled={disabled || type === "TF"} // TF text is fixed
        maxLength={200}
        showCount={!disabled && type !== "TF"}
        style={{ flex: 1, fontFamily: "monospace" }}
        status={!choice.text.trim() ? "error" : undefined}
      />

      {/* Correct label */}
      {choice.isCorrect && (
        <Text
          type="success"
          style={{
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
            minWidth: 60,
            textAlign: "right",
            fontFamily: "monospace",
          }}
        >
          ✓ Correct
        </Text>
      )}
    </div>
  );
};
