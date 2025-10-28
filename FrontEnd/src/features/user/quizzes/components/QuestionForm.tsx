// QuestionForm component for creating/editing questions

import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  message,
  Typography,
  theme,
} from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import type { Question, Choice } from "@/types/quiz/quiz";
import { ChoiceEditor } from "./ChoiceEditor";
import {
  validateQuestion,
  getDefaultChoices,
  convertChoicesForType,
} from "../utils/validation";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const { useToken } = theme;

interface QuestionFormProps {
  question?: Question; // If editing existing question
  quizId: string;
  onSave: (question: Partial<Question>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onDirtyChange: (isDirty: boolean) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  quizId,
  onSave,
  onCancel,
  isLoading = false,
  onDirtyChange,
}) => {
  const { token } = useToken();

  // Theme constants
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState<"MCQ" | "MSQ" | "TF">(
    question?.type || "MCQ"
  );
  const [choices, setChoices] = useState<Choice[]>(
    question?.choices || getDefaultChoices("MCQ", question?.id || "")
  );

  // Store original choices when converting to TF to allow reverting back
  const [originalChoicesBeforeTF, setOriginalChoicesBeforeTF] = useState<
    Choice[] | null
  >(null);

  // Track previous type to detect changes
  const prevTypeRef = useRef<"MCQ" | "MSQ" | "TF">(questionType);

  // Update choices when type changes - convert existing choices to new type
  useEffect(() => {
    const prevType = prevTypeRef.current;

    // If converting FROM MCQ/MSQ TO TF, save current choices
    if (
      questionType === "TF" &&
      (prevType === "MCQ" || prevType === "MSQ") &&
      choices.length === 4
    ) {
      setOriginalChoicesBeforeTF([...choices]);
    }

    // If converting FROM TF back to MCQ/MSQ, restore original choices if available
    if (
      (questionType === "MCQ" || questionType === "MSQ") &&
      prevType === "TF" &&
      originalChoicesBeforeTF
    ) {
      const restoredChoices = [...originalChoicesBeforeTF];

      if (questionType === "MCQ") {
        // Reset to only 1 correct for MCQ
        let foundFirst = false;
        restoredChoices.forEach((choice) => {
          if (choice.isCorrect && !foundFirst) {
            foundFirst = true;
          } else if (choice.isCorrect) {
            choice.isCorrect = false;
          }
        });
      }

      setChoices(restoredChoices);
      setOriginalChoicesBeforeTF(null); // Clear after restoring
      prevTypeRef.current = questionType;
      return;
    }

    // For all other conversions, use the standard conversion logic
    const newChoices = convertChoicesForType(
      choices,
      questionType,
      question?.id || ""
    );
    setChoices(newChoices);

    // Update previous type
    prevTypeRef.current = questionType;
  }, [questionType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTypeChange = (newType: "MCQ" | "MSQ" | "TF") => {
    setQuestionType(newType);
  };

  const handleSubmit = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();

      // Get values
      const name = values.name?.trim() || "";
      const explanation = values.explanation?.trim() || "";

      // Validate using backend-matching validation
      const validationError = validateQuestion(
        name,
        questionType,
        explanation,
        choices
      );

      if (validationError) {
        message.error(validationError);
        return;
      }

      // Create question object
      const questionData: Partial<Question> = {
        id: question?.id,
        name,
        type: questionType,
        explanation,
        choices,
      };

      // Call save handler
      await onSave(questionData);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [choices, questionType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card
      style={{
        border: "none",
      }}
      bodyStyle={{ padding: "12px" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: question?.name || "",
          type: question?.type || "MCQ",
          explanation: question?.explanation || "",
        }}
      >
        {/* Question Name */}
        <Form.Item
          name="name"
          label={
            <Text strong style={{ fontFamily: "monospace" }}>
              Question Text
            </Text>
          }
          rules={[
            { required: true, message: "Please enter question text" },
            {
              max: 300,
              message: "Question text must not exceed 300 characters",
            },
          ]}
        >
          <TextArea
            placeholder="Enter your question here..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={300}
            showCount
            disabled={isLoading}
            style={{
              fontFamily: "monospace",
            }}
          />
        </Form.Item>

        {/* Question Type */}
        <Form.Item
          name="type"
          label={
            <Text strong style={{ fontFamily: "monospace" }}>
              Question Type
            </Text>
          }
        >
          <Select
            value={questionType}
            onChange={handleTypeChange}
            disabled={isLoading}
            size="large"
            style={{
              fontFamily: "monospace",
            }}
          >
            <Option value="MCQ">
              <Space>
                <span>Multiple Choice (MCQ)</span>
              </Space>
            </Option>
            <Option value="MSQ">
              <Space>
                <span>Multi-Select (MSQ)</span>
              </Space>
            </Option>
            <Option value="TF">
              <Space>
                <span>True/False (TF)</span>
              </Space>
            </Option>
          </Select>
        </Form.Item>

        {/* Choices Editor */}
        <Form.Item>
          <ChoiceEditor
            type={questionType}
            choices={choices}
            onChange={setChoices}
            disabled={isLoading}
          />
        </Form.Item>

        {/* Explanation */}
        <Form.Item
          name="explanation"
          label={
            <Text strong style={{ fontFamily: "monospace" }}>
              Explanation (Optional)
            </Text>
          }
        >
          <TextArea
            placeholder="Provide an explanation for the correct answer (maximum 200 words)..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            disabled={isLoading}
            style={{
              fontFamily: "monospace",
            }}
          />
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space size="middle">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={isLoading}
              size="large"
              style={{
                fontFamily: "monospace",
                fontWeight: 600,
                borderRadius: 0,
              }}
            >
              {question ? "Update Question" : "Add Question"}
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={onCancel}
              disabled={isLoading}
              size="large"
              style={{
                fontFamily: "monospace",
                fontWeight: 600,
                borderRadius: 0,
              }}
            >
              Cancel
            </Button>
            <Text
              type="secondary"
              style={{ fontSize: 12, marginLeft: 8, fontFamily: "monospace" }}
            >
              Press <kbd>Ctrl+S</kbd> to save • <kbd>Esc</kbd> to cancel
            </Text>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
