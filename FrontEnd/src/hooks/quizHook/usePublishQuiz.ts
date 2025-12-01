import queryClient from "@/config/reactQueryConfig"
import quizService from "@/services/quizService"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const usePublishQuiz = () => {
    return useMutation({
        mutationFn: (quizId: string) => quizService.usePublishQuiz(quizId),
        onSuccess: (data, quizId) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["quiz", quizId] })
                toast.success("Quiz access modified successfully.");
            }
        }
    })
}

export default usePublishQuiz;