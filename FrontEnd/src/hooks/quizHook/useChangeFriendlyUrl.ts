import queryClient from "@/config/reactQueryConfig"
import quizService from "@/services/quizService"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useChangeFriendlyUrl = () => {
    return useMutation<
        boolean,
        unknown,
        { quizId: string; newFriendlyUrl: string }
    >({
        mutationFn: ({ quizId, newFriendlyUrl }) => quizService.changeFriendlyUrl(quizId, newFriendlyUrl),
        onSuccess: (data, { quizId }) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["quiz", quizId] })
                toast.success("Changed friendly URL successfully")
            }
        },
    })
}
