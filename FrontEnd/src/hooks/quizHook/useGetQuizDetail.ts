import { useQuery } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { AxiosError } from "axios";
import type { QuizDetail } from "@/types/quiz/quiz";
import { toast } from "sonner";

interface UseGetQuizDetailOptions {
  enabled?: boolean;
}

const useGetQuizDetail = (
  quizId: string | undefined,
  options?: UseGetQuizDetailOptions
) => {
  const { enabled = !!quizId } = options || {};

  const query = useQuery<
    QuizDetail,
    AxiosError,
    QuizDetail,
    [string, string | undefined]
  >({
    queryKey: ["quiz", quizId],
    queryFn: () => {
      if (!quizId) {
        toast.error("Quiz ID is required");
        throw new Error("Quiz ID is required");
      }
      return quizService.getQuizDetail(quizId);
    },
    enabled,
    select: (data) => data, // keep or transform if needed
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min
  });

  return query;
};

export default useGetQuizDetail;
