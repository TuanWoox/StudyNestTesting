import quizAttemptSnapshotService from "@/services/quizAttemptSnapshotService"
import { QuizAttemptSnapshotDTO } from "@/types/quizAttemptSnapshot/quizAttemptSnapshotDTO"
import { useQuery } from "@tanstack/react-query"

export const useGetOneForAttempting = (quizId: string | undefined, options?: { enabled?: boolean }) => {
    const enabled = options?.enabled ?? !!quizId;
    return useQuery<QuizAttemptSnapshotDTO>({
        queryKey: ["quizAttemptSnapshot", quizId],
        queryFn: () => quizAttemptSnapshotService.getOneByIdForAttempting(quizId as string),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    })
}