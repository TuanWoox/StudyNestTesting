import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Typography, Space, Dropdown, Popconfirm } from "antd";
import type { MenuProps } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MoreOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { QuizList } from "@/types/quiz/quiz";
import { formatDMY } from "@/utils/date";

const { Title, Text } = Typography;

interface QuizCardProps {
  quiz: QuizList;
  index: number;
  page: number;
  pageSize: number;
  onDelete: (quizId: string) => void;
  deletingId: string | null;
  isDeleting: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  index,
  page,
  pageSize,
  onDelete,
  deletingId,
  isDeleting,
}) => {
  const isMobile = window.innerWidth < 576;
  const isTablet = window.innerWidth < 768;

  const menuItems: MenuProps["items"] = [
    {
      key: "delete",
      label: (
        <Popconfirm
          title="Delete this quiz?"
          description="This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
            loading: deletingId === quiz.id && isDeleting,
          }}
          onConfirm={() => onDelete(quiz.id)}
        >
          <span>
            <DeleteOutlined /> Delete
          </span>
        </Popconfirm>
      ),
      danger: true,
    },
  ];

  return (
    <Card
      hoverable
      style={{
        borderRadius: isMobile ? 10 : 12,
        overflow: "hidden",
        height: "100%",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
      styles={{
        body: {
          padding: isMobile ? 16 : isTablet ? 20 : 24,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
      className="quiz-card"
    >
      {/* Card Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: isMobile ? 12 : 16,
        }}
      >
        <div
          style={{
            backgroundColor: "#1890ff",
            borderRadius: isMobile ? 6 : 8,
            padding: isMobile ? "4px 10px" : "6px 12px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Text
            strong
            style={{
              color: "#fff",
              fontSize: isMobile ? 12 : 14,
              fontWeight: 600,
            }}
          >
            #{(page - 1) * pageSize + index + 1}
          </Text>
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            size={isMobile ? "small" : "middle"}
            style={{
              marginTop: -4,
            }}
            className="quiz-more-btn"
          />
        </Dropdown>
      </div>

      {/* Quiz Title */}
      <Link to={`/user/quiz/${quiz.id}`} style={{ textDecoration: "none" }}>
        <Title
          level={isMobile ? 5 : 4}
          style={{
            margin: `0 0 ${isMobile ? 12 : 20}px 0`,
            fontSize: isMobile ? 15 : 18,
            fontWeight: 600,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: isMobile ? 42 : 50,
            color: "#262626",
            transition: "color 0.2s ease",
          }}
          className="quiz-title"
        >
          {quiz.title}
        </Title>
      </Link>

      {/* Center Icon */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "12px 0" : "16px 0",
        }}
      >
        <div
          style={{
            width: isMobile ? 60 : 80,
            height: isMobile ? 60 : 80,
            borderRadius: "50%",
            backgroundColor: "#f0f5ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileTextOutlined
            style={{
              fontSize: isMobile ? 28 : 36,
              color: "#1890ff",
            }}
          />
        </div>
      </div>

      {/* Quiz Info */}
      <div
        style={{
          backgroundColor: "#fafafa",
          borderRadius: isMobile ? 6 : 8,
          padding: isMobile ? "10px 12px" : "12px 16px",
          marginBottom: isMobile ? 12 : 16,
        }}
      >
        <Space
          direction="vertical"
          size={isMobile ? 8 : 10}
          style={{ width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 8 : 10,
            }}
          >
            <div
              style={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: isMobile ? 6 : 8,
                backgroundColor: "#e6f7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileTextOutlined
                style={{
                  color: "#1890ff",
                  fontSize: isMobile ? 14 : 16,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: isMobile ? 12 : 13,
                  color: "#8c8c8c",
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                Questions
              </Text>
              <Text
                strong
                style={{
                  fontSize: isMobile ? 14 : 16,
                  color: "#262626",
                }}
              >
                {quiz.totalQuestion}
              </Text>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 8 : 10,
            }}
          >
            <div
              style={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: isMobile ? 6 : 8,
                backgroundColor: "#f6ffed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarOutlined
                style={{
                  color: "#52c41a",
                  fontSize: isMobile ? 14 : 16,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: isMobile ? 12 : 13,
                  color: "#8c8c8c",
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                Created
              </Text>
              <Text
                strong
                style={{
                  fontSize: isMobile ? 12 : 14,
                  color: "#595959",
                }}
              >
                {formatDMY(quiz.dateCreated)}
              </Text>
            </div>
          </div>
        </Space>
      </div>

      {/* Action Buttons */}
      <Space size={isMobile ? 6 : 8} style={{ width: "100%" }}>
        <Link to={`/user/quiz/${quiz.id}`} style={{ flex: 1 }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size={isMobile ? "middle" : "large"}
            style={{
              width: "100%",
              borderRadius: isMobile ? 6 : 8,
              height: isMobile ? 36 : 40,
              fontWeight: 500,
              fontSize: isMobile ? 13 : 14,
            }}
            className="quiz-view-btn"
          >
            View
          </Button>
        </Link>
        <Link to={`/user/quizAttempt/${quiz.id}`} style={{ flex: 1 }}>
          <Button
            type="default"
            icon={<PlayCircleOutlined />}
            size={isMobile ? "middle" : "large"}
            style={{
              borderRadius: isMobile ? 6 : 8,
              height: isMobile ? 36 : 40,
              fontWeight: 500,
              fontSize: isMobile ? 13 : 14,
            }}
            className="quiz-start-btn"
          >
            Start
          </Button>
        </Link>
      </Space>
    </Card>
  );
};

export default QuizCard;
