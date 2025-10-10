import useGetOneQuizAttemptById from "@/hooks/quizAttempt/useGetOneQuizAttemptById";
import { useParams } from "react-router-dom";
import ResultHeader from "./ResultHeader";
import QuestionResultsList from "./QuestionResultsList";
import Spinner from "@/components/Spinner/Spinner";

const QuizResultView = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useGetOneQuizAttemptById(id);

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="mx-auto mt-12 max-w-7xl">
            <ResultHeader score={data?.score} id={data?.quizId} />
            <QuestionResultsList answers={data?.quizAttemptAnswers} questions={data?.quizAttemptSnapshot.quizQuestionsParsed} />
        </div>
    )
};

export default QuizResultView;
