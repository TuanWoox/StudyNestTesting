import { Divider, Typography } from "antd";

const { Title } = Typography;

const QuizStatisticsHeader = () => {
    return (
        <div className="mb-6">
            <Title level={3}>Quiz Statistics</Title>
            <Title level={5} type="secondary" style={{ marginTop: 0 }}>
                Detailed analytics for this quiz attempt performance.
            </Title>
            <Divider />
        </div>
    )
};

export default QuizStatisticsHeader;
