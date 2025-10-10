// Validation utilities matching backend validation rules

import type { Choice } from "@/types/quiz/quiz";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Count words in a string (matching backend logic)
 */
const countWords = (text: string): number => {
  if (!text || !text.trim()) return 0;
  const parts = text
    .trim()
    .split(/[\s\n\r\t]+/)
    .filter(Boolean);
  return parts.length;
};

/**
 * Validate quiz title
 */
export const validateQuizTitle = (title: string): string | null => {
  const trimmed = title.trim();

  if (!trimmed) {
    return "Title is required";
  }

  if (trimmed.length > 300) {
    return "Title must not exceed 300 characters";
  }

  return null;
};

/**
 * Validate question name
 */
export const validateQuestionName = (name: string): string | null => {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Question title is required";
  }

  if (trimmed.length > 300) {
    return "Question title must not exceed 300 characters";
  }

  return null;
};

/**
 * Validate explanation (optional field)
 */
export const validateExplanation = (explanation: string): string | null => {
  if (!explanation || !explanation.trim()) return null; // Optional field

  const wordCount = countWords(explanation);

  if (wordCount > 200) {
    return "Explanation should be concise (maximum 200 words)";
  }

  return null;
};

/**
 * Validate choice text
 */
export const validateChoiceText = (text: string): string | null => {
  const trimmed = text.trim();

  if (!trimmed) {
    return "Each choice must have text content";
  }

  if (trimmed.length > 200) {
    return "Choice text must not exceed 200 characters";
  }

  return null;
};

/**
 * Check for duplicate choices (case-insensitive)
 */
export const findDuplicateChoices = (choices: Choice[]): string[] => {
  const groups: { [key: string]: number } = {};

  choices.forEach((choice) => {
    const key = (choice.text || "").trim().toLowerCase();
    groups[key] = (groups[key] || 0) + 1;
  });

  return Object.keys(groups).filter((key) => groups[key] > 1);
};

/**
 * Validate MCQ choices
 */
const validateMcq = (choices: Choice[]): string | null => {
  if (choices.length !== 4) {
    return "MCQ must have exactly 4 choices";
  }

  const correctCount = choices.filter((c) => c.isCorrect).length;
  if (correctCount !== 1) {
    return "MCQ must have exactly 1 correct answer";
  }

  return null;
};

/**
 * Validate MSQ choices
 */
const validateMsq = (choices: Choice[]): string | null => {
  if (choices.length !== 4) {
    return "MSQ must have exactly 4 choices";
  }

  const correctCount = choices.filter((c) => c.isCorrect).length;
  if (correctCount < 2) {
    return "MSQ must have at least 2 correct answers";
  }

  return null;
};

/**
 * Validate TF choices
 */
const validateTf = (choices: Choice[]): string | null => {
  if (choices.length !== 2) {
    return "TF question must have exactly 2 choices: True and False";
  }

  const hasTrue = choices.some((c) => c.text?.trim().toLowerCase() === "true");
  const hasFalse = choices.some(
    (c) => c.text?.trim().toLowerCase() === "false"
  );

  if (!hasTrue || !hasFalse) {
    return "TF question must contain only 'True' and 'False' as choices";
  }

  const correctCount = choices.filter((c) => c.isCorrect).length;
  if (correctCount !== 1) {
    return "TF question must have exactly 1 correct answer";
  }

  return null;
};

/**
 * Validate choices by type
 */
const validateChoiceByType = (
  type: string,
  choices: Choice[]
): string | null => {
  const typeUpper = type.trim().toUpperCase();

  switch (typeUpper) {
    case "MCQ":
      return validateMcq(choices);
    case "MSQ":
      return validateMsq(choices);
    case "TF":
      return validateTf(choices);
    default:
      return "Invalid question type. Supported types: MCQ, MSQ, TF";
  }
};

/**
 * Validate complete question (matching backend ValidateQuestion)
 */
