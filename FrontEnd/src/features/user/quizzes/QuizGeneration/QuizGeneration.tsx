import React, { useState, useEffect } from "react";
import { Card, Form, theme } from "antd";
import {
  FileOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { SourcePanel } from "./QuizGenerationSteps/SourcePanel";
import { OptionsPanel } from "./QuizGenerationSteps/OptionsPanel";
import { ReviewPanel } from "./QuizGenerationSteps/ReviewPanel";
import {
  QuizGenerationHeader,
  QuizGenerationStepsNav,
  QuizGenerationActions,
} from "./components";

import type { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import useGenerateQuiz from "@/hooks/quizHook/useGenerateQuiz";
import useGetAllNote from "@/hooks/noteHook/useGetAllNote";
import { useCollapsibleHeader } from "@/hooks/common/useCollapsibleHeader";

const { useToken } = theme;

const QuizGeneration: React.FC = () => {
  const { token } = useToken();

  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { generateQuiz, isLoading } = useGenerateQuiz();

  // Collapsible header hook
  const { isHeaderCollapsed, scrollContainerRef, headerRef } =
    useCollapsibleHeader({
      dependencies: [current, isMobile],
      scrollThreshold: 5,
      collapseThreshold: 100,
    });

  // Quiz options state
  const [createQuiz, setCreateQuiz] = useState<CreateQuizDTO>({
    noteId: "",
    noteContent: "",
    count_Mcq: 3,
    count_Tf: 3,
    count_Msq: 4,
    language: "English",
    difficulty: "easy",
  });

  // Selection & search state
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [query, setQuery] = useState("");

  // Get notes data for selected note
  const { data: notesData } = useGetAllNote();

  const selectedNote = notesData?.data?.find(
    (note) => note.id === selectedNoteId
  );

  // Navigation
  const next = async () => {
    if (current === 0) {
      // Ensure a note is selected
      await form.validateFields(); // validates hidden noteId

      // Persist selected note ID and content into createQuiz
      setCreateQuiz((prev) => ({
        ...prev,
        noteId: selectedNoteId || "",
        noteContent: selectedNote?.content ?? "",
      }));
    }
    setCurrent((c) => Math.min(c + 1, 2));
  };

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleGenerateQuiz = () => {
    generateQuiz(createQuiz);
  };

  const steps = [
    {
      title: "Source",
      icon: <FileOutlined />,
      content: (
        <SourcePanel
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
    <div
      ref={scrollContainerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        position: "relative",
        backgroundColor: token.colorBgLayout,
      }}
    >
      {/* Sticky Header Overlay */}
      <div
        ref={headerRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          transform: isHeaderCollapsed ? `translateY(-100%)` : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: token.colorBgContainer,
          willChange: "transform",
        }}
      >
        <div
          style={{
            padding: isMobile ? 16 : 32,
          }}
        >
          <QuizGenerationHeader isLoading={isLoading} isMobile={isMobile} />

          <QuizGenerationStepsNav current={current} isLoading={isLoading} />
        </div>
      </div>

      {/* Main Content */}
      <div>
        <Card
          style={{
            width: "100%",
            margin: "0 auto",
          }}
          bodyStyle={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 200px)",
          }}
          className="quiz-generation-card"
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: 0,
            }}
            className="quiz-generation-content"
          >
            <div style={{ margin: "0 auto" }}>{steps[current].content}</div>
          </div>

          <QuizGenerationActions
            current={current}
            totalSteps={steps.length}
            isLoading={isLoading}
            isMobile={isMobile}
            onPrev={prev}
            onNext={next}
            onGenerate={handleGenerateQuiz}
          />
        </Card>
      </div>
    </div>
  );
};

export default QuizGeneration;
