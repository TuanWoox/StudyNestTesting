import React from "react";
import { Input, Button, theme, Grid } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined, ForkOutlined } from "@ant-design/icons";

interface QuizSearchControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onOpenFilter: () => void;
    onCreateQuiz: () => void;
    onForkQuiz?: () => void;
}

const QuizSearchControls: React.FC<QuizSearchControlsProps> = ({
    searchTerm,
    onSearchChange,
    onOpenFilter,
    onCreateQuiz,
    onForkQuiz,
}) => {
    const { token } = theme.useToken();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const borderColor = `${token.colorPrimary}E0`;
    const shadowColor = `${token.colorPrimary}55`;

    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                marginBottom: 24,
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            {/* Search Input */}
            <Input
                placeholder="Search quizzes..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                    flex: "1 1 300px",
                    minWidth: 200,
                    borderRadius: 0,
                    border: `1px solid ${borderColor}`,
                    boxShadow: `2px 2px 0 ${shadowColor}`,
                    fontSize: 15,
                }}
                allowClear
            />

            {/* Button Group */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "nowrap",
                }}
            >
                {/* Filter Button */}
                <Button
                    type="default"
                    icon={<FilterOutlined />}
                    onClick={onOpenFilter}
                    style={{
                        fontWeight: 600,
                        boxShadow: `2px 2px 0 ${shadowColor}`,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {screens.sm ? "Filter" : ""}
                </Button>

                {/* Fork Quiz Button */}
                {onForkQuiz && (
                    <Button
                        type="default"
                        icon={<ForkOutlined />}
                        onClick={onForkQuiz}
                        style={{
                            fontWeight: 600,
                            boxShadow: `2px 2px 0 ${shadowColor}`,
                            border: `1px solid ${borderColor}`,
                            borderRadius: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {screens.sm ? "Fork Quiz" : ""}
                    </Button>
                )}

                {/* Create New Quiz Button */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onCreateQuiz}
                    style={{
                        borderRadius: 0,
                        border: `1px solid ${borderColor}`,
                        fontWeight: 600,
                        boxShadow: `2px 2px 0 ${shadowColor}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {screens.sm ? "Create New Quiz" : ""}
                </Button>
            </div>
        </div>
    );
};

export default QuizSearchControls;
