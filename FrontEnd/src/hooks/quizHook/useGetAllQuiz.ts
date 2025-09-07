// hooks/useGetAllQuiz.ts
import { useQuery } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { QuizList } from "@/types/quiz/quiz";

interface UseGetAllQuizOptions {
  enabled?: boolean;
  sortByNewest?: boolean;
}

const useGetAllQuiz = (options?: UseGetAllQuizOptions) => {
  const enabled = options?.enabled ?? true;
  const sortByNewest = options?.sortByNewest ?? true;

  return useQuery<QuizList[]>({
    queryKey: ["quizzes", { sortByNewest }],
    enabled,
    queryFn: () => quizService.getAllQuiz(),
    select: (rows) =>
      sortByNewest
        ? rows
            .slice()
            .sort(
              (a, b) =>
                new Date(b.dateCreated).getTime() -
                new Date(a.dateCreated).getTime()
            )
        : rows,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

export default useGetAllQuiz;
