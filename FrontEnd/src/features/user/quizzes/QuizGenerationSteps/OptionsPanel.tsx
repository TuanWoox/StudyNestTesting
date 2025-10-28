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
  theme,
} from "antd";
import { GlobalOutlined, BulbOutlined } from "@ant-design/icons";
import QuestionTypeCard from "../components/QuestionTypeCard";
import { SettingsSection } from "../components";

const { Title, Text } = Typography;
const { Option } = Select;
const { useToken } = theme;

// --- Constants and Configuration ---
const MAX_QUESTIONS = 20;
const DEFAULT_TOTAL = 10;

const LANGUAGES = [
  { value: "English", label: "🇬🇧 English" },
  { value: "Vietnamese", label: "🇻🇳 Vietnamese" },
  { value: "Chinese", label: "🇨🇳 Chinese" },
  { value: "Russian", label: "🇷🇺 Russian" },
  { value: "Japanese", label: "🇯🇵 Japanese" },
];

export function OptionsPanel({ initial, setCreateQuiz }) {
  const { token } = useToken();

  // Theme constants
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  // Question type configuration with token colors
  const QUESTION_TYPE_CONFIG = [
    {
      key: "mcq",
      title: "Multiple Choice",
      color: token.colorPrimary,
      bg: token.colorPrimaryBg,
      border: token.colorPrimaryBorder,
    },
    {
      key: "msq",
      title: "Multi-Select",
      color: token.colorInfo,
      bg: token.colorInfoBg,
      border: token.colorInfoBorder,
    },
    {
      key: "tf",
      title: "True/False",
      color: token.colorSuccess,
      bg: token.colorSuccessBg,
      border: token.colorSuccessBorder,
    },
  ];

  // Difficulty options with token colors
  const DIFFICULTY_OPTIONS = [
    {
      value: "easy",
      label: "Easy",
      desc: "Basic concepts & definitions",
      color: token.colorSuccess,
    },
    {
      value: "medium",
      label: "Medium",
      desc: "Application & analysis",
      color: token.colorWarning,
    },
    {
      value: "hard",
      label: "Hard",
      desc: "Complex problem solving",
      color: token.colorError,
    },
  ];

  const initialTotal = initial.count_Mcq + initial.count_Msq + initial.count_Tf;
  const [totalQuestions, setTotalQuestions] = useState(
    initialTotal || DEFAULT_TOTAL
  );
  const [distribution, setDistribution] = useState(() => {
    if (initialTotal === 0) return { mcq: 30, msq: 40, tf: 30 };
    return {
      mcq: (initial.count_Mcq / initialTotal) * 100,
      msq: (initial.count_Msq / initialTotal) * 100,
      tf: (initial.count_Tf / initialTotal) * 100,
    };
  });

  useEffect(() => {
    const mcqCount = Math.round((distribution.mcq / 100) * totalQuestions);
    const msqCount = Math.round((distribution.msq / 100) * totalQuestions);
    const tfCount = Math.max(0, totalQuestions - mcqCount - msqCount);
    setCreateQuiz((prev) => ({
      ...prev,
      count_Mcq: mcqCount,
      count_Msq: msqCount,
      count_Tf: tfCount,
    }));
  }, [distribution, totalQuestions, setCreateQuiz]);

  const updateDistribution = (type, value) => {
    // This complex logic remains unchanged as it's core to the functionality
    const diff = value - distribution[type];
    const otherTypes = Object.keys(distribution).filter((t) => t !== type);
    const otherTotal = otherTypes.reduce((sum, t) => sum + distribution[t], 0);
    const newDistribution = { ...distribution, [type]: value };
    if (otherTotal > 0) {
      otherTypes.forEach((t) => {
        const ratio = distribution[t] / otherTotal;
        newDistribution[t] = Math.max(0, distribution[t] - diff * ratio);
      });
    }
    const newTotal = Object.values(newDistribution).reduce(
      (sum, val) => sum + val,
      0
    );
    if (newTotal !== 100) {
      const scaleFactor = 100 / newTotal;
      Object.keys(newDistribution).forEach((k) => {
        newDistribution[k] *= scaleFactor;
      });
    }
    setDistribution(newDistribution);
  };

  const onCountChange = (type, val) => {
    const count = Math.max(0, Math.min(val ?? 0, totalQuestions));
    const percentage = (count / totalQuestions) * 100;
    updateDistribution(type, percentage);
  };

  const handleStateChange = (key, value) => {
    setCreateQuiz((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <Card>
        <Space direction="vertical" size={28} style={{ width: "100%" }}>
          <SettingsSection
            title="Number of Questions"
            subtitle="How many questions would you like?"
            icon={
              <InputNumber
                min={1}
                max={MAX_QUESTIONS}
                value={totalQuestions}
                onChange={setTotalQuestions}
                size="large"
                style={{ width: 100, fontSize: 20, fontFamily: "monospace" }}
              />
            }
          >
            <Slider
              min={1}
              max={MAX_QUESTIONS}
              value={totalQuestions}
              onChange={setTotalQuestions}
              marks={{ 1: "1", 10: "10", 20: "20" }}
            />
          </SettingsSection>

          <div>
            <Title
              level={4}
              style={{ fontFamily: "monospace", fontWeight: 700 }}
            >
              Question Types
            </Title>
            <Text
              type="secondary"
              style={{
                display: "block",
                marginBottom: 16,
                fontFamily: "monospace",
              }}
            >
              Adjust the mix of question formats
            </Text>
            <Row gutter={[16, 16]}>
              {QUESTION_TYPE_CONFIG.map((config) => (
                <Col span={24} md={8} key={config.key}>
                  <QuestionTypeCard
                    config={config}
                    count={
                      initial[
                        `count_${
                          config.key.charAt(0).toUpperCase() +
                          config.key.slice(1)
                        }`
                      ]
                    }
                    percentage={distribution[config.key]}
                    max={totalQuestions}
                    onChange={(val) => onCountChange(config.key, val)}
                  />
                </Col>
              ))}
            </Row>
          </div>

          <Divider style={{ margin: 0 }} />

          <SettingsSection icon={<GlobalOutlined />} title="Language">
            <Select
              size="large"
              style={{ width: "100%", fontFamily: "monospace" }}
              value={initial.language}
              onChange={(value) => handleStateChange("language", value)}
            >
              {LANGUAGES.map((lang) => (
                <Option key={lang.value} value={lang.value}>
                  {lang.label}
                </Option>
              ))}
            </Select>
          </SettingsSection>

          <SettingsSection icon={<BulbOutlined />} title="Difficulty Level">
            <Radio.Group
              value={initial.difficulty}
              style={{ width: "100%" }}
              onChange={(e) => handleStateChange("difficulty", e.target.value)}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <Card
                    key={opt.value}
                    size="small"
                    hoverable
                    style={{
                      cursor: "pointer",
                      borderRadius: 0,
                      border:
                        initial.difficulty === opt.value
                          ? borderColor
                          : `1px solid ${token.colorBorder}`,
                      boxShadow:
                        initial.difficulty === opt.value ? shadowColor : "none",
                    }}
                    onClick={() => handleStateChange("difficulty", opt.value)}
                  >
                    <Radio value={opt.value} style={{ width: "100%" }}>
                      <Space>
                        <div>
                          <Text strong style={{ fontFamily: "monospace" }}>
                            {opt.label}
                          </Text>
                          <div>
                            <Text
                              type="secondary"
                              style={{ fontSize: 13, fontFamily: "monospace" }}
                            >
                              {opt.desc}
                            </Text>
                          </div>
                        </div>
                      </Space>
                    </Radio>
                  </Card>
                ))}
              </Space>
            </Radio.Group>
          </SettingsSection>
        </Space>
      </Card>
    </div>
  );
}
