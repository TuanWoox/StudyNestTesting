import React from "react";
import { Typography, theme } from "antd";

const { Title, Text } = Typography;
const { useToken } = theme;

const QuizExploreHeader: React.FC = () => {
    const { token } = useToken();

    return (
        <div style={{ marginBottom: 24 }}>
            <Title
                level={2}
                style={{
                    margin: 0,
                    fontWeight: 700,
                    fontFamily: "monospace",
                }}
            >
                Explore Public Quizzes
            </Title>
            <Text
                type="secondary"
                style={{
                    fontSize: 15,
                    marginTop: 4,
                    display: "block",
                    fontFamily: "monospace",
                }}
            >
                Discover and fork public quizzes created by other users
            </Text>
        </div>
    );
};

export default QuizExploreHeader;
