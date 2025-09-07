import { useQuery } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { AxiosError } from "axios";
import type { QuizList } from "@/types/quiz/quiz";

interface UseGetAllQuizOptions {
  enabled?: boolean;
}

const useGetAllQuiz = (options?: UseGetAllQuizOptions) => {
  const { enabled = true } = options || {};

  const query = useQuery<QuizList[], AxiosError, QuizList[], [string]>({
    queryKey: ["quizzes"],
    queryFn: () => {
      return quizService.getAllQuiz();
    },
    enabled,
    select: (data) => data, // keep or transform if needed
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min
  });

  return query;
};

export default useGetAllQuiz;
