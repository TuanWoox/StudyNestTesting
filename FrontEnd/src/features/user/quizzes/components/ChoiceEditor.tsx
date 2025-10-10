// ChoiceEditor component for editing question choices

import React from "react";
import { Input, Checkbox, Space, Typography, Radio } from "antd";
import type { Choice } from "@/types/quiz/quiz";

const { Text } = Typography;

interface ChoiceEditorProps {
  type: "MCQ" | "MSQ" | "TF";
  choices: Choice[];
  onChange: (choices: Choice[]) => void;
  disabled?: boolean;
}

export const ChoiceEditor: React.FC<ChoiceEditorProps> = ({
  type,
  choices,
  onChange,
  disabled = false,
}) => {
  const handleTextChange = (index: number, text: string) => {
    const newChoices = [...choices];
    newChoices[index] = { ...newChoices[index], text };
    onChange(newChoices);
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    const newChoices = [...choices];

    if (type === "MCQ" || type === "TF") {
      // For MCQ and TF, only one can be correct (radio behavior)
      newChoices.forEach((choice, i) => {
        newChoices[i] = {
          ...choice,
          isCorrect: i === index ? isCorrect : false,
        };
      });
    } else {
      // For MSQ, multiple can be correct (checkbox behavior)
      newChoices[index] = { ...newChoices[index], isCorrect };
    }

    onChange(newChoices);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={12}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Answer Choices</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {type === "MCQ" && "Select 1 correct answer"}
          {type === "MSQ" && "Select 2-3 correct answers"}
          {type === "TF" && "Select 1 correct answer"}
        </Text>
      </div>

      {choices.map((choice, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: choice.isCorrect ? "#f6ffed" : "#fafafa",
            borderRadius: 8,
            border: choice.isCorrect
              ? "1px solid #b7eb8f"
              : "1px solid #d9d9d9",
            transition: "all 0.2s ease",
          }}
        >
          {/* Correct indicator - Radio for MCQ/TF, Checkbox for MSQ */}
          {type === "MSQ" ? (
            <Checkbox
              checked={choice.isCorrect}
              onChange={(e) => handleCorrectChange(index, e.target.checked)}
              disabled={disabled}
              style={{ flexShrink: 0 }}
            />
          ) : (
            <Radio
              checked={choice.isCorrect}
              onChange={(e) => handleCorrectChange(index, e.target.checked)}
              disabled={disabled}
              style={{ flexShrink: 0 }}
            />
          )}

          {/* Choice text input */}
          <Input
            value={choice.text}
            onChange={(e) => handleTextChange(index, e.target.value)}
            placeholder={`Choice ${index + 1}`}
            disabled={disabled || type === "TF"} // TF text is fixed
            maxLength={200}
            showCount={!disabled && type !== "TF"}
            style={{ flex: 1 }}
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
              }}
            >
              ✓ Correct
            </Text>
          )}
        </div>
      ))}

      {/* Validation hints */}
      <div
        style={{
          marginTop: 4,
          padding: "8px 12px",
          backgroundColor: "#f0f5ff",
          borderRadius: 6,
          border: "1px solid #d6e4ff",
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          {type === "MCQ" && "✓ Exactly 4 choices, 1 correct answer required"}
          {type === "MSQ" &&
            "✓ Exactly 4 choices, at least 2 correct answers required"}
          {type === "TF" &&
            "✓ True/False choices with 1 correct answer (fixed text)"}
        </Text>
      </div>
    </Space>
  );
};