export const validateQuestion = (
  name: string,
  type: string,
  explanation: string,
  choices: Choice[]
): string | null => {
  // Validate name
  const nameError = validateQuestionName(name);
  if (nameError) return nameError;

  // Validate type
  if (!type || !type.trim()) {
    return "Question type is missing. Please select MCQ, MSQ, or TF";
  }

  // Validate each choice text
  for (const choice of choices) {
    const choiceError = validateChoiceText(choice.text);
    if (choiceError) return choiceError;
  }

  // Check for duplicates
  const duplicates = findDuplicateChoices(choices);
  if (duplicates.length > 0) {
    return `Duplicate choice texts found: ${duplicates.join(", ")}`;
  }

  // Validate choices by type
  const typeError = validateChoiceByType(type, choices);
  if (typeError) return typeError;

  // Validate explanation
  const explanationError = validateExplanation(explanation);
  if (explanationError) return explanationError;

  return null;
};

/**
 * Get default choices for a question type
 */
export const getDefaultChoices = (
  type: "MCQ" | "MSQ" | "TF",
  questionId: string = ""
): Choice[] => {
  if (type === "TF") {
    return [
      { id: "", questionId, text: "True", isCorrect: true },
      { id: "", questionId, text: "False", isCorrect: false },
    ];
  }

  // MCQ and MSQ get 4 empty choices
  return Array.from({ length: 4 }, () => ({
    id: "",
    questionId,
    text: "",
    isCorrect: false,
  }));
};

/**
 * Convert choices when changing question type
 * Preserves choice IDs to avoid backend issues
 */
export const convertChoicesForType = (
  currentChoices: Choice[],
  newType: "MCQ" | "MSQ" | "TF",
  questionId: string = ""
): Choice[] => {
  // Converting to True/False
  if (newType === "TF") {
    // Keep the first 2 choices, convert text to True/False
    // This preserves the choice IDs
    if (currentChoices.length >= 2) {
      return [
        {
          ...currentChoices[0],
          text: "True",
          isCorrect: currentChoices[0].isCorrect || true, // Default first as correct
          questionId,
        },
        {
          ...currentChoices[1],
          text: "False",
          isCorrect: currentChoices[1].isCorrect ? false : false, // Ensure only one correct
          questionId,
        },
      ];
    }
    // Fallback: create new TF choices if less than 2 exist
    return getDefaultChoices("TF", questionId);
  }

  // Converting FROM True/False to MCQ/MSQ
  const isTrueFalse =
    currentChoices.length === 2 &&
    currentChoices[0]?.text === "True" &&
    currentChoices[1]?.text === "False";

  if (isTrueFalse) {
    // We only have 2 choices, need to create 4 for MCQ/MSQ
    // Keep the existing 2 with empty text, add 2 new ones
    const newChoices: Choice[] = [
      { ...currentChoices[0], text: "", isCorrect: false, questionId },
      { ...currentChoices[1], text: "", isCorrect: false, questionId },
      { id: "", questionId, text: "", isCorrect: false },
      { id: "", questionId, text: "", isCorrect: false },
    ];
    return newChoices;
  }

  // Converting between MCQ and MSQ (already have 4 choices)
  const hasExactly4Choices = currentChoices.length === 4;

  if (!hasExactly4Choices) {
    // If not exactly 4 choices, create fresh ones
    return getDefaultChoices(newType, questionId);
  }

  // Keep the choices but adjust correctness based on new type
  const newChoices = currentChoices.map((c) => ({ ...c, questionId }));

  if (newType === "MCQ") {
    // MCQ: Only allow 1 correct answer
    // Keep the first correct answer, uncheck the rest
    let foundFirst = false;
    newChoices.forEach((choice) => {
      if (choice.isCorrect && !foundFirst) {
        foundFirst = true;
      } else if (choice.isCorrect) {
        choice.isCorrect = false;
      }
    });
  }

  // MSQ: No changes needed, it can have 0-4 correct

  return newChoices;
};
