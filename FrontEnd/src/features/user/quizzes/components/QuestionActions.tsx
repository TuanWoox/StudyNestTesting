import React from "react";
import { Button, Space, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface QuestionActionsProps {
  questionId: string;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  isDeleting: boolean;
}

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  questionId,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <Space size={isMobile ? 4 : 8}>
        <Tooltip title="Edit question" placement="top">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(questionId)}
            size={isMobile ? "small" : "middle"}
            style={{
              color: "#1890ff",
              borderRadius: 8,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            className="question-action-edit"
          >
            {!isMobile && "Edit"}
          </Button>
        </Tooltip>

        <Popconfirm
          title={
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              Delete this question?
            </span>
          }
          description={
            <span style={{ color: "#595959" }}>
              This action cannot be undone.
            </span>
          }
          onConfirm={() => onDelete(questionId)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
            loading: isDeleting,
            size: "middle",
            style: { fontWeight: 500 },
          }}
          cancelButtonProps={{
            size: "middle",
          }}
          placement="topRight"
          icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
        >
          <Tooltip title="Delete question" placement="top">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size={isMobile ? "small" : "middle"}
              style={{
                borderRadius: 8,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              className="question-action-delete"
            >
              {!isMobile && "Delete"}
            </Button>
          </Tooltip>
        </Popconfirm>
      </Space>

      <style>
        {`
          .question-action-edit:hover {
            background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%) !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25) !important;
          }
          
          .question-action-delete:hover {
            background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%) !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 77, 79, 0.25) !important;
          }
          
          @media (max-width: 767px) {
            .question-action-edit,
            .question-action-delete {
              padding: 4px 8px;
            }
          }
        `}
      </style>
    </>
  );
};
