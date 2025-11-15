import React from "react";
import { Row, Col, Card, Statistic, theme } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { useToken } = theme;

interface QuizStatsProps {
  totalQuizzes: number;
}

const QuizStats: React.FC<QuizStatsProps> = ({ totalQuizzes }) => {
  const { token } = useToken();
  const borderColor = `2px solid ${token.colorPrimary}E0`;
  const shadowColor = `4px 4px 0px ${token.colorPrimary}55`;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
      <Col xs={24} sm={24} md={24}>
        <Card
          style={{
            border: borderColor,
            borderRadius: 0,
            boxShadow: shadowColor,
            backgroundColor: token.colorBgContainer,
          }}
        >
          <Statistic
            title="Total Quizzes Created"
            value={totalQuizzes}
            prefix={<FileTextOutlined />}
            valueStyle={{
              color: token.colorPrimary,
              fontWeight: 600,
              fontFamily: "monospace",
              fontSize: "28px",
            }}
            formatter={(value) => (
              <span style={{ fontFamily: "monospace" }}>{value}</span>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default QuizStats;
