// QuestionForm component for creating/editing questions

import React, { useState, useEffect, useRef } from "react";
import { Form, Card, message, Upload, Button, Image } from "antd";
import { PictureOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import type { Question, Choice } from "@/types/quiz/quiz";
import { ChoiceEditor } from "./ChoiceEditor";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { QuestionTextInput } from "./QuestionTextInput";
import { ExplanationInput } from "./ExplanationInput";
import { FormActions } from "./FormActions";
import { QuestionFormValidation } from "./QuestionFormValidation";
import useUploadQuestionImage from "@/hooks/imageHook/useUploadQuestionImage";
import {
  validateQuestion,
  getDefaultChoices,
  convertChoicesForType,
} from "@/utils/validation";

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
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState<"MCQ" | "MSQ" | "TF">(
    question?.type || "MCQ"
  );
  const [choices, setChoices] = useState<Choice[]>(
    question?.choices || getDefaultChoices("MCQ", question?.id || "")
  );

  const [imageUrl, setImageUrl] = useState<string | null>(question?.imageUrl ?? "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadQuestionImage();

  // Store original choices when converting to TF to allow reverting back
  const [originalChoicesBeforeTF, setOriginalChoicesBeforeTF] = useState<
    Choice[] | null
  >(null);

  // Show real-time validation after first interaction
  const [showValidation, setShowValidation] = useState(false);

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

  const handleTypeChange = (newType: "MCQ" | "MSQ" | "TF") => {
    setQuestionType(newType);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setUploadedFile(file);
      onDirtyChange(true);
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setUploadedFile(null);
    onDirtyChange(true);
  };

  const handleRestoreImage = () => {
    if (question?.imageUrl) {
      setImageUrl(question.imageUrl);
      setUploadedFile(null);
      onDirtyChange(true);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();

      // Get values
      const name = values.name?.trim() || "";
      const explanation = values.explanation?.trim() || "";

      // Validate using backend-matching validation (QuestionBusiness.ValidateQuestion)
      const validationError = validateQuestion(
        name,
        questionType,
        explanation,
        choices,
        !!question, // isUpdate
        question?.id // questionId for update validation
      );

      if (validationError) {
        message.error(validationError);
        return;
      }

      // Upload image if new file exists
      let imageUrlToSave: string | undefined = undefined;
      if (uploadedFile) {
        try {
          const uploadResult = await uploadImage(uploadedFile);
          if (uploadResult.success === 1 && uploadResult.file) {
            imageUrlToSave = uploadResult.file.url;
          } else {
            message.error("Failed to upload image");
            return;
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          message.error("Failed to upload image");
          return;
        }
      } else if (imageUrl && !uploadedFile) {
        // Keep existing image URL if no new file uploaded
        imageUrlToSave = imageUrl;
      }
      // If imageUrl is null and no uploadedFile, imageUrlToSave remains undefined (image removed)

      // Create question object
      const questionData: Partial<Question> = {
        id: question?.id,
        name,
        type: questionType,
        explanation,
        choices,
        imageUrl: imageUrlToSave,
      };

      // Call save handler
      await onSave(questionData);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

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
        onChange={() => setShowValidation(true)}
      >
        {/* Real-time Validation Feedback */}
        <QuestionFormValidation
          name={form.getFieldValue("name") || ""}
          type={questionType}
          explanation={form.getFieldValue("explanation") || ""}
          choices={choices}
          isUpdate={!!question}
          questionId={question?.id}
          showValidation={showValidation}
        />

        {/* Question Name */}
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Please enter question text" },
            {
              max: 300,
              message: "Question text must not exceed 300 characters",
            },
          ]}
        >
          <QuestionTextInput
            value={form.getFieldValue("name") || ""}
            onChange={(value) => form.setFieldValue("name", value)}
            disabled={isLoading}
          />
        </Form.Item>

        {/* Question Type */}
        <Form.Item name="type">
          <QuestionTypeSelector
            value={questionType}
            onChange={handleTypeChange}
            disabled={isLoading}
          />
        </Form.Item>

        {/* Image Upload Section */}
        <Form.Item label="Question Image (Optional)">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: imageUrl ? "auto" : 200,
              border: "2px dashed #d9d9d9",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fafafa",
            }}
          >
            {imageUrl ? (
              <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
                <Image
                  src={imageUrl}
                  alt="Question image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 500,
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveImage}
                  size="large"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <Upload
                  accept="image/*"
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                  disabled={isLoading || isUploading}
                >
                  <Button
                    disabled={isLoading || isUploading}
                    size="large"
                    type="dashed"
                    style={{ height: 100, width: 200 }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <PictureOutlined style={{ fontSize: 24 }} />
                      <span>Upload Image</span>
                    </div>
                  </Button>
                </Upload>

                {question?.imageUrl && (
                  <Button
                    icon={<UndoOutlined />}
                    onClick={handleRestoreImage}
                    disabled={isLoading || isUploading}
                    type="default"
                  >
                    Restore Original Image
                  </Button>
                )}
              </div>
            )}
          </div>
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
        <Form.Item name="explanation">
          <ExplanationInput
            value={form.getFieldValue("explanation") || ""}
            onChange={(value) => form.setFieldValue("explanation", value)}
            disabled={isLoading}
          />
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0 }}>
          <FormActions
            onSave={handleSubmit}
            onCancel={onCancel}
            isLoading={isLoading || isUploading}
            isEditing={!!question}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};
