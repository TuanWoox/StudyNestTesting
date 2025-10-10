import useGetQuizDetail from "@/hooks/quizHook/useGetQuizDetail";
import { Typography, Space, Divider } from "antd";
import { useParams } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export function QuizHeader() {
    const { id } = useParams<{ id: string }>();
    const { data } = useGetQuizDetail(id);

    return (
        <div className="mb-8">
            <div className="max-w-4xl mx-auto text-center">
                <Space direction="vertical" size="small" className="w-full">
                    <FileTextOutlined className="text-4xl text-blue-500 mb-2" />

                    <Title level={2} className="!mb-2">
                        {data?.title}
                    </Title>

                    <Text type="secondary" className="text-sm">
                        Please read each question carefully and select your answer
                    </Text>
                </Space>
            </div>
            <Divider className="mt-6" />
        </div>
    );
}