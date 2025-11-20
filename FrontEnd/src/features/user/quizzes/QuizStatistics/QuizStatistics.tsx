import StudynestModal from "@/components/StudynestModal/StudynestModal";
import useGetOneStatisticsByQuizId from "@/hooks/quizStatisticsHook/useGetOneStatisticsByQuizId";
import { forwardRef, useImperativeHandle, useState } from "react";
import QuizStatisticsHeader from "./components/QuizStatisticsHeader";
import QuizStatisticsSummary from "./components/QuizStatisticsSummary"
import QuizStatisticsChart from "./components/QuizStatisticsChart";
import { useAntDesignTheme } from "@/hooks/common";
import { ModalProps } from "antd";
interface QuizStatisticsProps {
    quizId: string;
}

export interface QuizStatisticsRef {
    handleOpenStats: () => void;
}

const QuizStatistics = forwardRef<QuizStatisticsRef, QuizStatisticsProps>(
    ({ quizId }, ref) => {
        const { data, isLoading } = useGetOneStatisticsByQuizId(quizId);
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const { modalStyles } = useAntDesignTheme();
        const customModalStyles: ModalProps["styles"] = {
            ...modalStyles,
            body: {
                ...modalStyles.body,
                overflowY: "auto",
                overflowX: "hidden",
            },
        };

        useImperativeHandle(ref, () => ({
            handleOpenStats() {
                setIsOpen(true);
            }
        }));

        if (isLoading) return null;

        return (
            <StudynestModal
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                cancelText="Close"
                customStyles={customModalStyles}
            >
                <div className="m-4 space-y-4">
                    {/* Ant Design Title + Subtitle */}
                    <QuizStatisticsHeader />
                    {/* Statistics Grid */}
                    <QuizStatisticsSummary data={data} />
                    {/* Chart Section */}
                    <QuizStatisticsChart data={data} />
                    {/* Top Mistakes Question, Do A Pagination From Full From BackEnd */}
                </div>
            </StudynestModal>
        );
    }
);

export default QuizStatistics;
