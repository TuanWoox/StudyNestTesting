import queryClient from "@/config/reactQueryConfig"
import quizService from "@/services/quizService"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useForkQuiz = () => {
    return useMutation({
        mutationFn: (quizId: string) => quizService.forkQuiz(quizId),
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["quizzes"] });
                toast.success("Quiz Forked Successfully");
            }
        }
    })
}

export default useForkQuiz;