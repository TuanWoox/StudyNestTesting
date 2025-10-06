import React from "react";
import { Button, Popconfirm } from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";

interface ActionButtonsProps {
    onSave: () => void;
    onDelete: () => void;
    darkMode: boolean;
    isCreating?: boolean
    isDeleting?: boolean;
    isUpdating?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    onSave,
    onDelete,
    darkMode,
    isCreating = false,
    isDeleting = false,
    isUpdating = false
}) => {
    const commonStyle = {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: 600,
        transition: "all 0.3s ease",
        boxShadow: darkMode ? "0 2px 6px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.1)",
    } as React.CSSProperties;

    return (
        <div className="flex gap-3 m-auto">
            <Button
                type="text"
                onClick={onSave}
                className={`${darkMode ? "dark" : "light"}`}
                style={{
                    ...commonStyle,
                    border: `1px solid ${darkMode ? "#3F3F46" : "#E5E7EB"}`,
                    background: darkMode ? "#27272A" : "#FFFFFF",
                    color: darkMode ? "#10B981" : "#059669",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? "#1F2937" : "#F0FDF4";
                    e.currentTarget.style.color = darkMode ? "#34D399" : "#047857";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = darkMode ? "#27272A" : "#FFFFFF";
                    e.currentTarget.style.color = darkMode ? "#10B981" : "#059669";
                }}
                icon={<SaveOutlined />}
                loading={isCreating || isUpdating}
            >
                Save
            </Button>

            <Popconfirm
                title="Delete this note?"
                description="This action cannot be undone."
                okText="Delete"
                cancelText="Cancel"
                placement="bottomRight"
                okButtonProps={{ danger: true, loading: isDeleting }}
                onConfirm={onDelete}
            >
                <Button
                    type="text"
                    className={`danger ${darkMode ? "dark" : "light"}`}
                    style={{
                        ...commonStyle,
                        border: `1px solid ${darkMode ? "#3F3F46" : "#E5E7EB"}`,
                        background: darkMode ? "#27272A" : "#FFFFFF",
                        color: "#EF4444",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = darkMode ? "#1F2937" : "#FEF2F2";
                        e.currentTarget.style.color = "#DC2626";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? "#27272A" : "#FFFFFF";
                        e.currentTarget.style.color = "#EF4444";
                    }}
                    icon={<DeleteOutlined />}
                    loading={isDeleting}
                >
                    Delete
                </Button>
            </Popconfirm>
        </div>
    );
};

export default ActionButtons;
