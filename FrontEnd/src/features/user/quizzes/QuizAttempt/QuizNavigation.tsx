"use client"

import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector"
import { selectQuizNavigation } from "@/store/quizAttemptSlice"
import { LeftOutlined, RightOutlined, SendOutlined } from "@ant-design/icons"
import { Button } from "antd"

interface QuizNavigationProps {
    onPrevious: () => void
    onNext: () => void
    onSubmit: () => void
    isSubmitting: boolean
}

export function QuizNavigation({
    onPrevious,
    onNext,
    onSubmit,
    isSubmitting,
}: QuizNavigationProps) {
    const { isLastQuestion, isFirstQuestion, hasAnswer } = useReduxSelector(selectQuizNavigation);
    return (
        <div className="flex items-center justify-between gap-4">
            <Button
                onClick={onPrevious}
                disabled={isFirstQuestion || isSubmitting}
                type="default"
                size="large"
                icon={<LeftOutlined />}
            >
                Previous
            </Button>

            <div className="flex-1 flex justify-center">
                {!hasAnswer && (
                    <p className="text-sm text-muted-foreground italic">
                        Select an answer to continue
                    </p>
                )}
            </div>

            {isLastQuestion ? (
                <Button
                    onClick={onSubmit}
                    disabled={!hasAnswer || isSubmitting}
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    loading={isSubmitting}
                >
                    Submit Quiz
                </Button>
            ) : (
                <Button
                    onClick={onNext}
                    disabled={!hasAnswer || isSubmitting}
                    type="primary"
                    size="large"
                    icon={<RightOutlined />}
                >
                    Next
                </Button>
            )}
        </div>
    )
}
