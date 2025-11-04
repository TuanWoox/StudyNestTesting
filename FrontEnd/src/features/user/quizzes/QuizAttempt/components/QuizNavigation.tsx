import { useSubmitQuizAttempt } from "@/hooks/quizAttempt/useSubmitQuizAttempt"
import { useReduxDispatch } from "@/hooks/reduxHook/useReduxDispatch"
import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector"
import { nextQuestion, previousQuestion, selectIsNeededToSubmitQuiz, selectQuizAttempt, selectQuizNavigation } from "@/store/quizAttemptSlice"
import { LeftOutlined, RightOutlined, SendOutlined } from "@ant-design/icons"
import { Button, Grid, theme } from "antd"
import { useCallback, useEffect } from "react"

const { useBreakpoint } = Grid

export function QuizNavigation() {
    const dispatch = useReduxDispatch();
    const quizAttempt = useReduxSelector(selectQuizAttempt);
    const { token } = theme.useToken();
    const { isLastQuestion, isFirstQuestion } = useReduxSelector(selectQuizNavigation);
    const { submitAnswer, isLoading: isSubmitting } = useSubmitQuizAttempt();
    const isNeededToSubmit = useReduxSelector(selectIsNeededToSubmitQuiz);
    const screens = useBreakpoint();

    // responsive size: small if mobile, otherwise middle
    const buttonSize = screens.xs ? "small" : "middle"

    // 🎨 Tông màu LearnHub Retro
    const primaryColor = token.colorPrimary;
    const borderColor = `${primaryColor}E0`; // 88% opacity
    const shadowColor = `${primaryColor}55`; // 33% opacity

    const onPrevious = () => dispatch(previousQuestion());
    const onNext = () => dispatch(nextQuestion());
    const onSubmit = useCallback(() => {
        submitAnswer({
            quizId: quizAttempt.quizId,
            submittedAnswer: quizAttempt.createQuizAttemptAnswerList,
        });
    }, [submitAnswer, quizAttempt.quizId, quizAttempt.createQuizAttemptAnswerList]);


    useEffect(() => {
        if (isNeededToSubmit) {
            onSubmit();
        }
    }, [isNeededToSubmit, onSubmit]);

    return (
        <div className="flex items-center justify-between gap-4">
            <Button
                onClick={onPrevious}
                disabled={isFirstQuestion || isSubmitting}
                type="default"
                size={buttonSize}
                icon={<LeftOutlined />}
                style={{
                    boxShadow: `3px 3px 0 ${shadowColor}`,
                    border: `1px solid ${borderColor}`,
                }}
            >
                Prev
            </Button>

            {isLastQuestion ? (
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    type="default"
                    size={buttonSize}
                    icon={<SendOutlined />}
                    loading={isSubmitting}
                    style={{
                        boxShadow: `3px 3px 0 ${shadowColor}`,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    {isSubmitting ? "Submitting Quiz..." : "Submit Quiz"}
                </Button>
            ) : (
                <Button
                    onClick={onNext}
                    disabled={isSubmitting}
                    type="default"
                    size={buttonSize}
                    icon={<RightOutlined />}
                    style={{
                        boxShadow: `3px 3px 0 ${shadowColor}`,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    {isSubmitting ? "Submitting Quiz..." : "Next"}
                </Button>
            )}
        </div>
    )
}
