// hooks/useGetQuizDetail.ts
import { useQuery } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { QuizDetail } from "@/types/quiz/quiz";

const useGetQuizDetailByFriendlyURL = (
    friendlyURl: string | undefined,
    options?: { enabled?: boolean }
) => {
    const enabled = options?.enabled ?? !!friendlyURl;

    return useQuery<QuizDetail>({
        queryKey: ["quizFriendly", friendlyURl],
        enabled,
        queryFn: () => quizService.getQuizByFriendlyUrl(friendlyURl as string),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export default useGetQuizDetailByFriendlyURL;
