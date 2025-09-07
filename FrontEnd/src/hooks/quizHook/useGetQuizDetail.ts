// hooks/useGetQuizDetail.ts
import { useQuery } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { QuizDetail } from "@/types/quiz/quiz";

const useGetQuizDetail = (
  quizId: string | undefined,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? !!quizId;

  return useQuery<QuizDetail>({
    queryKey: ["quiz", quizId],
    enabled,
    queryFn: () => quizService.getQuizDetail(quizId as string),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

export default useGetQuizDetail;
