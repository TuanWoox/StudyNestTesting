import React from "react";
import { Flex, Pagination, theme, Grid } from "antd";

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface QuizPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

const QuizPagination: React.FC<QuizPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
}) => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  if (total <= pageSize) return null;

  return (
    <div
      style={{
        position: "sticky",
        bottom: 55,
        zIndex: 10,
        width: "100%",
      }}
    >
      <Flex justify="center">
        <div
          style={{
            padding: screens.md ? "8px 16px" : "4px 12px",
            background: token.colorBgElevated,
            border: borderColor,
            boxShadow: shadowColor,
          }}
        >
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
            showSizeChanger={false}
            size={screens.md ? "default" : "small"}
            simple={screens.xs}
            showTotal={
              screens.md
                ? (total, range) =>
                    `${range[0]}-${range[1]} of ${total} quizzes`
                : undefined
            }
            responsive
          />
        </div>
      </Flex>
    </div>
  );
};

export default QuizPagination;
