import React from "react";
import { Radio, Space, Card, Typography, theme } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import SettingsSection from "./SettingsSection";

const { Text } = Typography;
const { useToken } = theme;

interface DifficultyOption {
  value: string;
  label: string;
  desc: string;
  color: string;
}

interface QuizDifficultySelectProps {
  value: string;
  options: DifficultyOption[];
  onChange: (value: string) => void;
}

export const QuizDifficultySelect: React.FC<QuizDifficultySelectProps> = ({
  value,
  options,
  onChange,
}) => {
  const { token } = useToken();

  // Theme constants
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  return (
    <SettingsSection icon={<BulbOutlined />} title="Difficulty Level">
      <Radio.Group value={value} style={{ width: "100%" }} onChange={(e) => onChange(e.target.value)}>
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          {options.map((opt) => (
            <Card
              key={opt.value}
              size="small"
              hoverable
              style={{
                cursor: "pointer",
                borderRadius: 0,
                border:
                  value === opt.value
                    ? borderColor
                    : `1px solid ${token.colorBorder}`,
                boxShadow: value === opt.value ? shadowColor : "none",
              }}
              onClick={() => onChange(opt.value)}
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
  );
};
