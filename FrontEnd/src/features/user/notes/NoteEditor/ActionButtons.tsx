import React from "react";
import { Button, Popconfirm } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

interface ActionButtonsProps {
    onSave: () => void;
    onClose: () => void;
    darkMode: boolean;
    isCreating?: boolean;
    isUpdating?: boolean;
    confirmBeforeClose?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    onSave,
    onClose,
    darkMode,
    isCreating = false,
    isUpdating = false,
    confirmBeforeClose
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
        <div className="flex gap-3">
            {confirmBeforeClose ? (
                <Popconfirm
                    title="Unsaved changes"
                    description="You have unsaved changes. Are you sure you want to close without saving?"
                    okText="Close without saving"
                    cancelText="Cancel"
                    placement="topRight"
                    onConfirm={onClose}
                >
                    <Button
                        type="text"
                        style={{
                            ...commonStyle,
                            border: `1px solid ${darkMode ? "#3F3F46" : "#E5E7EB"}`,
                            background: darkMode ? "#27272A" : "#FFFFFF",
                            color: darkMode ? "#F97316" : "#EA580C",
                        }}
                        icon={<CloseOutlined />}
                    >
                        Close
                    </Button>
                </Popconfirm>
            ) : (
                <Button
                    type="text"
                    onClick={onClose}
                    style={{
                        ...commonStyle,
                        border: `1px solid ${darkMode ? "#3F3F46" : "#E5E7EB"}`,
                        background: darkMode ? "#27272A" : "#FFFFFF",
                        color: darkMode ? "#F97316" : "#EA580C",
                    }}
                    icon={<CloseOutlined />}
                >
                    Close
                </Button>
            )}

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
        </div>
    );
};

export default ActionButtons;
