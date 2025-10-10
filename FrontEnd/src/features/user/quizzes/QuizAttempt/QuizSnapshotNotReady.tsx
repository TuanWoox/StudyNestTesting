import { ClockCircleOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Typography, Space, Alert, Spin } from 'antd';

const { Title, Paragraph } = Typography;

const QuizSnapshotNotReady = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <Card className="text-center shadow-md">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Spin
                        indicator={<SyncOutlined spin style={{ fontSize: '64px' }} />}
                        size="large"
                    />

                    <Title level={2} style={{ marginBottom: 0 }}>
                        Quiz Snapshot Not Ready
                    </Title>

                    <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                        Your quiz snapshot is currently being prepared. This usually takes just a few moments.
                    </Paragraph>

                    <Alert
                        message="Please wait"
                        description="Check back in a few minutes or refresh this page to see if your snapshot is ready."
                        type="info"
                        showIcon
                        icon={<ClockCircleOutlined />}
                    />

                    <Button
                        type="primary"
                        size="large"
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                    >
                        Refresh Page
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default QuizSnapshotNotReady;