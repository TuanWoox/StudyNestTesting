import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  InputNumber,
  Radio,
  Slider,
  Divider,
  Select,
} from "antd";
import type { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import { SettingOutlined, GlobalOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const MAX_QUESTIONS = 20; // Maximum allowed questions
const DEFAULT_TOTAL = 10; // Default total questions

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Chinese", label: "Chinese" },
  { value: "Russian", label: "Russian" },
  { value: "Japanese", label: "Japanese" },
];

export function OptionsPanel({
  initial,
  setCreateQuiz,
}: {
  initial: CreateQuizDTO;
  setCreateQuiz: React.Dispatch<React.SetStateAction<CreateQuizDTO>>;
}) {
  // Track the ratio between MCQ and TF questions (0-100%)
  const [mcqRatio, setMcqRatio] = useState(() => {
    const total = initial.count_Mcq + initial.count_Tf;
    return total > 0 ? (initial.count_Mcq / total) * 100 : 50;
  });

  // Track the total number of questions
  const [totalQuestions, setTotalQuestions] = useState(
    initial.count_Mcq + initial.count_Tf || DEFAULT_TOTAL
  );

  // Update question counts when ratio or total changes
  useEffect(() => {
    const mcqCount = Math.round((mcqRatio / 100) * totalQuestions);
    const tfCount = totalQuestions - mcqCount;

    setCreateQuiz((prev) => ({
      ...prev,
      count_Mcq: mcqCount,
      count_Tf: tfCount,
    }));
  }, [mcqRatio, totalQuestions, setCreateQuiz]);

  // Handle ratio slider change
  const onRatioChange = (newRatio: number) => {
    setMcqRatio(newRatio);
  };

  // Handle total questions change
  const onTotalChange = (val: number | null) => {
    setTotalQuestions(
      Math.max(1, Math.min(val ?? DEFAULT_TOTAL, MAX_QUESTIONS))
    );
  };

  // Handle direct MCQ count change
  const onMcqChange = (val: number | null) => {
    const mcqCount = Math.max(0, Math.min(val ?? 0, totalQuestions));
    setMcqRatio((mcqCount / totalQuestions) * 100);
  };

  // Handle direct TF count change
  const onTfChange = (val: number | null) => {
    const tfCount = Math.max(0, Math.min(val ?? 0, totalQuestions));
    const mcqCount = totalQuestions - tfCount;
    setMcqRatio((mcqCount / totalQuestions) * 100);
  };

  // Handle difficulty change
  const onDiffChange = (e: any) =>
    setCreateQuiz((prev) => ({
      ...prev,
      difficulty: e.target.value as CreateQuizDTO["difficulty"],
    }));

  // Handle language change
  const onLanguageChange = (value: string) => {
    setCreateQuiz((prev) => ({
      ...prev,
      language: value,
    }));
  };

  return (
    <Card
      style={{ borderRadius: 16 }}
      bodyStyle={{ padding: 20 }}
      title={
        <Space>
          <SettingOutlined />
          <span>Quiz Options</span>
        </Space>
      }
    >
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Total Questions
          </Title>
          <Row align="middle">
            <Col flex="auto">
              <Text>How many questions do you want in total?</Text>
            </Col>
            <Col>
              <InputNumber
                min={1}
                max={MAX_QUESTIONS}
                value={totalQuestions}
                onChange={onTotalChange}
                style={{ width: 80 }}
              />
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Question Distribution
          </Title>

          <Row align="middle" gutter={[0, 16]}>
            <Col span={24}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>MCQ vs True/False ratio:</Text>
                <Row style={{ width: "100%" }}>
                  <Col flex="100px">
                    <Text style={{ textAlign: "center", display: "block" }}>
                      MCQ: {initial.count_Mcq}
                    </Text>
                  </Col>
                  <Col flex="auto">
                    <Slider
                      min={0}
                      max={100}
                      value={mcqRatio}
                      onChange={onRatioChange}
                      tooltip={{ formatter: (value) => `${value}% MCQ` }}
                    />
                  </Col>
                  <Col flex="100px">
                    <Text style={{ textAlign: "center", display: "block" }}>
                      T/F: {initial.count_Tf}
                    </Text>
                  </Col>
                </Row>
              </Space>
            </Col>

            <Col span={24}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Row align="middle" gutter={12}>
                  <Col flex="none" style={{ minWidth: 220 }}>
                    <Text>Multiple Choice Questions</Text>
                  </Col>
                  <Col flex="auto" />
                  <Col>
                    <InputNumber
                      min={0}
                      max={totalQuestions}
                      value={initial.count_Mcq}
                      onChange={onMcqChange}
                    />
                  </Col>
                </Row>

                <Row align="middle" gutter={12}>
                  <Col flex="none" style={{ minWidth: 220 }}>
                    <Text>True / False Questions</Text>
                  </Col>
                  <Col flex="auto" />
                  <Col>
                    <InputNumber
                      min={0}
                      max={totalQuestions}
                      value={initial.count_Tf}
                      onChange={onTfChange}
                    />
                  </Col>
                </Row>
              </Space>
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Language
          </Title>
          <Row align="middle">
            <Col flex="none" style={{ marginRight: 8 }}>
              <GlobalOutlined />
            </Col>
            <Col flex="auto">
              <Select
                style={{ width: "100%" }}
                value={initial.language}
                onChange={onLanguageChange}
              >
                {LANGUAGES.map((lang) => (
                  <Option key={lang.value} value={lang.value}>
                    {lang.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
            Select the language for your quiz questions and answers
          </Text>
        </div>

        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Difficulty Level
          </Title>
          <Radio.Group value={initial.difficulty} onChange={onDiffChange}>
            <Space direction="vertical">
              <Radio value="easy">Easy — Basic concepts & definitions</Radio>
              <Radio value="medium">Medium — Application & analysis</Radio>
              <Radio value="hard">Hard — Complex problem solving</Radio>
            </Space>
          </Radio.Group>
        </div>

        <Card
          size="small"
          style={{
            backgroundColor: "#f0f7ff",
            border: "1px solid #bae0ff",
          }}
        >
          <Text strong>
            Total questions: {initial.count_Mcq + initial.count_Tf}
          </Text>
        </Card>
      </Space>
    </Card>
  );
}
