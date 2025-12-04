// hooks/useGetQuizDetail.ts
import { useQuery } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { QuizDetail } from "@/types/quiz/quiz";

const useGetQuizDetailByFriendlyUrl = (
    friendlyUrl: string | undefined,
    options?: { enabled?: boolean }
) => {
    const enabled = options?.enabled ?? !!friendlyUrl;

    return useQuery<QuizDetail>({
        queryKey: ["quizFriendly", friendlyUrl],
        enabled,
        queryFn: () => quizService.getQuizByFriendlyUrl(friendlyUrl as string),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export default useGetQuizDetailByFriendlyUrl;
