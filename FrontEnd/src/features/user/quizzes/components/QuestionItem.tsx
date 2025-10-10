import React, { useEffect } from "react";
import { Flex, Space, Badge, Typography, Tag, Card, Divider } from "antd";
import { QuestionCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import type { Question } from "@/types/quiz/quiz";
import { QuestionActions } from "./QuestionActions";
import { ChoiceList } from "./ChoiceList";

const { Text, Paragraph } = Typography;

interface QuestionItemProps {
  question: Question;
  index: number;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  isDeleting: boolean;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  // Add custom animations on mount
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      .question-item-card {
        animation: fadeInUp 0.4s ease-out;
        animation-fill-mode: both;
        animation-delay: ${index * 0.01}s;
      }
      
      .question-badge {
        animation: pulse 0.6s ease-in-out;
      }
      
      @media (min-width: 768px) {
        .question-item-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
          transform: translateY(-4px);
          border-color: #1890ff !important;
        }
        
        .question-item-card:hover .question-badge {
          transform: scale(1.1);
        }
      }
      
      @media (max-width: 767px) {
        .question-item-card {
          margin-bottom: 12px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      try {
        document.head.removeChild(style);
      } catch (e) {
        // Style already removed
      }
    };
  }, [index]);

  const getQuestionTypeInfo = (type: string) => {
    switch (type) {
      case "MCQ":
        return {
          color: "blue",
          label: "Multiple Choice",
          bgColor: "#1890ff",
          lightBg: "#e6f7ff",
          icon: "📝",
        };
      case "MSQ":
        return {
          color: "purple",
          label: "Multi-Select",
          bgColor: "#722ed1",
          lightBg: "#f9f0ff",
          icon: "☑️",
        };
      case "TF":
        return {
          color: "green",
          label: "True/False",
          bgColor: "#52c41a",
          lightBg: "#f6ffed",
          icon: "✓✗",
        };
      default:
        return {
          color: "default",
          label: type,
          bgColor: "#8c8c8c",
          lightBg: "#fafafa",
          icon: "❓",
        };
    }
  };

  const typeInfo = getQuestionTypeInfo(question.type);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Card
      style={{
        marginBottom: isMobile ? 12 : 20,
        borderRadius: isMobile ? 10 : 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
      }}
      bodyStyle={{
        padding: isMobile ? 16 : 24,
      }}
      hoverable
      className="question-item-card"
    >
      {/* Decorative Top Border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${typeInfo.bgColor}, ${typeInfo.lightBg})`,
        }}
      />

      {/* Question Header */}
      <Flex
        justify="space-between"
        align="flex-start"
        wrap="wrap"
        gap={isMobile ? 8 : 12}
        style={{ marginTop: 4 }}
      >
        <Flex
          align="flex-start"
          gap={isMobile ? 8 : 12}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Badge
            count={index + 1}
            style={{
              backgroundColor: typeInfo.bgColor,
              boxShadow: `0 4px 12px ${typeInfo.bgColor}40`,
              fontSize: isMobile ? 13 : 15,
              fontWeight: 700,
              minWidth: isMobile ? 26 : 32,
              height: isMobile ? 26 : 32,
              lineHeight: isMobile ? "26px" : "32px",
              borderRadius: isMobile ? 13 : 16,
              border: "2px solid #fff",
            }}
            className="question-badge"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              strong
              style={{
                fontSize: isMobile ? 15 : 17,
                display: "block",
                marginBottom: isMobile ? 8 : 10,
                lineHeight: 1.5,
                wordBreak: "break-word",
                color: "#262626",
                fontWeight: 600,
              }}
            >
              {question.name}
            </Text>
            <Space size={isMobile ? 6 : 8} wrap>
              <Tag
                color={typeInfo.color}
                style={{
                  padding: isMobile ? "2px 10px" : "4px 14px",
                  fontWeight: 500,
                  borderRadius: 8,
                  fontSize: isMobile ? 12 : 13,
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: `0 2px 8px ${typeInfo.bgColor}20`,
                }}
              >
                <span style={{ fontSize: isMobile ? 12 : 14 }}>
                  {typeInfo.icon}
                </span>
                {typeInfo.label}
              </Tag>
              <Tag
                style={{
                  padding: isMobile ? "2px 10px" : "4px 14px",
                  borderRadius: 8,
                  fontSize: isMobile ? 11 : 12,
                  color: "#595959",
                  background: "#f5f5f5",
                  border: "none",
                }}
              >
                {question.choices?.length || 0} choices
              </Tag>
            </Space>
          </div>
        </Flex>

        <QuestionActions
          questionId={question.id}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </Flex>

      {/* Divider */}
      <Divider
        style={{
          margin: isMobile ? "16px 0" : "20px 0",
          borderColor: "#f0f0f0",
        }}
      />

      {/* Choices */}
      <div
        style={{
          marginBottom: question.explanation ? (isMobile ? 16 : 20) : 0,
        }}
      >
        <ChoiceList type={question.type} choices={question.choices || []} />
      </div>

      {/* Explanation */}
      {question.explanation && (
        <Card
          size="small"
          style={{
            marginTop: 0,
            background: `linear-gradient(135deg, ${typeInfo.lightBg} 0%, #ffffff 100%)`,
            borderLeft: `4px solid ${typeInfo.bgColor}`,
            boxShadow: `0 2px 8px ${typeInfo.bgColor}15`,
            borderRadius: isMobile ? 8 : 10,
            border: `1px solid ${typeInfo.bgColor}30`,
          }}
          bodyStyle={{
            padding: isMobile ? "12px 14px" : "14px 18px",
          }}
        >
          <Space
            direction="vertical"
            size={isMobile ? 6 : 8}
            style={{ width: "100%" }}
          >
            <Space size={8}>
              <CheckCircleFilled
                style={{
                  color: typeInfo.bgColor,
                  fontSize: isMobile ? 15 : 17,
                }}
              />
              <Text
                strong
                style={{
                  color: typeInfo.bgColor,
                  fontSize: isMobile ? 13 : 14,
                  fontWeight: 600,
                }}
              >
                💡 Explanation
              </Text>
            </Space>
            <Paragraph
              style={{
                margin: 0,
                lineHeight: 1.7,
                fontSize: isMobile ? 13 : 14,
                color: "#595959",
                paddingLeft: isMobile ? 0 : 25,
              }}
            >
              {question.explanation}
            </Paragraph>
          </Space>
        </Card>
      )}
    </Card>
  );
};
