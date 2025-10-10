import { useState, useEffect } from "react";
import { ChoiceDTO } from "@/types/choice/choiceDTO";
import { QuestionDTO } from "@/types/question/questionDTO";
import { QuizAttemptAnswerDTO } from "@/types/quizAttemptAnswer/quizAttemptAnswerDTO";
import { Card, Row, Col, Tag, Typography, Space, Pagination } from "antd";

const { Title, Text, Paragraph } = Typography;

interface QuestionResultsListProps {
    questions: QuestionDTO[] | undefined;
    answers: QuizAttemptAnswerDTO[] | undefined;
}

const QuestionResultsList = ({ questions, answers }: QuestionResultsListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4; // 4 cards per page (2x2 grid)

    useEffect(() => {
        setCurrentPage(1);
    }, [questions]);

    if (!questions || !answers) {
        return <div className="text-center text-gray-500 py-8">No results to display</div>;
    }

    const getAnswerForQuestion = (questionId: string) =>
        answers.find(answer => answer.snapshotQuestionId === questionId);

    const getUserSelectedChoices = (question: QuestionDTO, answer: QuizAttemptAnswerDTO) => {
        const userChoiceIds = answer.quizAttemptAnswerChoices.map(choice => choice.choiceId);
        return question.choices.filter(choice => userChoiceIds.includes(choice.id));
    };

    const getCorrectChoices = (question: QuestionDTO) =>
        question.choices.filter(choice => choice.isCorrect);

    const getChoicesText = (choices: ChoiceDTO[]) => choices.map(c => c.text).join(", ");

    // Pagination logic
    const totalQuestions = questions.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedQuestions = questions.slice(startIndex, endIndex);

    return (
        <div className="mt-3">
            <Row gutter={[16, 16]}>
                {paginatedQuestions.map((question, index) => {
                    const answer = getAnswerForQuestion(question.id);
                    if (!answer) return null;

                    const isCorrect = answer.isCorrect;
                    const userChoices = getUserSelectedChoices(question, answer);
                    const correctChoices = getCorrectChoices(question);
                    const globalIndex = startIndex + index + 1;

                    return (
                        <Col xs={24} lg={12} key={question.id}>
                            <Card bordered style={{ height: "100%", border: '1px solid #E2DFE1' }} hoverable={true} className="shadow-sm">
                                <Row justify="space-between" align="middle" className="mb-3">
                                    <Col>
                                        <Title level={5} style={{ margin: 0 }}>
                                            {globalIndex}. {question.name}
                                        </Title>
                                    </Col>
                                    <Col>
                                        <Tag color={isCorrect ? "green" : "red"}>
                                            {isCorrect ? "Correct" : "Incorrect"}
                                        </Tag>
                                    </Col>
                                </Row>

                                <Space direction="vertical" size="small" className="w-full">
                                    <div>
                                        <Text type="secondary">Your answer: </Text>
                                        <Text strong style={{ color: isCorrect ? "#52c41a" : "#f5222d" }}>
                                            {userChoices.length > 0 ? getChoicesText(userChoices) : "No answer"}
                                        </Text>
                                    </div>

                                    {!isCorrect && (
                                        <div>
                                            <Text type="secondary">Correct answer: </Text>
                                            <Text strong style={{ color: "#52c41a" }}>
                                                {getChoicesText(correctChoices)}
                                            </Text>
                                        </div>
                                    )}

                                    {question.explanation && (
                                        <Paragraph className="mt-2 mb-0 border-t border-t-[#f0f0f0] pt-2">
                                            <Text strong>Explanation: </Text>
                                            {question.explanation}
                                        </Paragraph>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Left-aligned Pagination */}
            {
                totalQuestions > pageSize && (
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalQuestions}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                        style={{ marginTop: 12 }}
                        align="end"
                    />
                )
            }
        </div >
    );
};

export default QuestionResultsList;
