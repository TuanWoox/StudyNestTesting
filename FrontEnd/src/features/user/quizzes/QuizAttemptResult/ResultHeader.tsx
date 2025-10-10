import { Card, Button, Progress, Space } from 'antd'
import { RedoOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';

interface ResultHeaderTypeProp {
    score: number | undefined
    id: string | undefined,
}

const ResultHeader = ({ score = 0, id }: ResultHeaderTypeProp) => {
    const navigate = useNavigate();

    const getPerformance = (score: number) => {
        if (score >= 80) return { text: 'Excellent!', color: '#52c41a' }
        if (score >= 60) return { text: 'Good Job!', color: '#1890ff' }
        if (score >= 40) return { text: 'Fair', color: '#faad14' }
        return { text: 'Keep Practicing!', color: '#ff4d4f' }
    }

    const performance = getPerformance(score)

    const onRetake = () => {
        navigate(`/user/quizAttempt/${id}`);
    }

    return (
        <Card
            bordered={true}
            className="rounded-[12px] p-4 text-center border-2 shadow-md"
            hoverable={true}
            style={{
                border: '1px solid #E2DFE1' // Replace with your desired color
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Circular Score */}
                <Progress
                    type="circle"
                    percent={score}
                    strokeColor="#1890ff"
                    format={percent => `${percent}%`}
                    size={120}
                />
                {/* Performance Text */}
                <p className="m-0 text-[16px] font-medium" style={{ color: performance.color }}>
                    {performance.text}
                </p>
                {/* Retake Button */}
                {onRetake && (
                    <Button type="primary" icon={<RedoOutlined />} size="large" onClick={onRetake}>
                        Retake Quiz
                    </Button>
                )}
            </Space>
        </Card>
    )
}

export default ResultHeader
