import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useGetOneForAttempting } from "@/hooks/quizAttemptSnapshotHook/useGetOneForAttempting";
import { useReduxDispatch } from "@/hooks/reduxHook/useReduxDispatch";
import { initState } from "@/store/quizAttemptSlice";
import { useQuizAttemptSnapshotHub } from "@/context/QuizSnapshotHubContext/QuizAttemptSnapshotHubContextValue";

import { ErrorDisplay } from "@/components/ErrorDisplay/ErrorDisplay";
import QuestionCard from "./components/QuestionCard";
import { QuizHeader } from "./components/QuizHeader";
import { QuizProgress } from "./components/QuizProgress";
import { QuizNavigation } from "./components/QuizNavigation";
import QuizSnapshotNotReady from "./components/QuizSnapshotNotReady";
import QuizContentViewSkeleton from "@/components/QuizContentViewSkeleton/QuizContentViewSkeleton";

const QuizView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useReduxDispatch();
    const { notificationConnection } = useQuizAttemptSnapshotHub();

    const {
        data: resultQuizSnapshot,
        isLoading: isQuizSnapshotLoading,
        isRefetching: isQuizSnapshotRefetching,
        refetch: refreshToLoadQuizSnapshot,
        error: quizSnapshotError,
    } = useGetOneForAttempting(id, { enabled: false });

    const quizSnapshotLoading = useMemo(
        () => isQuizSnapshotLoading || isQuizSnapshotRefetching,
        [isQuizSnapshotLoading, isQuizSnapshotRefetching]
    );

    // Fetch the data only when the component mounts
    useEffect(() => {
        refreshToLoadQuizSnapshot();
    }, [refreshToLoadQuizSnapshot])

    //Init the quiz store, always init the new one everytime we start the quiz -> no need to store
    useEffect(() => {
        dispatch(
            initState({
                quizId: id as string,
                quizAttemptSnapshot: JSON.stringify(resultQuizSnapshot?.result),
                createQuizAttemptAnswerList: [],
                questionId: resultQuizSnapshot?.result?.quizQuestionsParsed?.[0]?.id ?? "",
                isNeededToSubmit: false
            })
        );
    }, [id, resultQuizSnapshot?.result, dispatch]);

    //Init The SignalR
    useEffect(() => {
        const handleReload = ({ quizId }: { quizId: string }) => {
            if (id === quizId) {
                refreshToLoadQuizSnapshot();
            }
        };

        notificationConnection?.on("ReloadQuizAttemptSnapshot", handleReload);

        return () => {
            notificationConnection?.off("ReloadQuizAttemptSnapshot", handleReload);
        };
    }, [id, notificationConnection, refreshToLoadQuizSnapshot])

    // Loading state
    if (quizSnapshotLoading) return <QuizContentViewSkeleton />

    // No data available
    if (!resultQuizSnapshot?.result && !resultQuizSnapshot?.message) return <QuizSnapshotNotReady />

    // Error state
    if (resultQuizSnapshot.message || quizSnapshotError) {
        return (
            <ErrorDisplay
                title="Unable to load quiz"
                message={
                    resultQuizSnapshot.message ||
                    quizSnapshotError?.message ||
                    "An unexpected error occurred while fetching quiz data."
                }
            />
        );
    }

    // Success state
    return (
        <div
            className="w-full lg:max-w-5xl mx-auto p-4 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            <QuizHeader />
            <QuizProgress />
            <QuestionCard />
            <QuizNavigation />
        </div>
    );
};

export default QuizView;