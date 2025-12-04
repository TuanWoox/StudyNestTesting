import React from "react";
import { Pagination, Grid } from "antd";

interface QuizExplorePaginationProps {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
}

const QuizExplorePagination: React.FC<QuizExplorePaginationProps> = ({
    current,
    pageSize,
    total,
    onChange,
}) => {
    const screens = Grid.useBreakpoint();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={onChange}
                showSizeChanger={!screens.xs}
                simple={screens.xs}
                showTotal={!screens.xs ? (total, range) => (
                    <span style={{ fontFamily: "monospace" }}>
                        {screens.md ? `${range[0]}-${range[1]} of ${total} public quizzes` : `${total} quizzes`}
                    </span>
                ) : undefined}
                pageSizeOptions={[6, 9, 15, 30]}
                style={{
                    fontFamily: "monospace",
                }}
            />
        </div>
    );
};

export default QuizExplorePagination;
