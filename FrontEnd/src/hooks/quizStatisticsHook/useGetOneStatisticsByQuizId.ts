import quizStatisticsService from "@/services/quizStatisticsService"
import { useQuery } from "@tanstack/react-query"

const useGetOneStatisticsByQuizId = (quizId: string, options?: { enabled?: boolean }) => {
    const enabled = options?.enabled ?? true;
    return useQuery({
        queryKey: ["statistics", quizId],
        queryFn: () => quizStatisticsService.getOneById(quizId),
        enabled: enabled
    })
}

export default useGetOneStatisticsByQuizId;