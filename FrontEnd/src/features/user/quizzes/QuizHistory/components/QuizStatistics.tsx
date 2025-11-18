import StudyNestCard from "@/components/StudyNestCard/StudyNestCard";
import useGetOneStatisticsByQuizId from "@/hooks/quizStatisticsHook/useGetOneStatisticsByQuizId";
import React from "react";

interface QuizStatisticsProps {
    quizId: string
}



const QuizStatistics: React.FC<QuizStatisticsProps> = ({ quizId }) => {
    const { data, isLoading } = useGetOneStatisticsByQuizId(quizId);
    if (isLoading) return null;
    return (
        <>
            {/* Score Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StudyNestCard>
                    <p className="text-3xl font-bold">{data?.result.attemptSummary.totalAttempts}</p>
                    <p className="text-sm text-gray-500 mt-1">Tổng lần làm</p>
                </StudyNestCard>

                <StudyNestCard>
                    <p className="text-3xl font-bold">
                        {data?.result?.scoreStatistics.averageScore}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Điểm trung bình</p>
                </StudyNestCard>

                <StudyNestCard>
                    <p className="text-3xl font-bold">
                        {data?.result?.scoreStatistics.bestScore}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Điểm cao nhất</p>
                </StudyNestCard>

                <StudyNestCard>
                    <p className="text-3xl font-bold">
                        {data?.result?.scoreStatistics.worstScore}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Điểm thấp nhất nhất</p>
                </StudyNestCard>
            </div>
            {/* Attempt Statistics */}
        </>
    )
};

export default QuizStatistics;
