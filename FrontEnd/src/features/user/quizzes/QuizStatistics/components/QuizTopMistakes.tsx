import { ReturnResult } from "@/types/common/return-result";
import { QuizStatisticsDTO } from "@/types/quizStatistics/QuizStatisticsDTO";
import React from "react";

interface QuizTopMistakesProps {
    data: ReturnResult<QuizStatisticsDTO>
}
const QuizTopMistakes: React.FC<QuizTopMistakesProps> = ({ data }) => {
    if (!data || !data?.result?.attemptSummary?.questionErrorCounts) return null;
    return (
        <div>

        </div>
    )
};

export default QuizTopMistakes;
