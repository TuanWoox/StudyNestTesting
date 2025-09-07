import React, { useMemo, useState } from "react";
import { Steps, Card, Flex, Typography, Button, Form } from "antd";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  FileOutlined,
  SettingOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { SourcePanel } from "./QuizGenerationSteps/SourcePanel";
import { OptionsPanel } from "./QuizGenerationSteps/OptionsPanel";
import { ReviewPanel } from "./QuizGenerationSteps/ReviewPanel";

import { notes } from "./NoteDummyData";
import type { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import useGenerateQuiz from "@/hooks/quizHook/useGenerateQuiz";

const { Title } = Typography;

const QuizGeneration: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const { generateQuiz, isLoading } = useGenerateQuiz({
    onSuccess: () => {
      // Additional success handling if needed
      console.log("Quiz generated successfully!");
    },
  });
  // Quiz options state
  const [createQuiz, setCreateQuiz] = useState<CreateQuizDTO>({
    note: "",
    count_Mcq: 10,
    count_Tf: 10,
    difficulty: "easy",
  });

  // Selection & search state
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>(
    notes[0]?.id
  );
  const [query, setQuery] = useState("");

  // Derived data
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const inTitle = n.title.toLowerCase().includes(q);
      const inTags = n.tags?.some((t) => t.toLowerCase().includes(q));
      return inTitle || inTags;
    });
  }, [query]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId),
    [selectedNoteId]
  );

  // Navigation
  const next = async () => {
    if (current === 0) {
      // Ensure a note is selected
      await form.validateFields(); // validates hidden noteId
      // Persist selected note text into createQuiz.note
      setCreateQuiz((prev) => ({
        ...prev,
        note: selectedNote?.content ?? selectedNote?.excerpt ?? "",
      }));
    }
    setCurrent((c) => Math.min(c + 1, 2));
  };

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleGenerateQuiz = () => {
    generateQuiz(createQuiz);
    console.log(createQuiz);
  };

  const steps = [
    {
      title: "Source",
      icon: <FileOutlined />,
      content: (
        <SourcePanel
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          query={query}
          form={form}
          setQuery={setQuery}
          setSelectedNoteId={setSelectedNoteId}
        />
      ),
    },
    {
      title: "Options",
      icon: <SettingOutlined />,
      content: (
        <OptionsPanel initial={createQuiz} setCreateQuiz={setCreateQuiz} />
      ),
    },
    {
      title: "Review",
      icon: <EyeOutlined />,
      content: (
        <ReviewPanel selectedNote={selectedNote} quizOptions={createQuiz} />
      ),
    },
  ];

  return (
    <Card
      style={{
        width: "100%",
        height: "85vh",
        overflow: "auto",
        margin: "0 auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{
        padding: 32,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title level={3} style={{ marginBottom: 24 }}>
        Quiz Generation
      </Title>

      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 24,
        }}
      >
        {steps[current].content}
      </div>

      <Flex justify="space-between">
        <Link to="/user/quiz">
          <Button icon={<ArrowLeftOutlined />} disabled={isLoading}>
            Back to Quizzes
          </Button>
        </Link>
        <div>
          {current > 0 && (
            <Button
              style={{ marginRight: 8 }}
              onClick={prev}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next} disabled={isLoading}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={handleGenerateQuiz}
              loading={isLoading}
              icon={isLoading ? <LoadingOutlined /> : undefined}
            >
              {isLoading ? "Generating Quiz..." : "Generate Quiz"}
            </Button>
          )}
        </div>
      </Flex>
    </Card>
  );
};

export default QuizGeneration;
