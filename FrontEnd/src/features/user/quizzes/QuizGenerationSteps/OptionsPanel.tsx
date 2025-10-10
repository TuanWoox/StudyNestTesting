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

// Question type distribution default percentages
const DEFAULT_MCQ_PERCENT = 70;
const DEFAULT_MSQ_PERCENT = 0;
const DEFAULT_TF_PERCENT = 30;

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
  // Track the distribution of question types (percentages)
  const [distribution, setDistribution] = useState(() => {
    const total = initial.count_Mcq + initial.count_Msq + initial.count_Tf;
    if (total === 0) {
      return {
        mcq: DEFAULT_MCQ_PERCENT,
        msq: DEFAULT_MSQ_PERCENT,
        tf: DEFAULT_TF_PERCENT,
      };
    }
    return {
      mcq: (initial.count_Mcq / total) * 100,
      msq: (initial.count_Msq / total) * 100,
      tf: (initial.count_Tf / total) * 100,
    };
  });

  // Track the total number of questions
  const [totalQuestions, setTotalQuestions] = useState(
    initial.count_Mcq + initial.count_Msq + initial.count_Tf || DEFAULT_TOTAL
  );

  // Update question counts when distribution or total changes
  useEffect(() => {
    // Calculate counts ensuring they add up to exactly totalQuestions
    const mcqCount = Math.round((distribution.mcq / 100) * totalQuestions);
    const msqCount = Math.round((distribution.msq / 100) * totalQuestions);
    let tfCount = totalQuestions - mcqCount - msqCount;

    // Ensure counts are non-negative
    tfCount = Math.max(0, tfCount);

    setCreateQuiz((prev) => ({
      ...prev,
      count_Mcq: mcqCount,
      count_Msq: msqCount,
      count_Tf: tfCount,
    }));
  }, [distribution, totalQuestions, setCreateQuiz]);

  // Handle distribution slider changes
  const updateDistribution = (type: "mcq" | "msq" | "tf", value: number) => {
    // Calculate the adjustment needed for other types
    const diff = value - distribution[type];

    // Calculate how much to adjust other types proportionally
    const otherTypes = ["mcq", "msq", "tf"].filter((t) => t !== type) as Array<
      "mcq" | "msq" | "tf"
    >;
    const otherTotal = otherTypes.reduce((sum, t) => sum + distribution[t], 0);

    const newDistribution = { ...distribution, [type]: value };

    if (otherTotal > 0) {
      // Adjust other types proportionally
      otherTypes.forEach((t) => {
        const ratio = distribution[t] / otherTotal;
        newDistribution[t] = Math.max(0, distribution[t] - diff * ratio);
      });
    }

    // Normalize to ensure total is exactly 100%
    const newTotal = Object.values(newDistribution).reduce(
      (sum, val) => sum + val,
      0
    );
    if (newTotal !== 100) {
      const scaleFactor = 100 / newTotal;
      Object.keys(newDistribution).forEach((k) => {
        newDistribution[k as "mcq" | "msq" | "tf"] *= scaleFactor;
      });
    }

    setDistribution(newDistribution);
  };

  // Handle total questions change
  const onTotalChange = (val: number | null) => {
    setTotalQuestions(
      Math.max(1, Math.min(val ?? DEFAULT_TOTAL, MAX_QUESTIONS))
    );
  };

  // Handle direct count changes
  const onCountChange = (type: "mcq" | "msq" | "tf", val: number | null) => {
    const count = Math.max(0, Math.min(val ?? 0, totalQuestions));

    // Calculate what percentage this count represents
    const percentage = (count / totalQuestions) * 100;

    // Update the distribution with this percentage
    updateDistribution(type, percentage);
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

          <Card
            bordered={false}
            style={{
              background: "#fafafa",
              padding: "8px 0",
              marginBottom: 16,
              borderRadius: 8,
            }}
          >
            <Row gutter={[0, 16]} align="middle">
              <Col span={24}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Multiple Choice (MCQ):</Text>
                  <Text>
                    {Math.round(distribution.mcq)}% - {initial.count_Mcq}{" "}
                    questions
                  </Text>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={distribution.mcq}
                  onChange={(value) => updateDistribution("mcq", value)}
                  tooltip={{
                    formatter: (value) => `${Math.round(value || 0)}% MCQ`,
                  }}
                  trackStyle={{ backgroundColor: "#1890ff" }}
                />
              </Col>

              <Col span={24}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Multi-Select (MSQ):</Text>
                  <Text>
                    {Math.round(distribution.msq)}% - {initial.count_Msq}{" "}
                    questions
                  </Text>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={distribution.msq}
                  onChange={(value) => updateDistribution("msq", value)}
                  tooltip={{
                    formatter: (value) => `${Math.round(value || 0)}% MSQ`,
                  }}
                  trackStyle={{ backgroundColor: "#722ed1" }}
                />
              </Col>

              <Col span={24}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>True/False (T/F):</Text>
                  <Text>
                    {Math.round(distribution.tf)}% - {initial.count_Tf}{" "}
                    questions
                  </Text>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={distribution.tf}
                  onChange={(value) => updateDistribution("tf", value)}
                  tooltip={{
                    formatter: (value) => `${Math.round(value || 0)}% T/F`,
                  }}
                  trackStyle={{ backgroundColor: "#52c41a" }}
                />
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Card
                size="small"
                bordered
                hoverable
                style={{ textAlign: "center" }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {initial.count_Mcq}
                  </div>
                  <div>Multiple Choice</div>
                  <div>
                    <InputNumber
                      min={0}
                      max={totalQuestions}
                      value={initial.count_Mcq}
                      onChange={(val) => onCountChange("mcq", val)}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={24} md={8}>
              <Card
                size="small"
                bordered
                hoverable
                style={{ textAlign: "center" }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#722ed1",
                    }}
                  >
                    {initial.count_Msq}
                  </div>
                  <div>Multi-Select</div>
                  <div>
                    <InputNumber
                      min={0}
                      max={totalQuestions}
                      value={initial.count_Msq}
                      onChange={(val) => onCountChange("msq", val)}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={24} md={8}>
              <Card
                size="small"
                bordered
                hoverable
                style={{ textAlign: "center" }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {initial.count_Tf}
                  </div>
                  <div>True/False</div>
                  <div>
                    <InputNumber
                      min={0}
                      max={totalQuestions}
                      value={initial.count_Tf}
                      onChange={(val) => onCountChange("tf", val)}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </div>
              </Card>
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
            borderRadius: 8,
          }}
        >
          <Space direction="vertical">
            <Text strong>
              Total questions:{" "}
              {initial.count_Mcq + initial.count_Msq + initial.count_Tf}
            </Text>
            <Text type="secondary">
              {initial.count_Mcq} MCQs + {initial.count_Msq} MSQs +{" "}
              {initial.count_Tf} T/Fs
            </Text>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}
