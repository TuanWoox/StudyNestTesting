import { useMutation } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import { toast } from "sonner";
import queryClient from "@/config/reactQueryConfig";

const useStarQuiz = () => {
    return useMutation({
        mutationFn: ({ quizId, friendlyUrl }: { quizId: string; friendlyUrl?: string }) => quizService.starQuiz(quizId),
        onSuccess: (data, variables) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["public-quizzes"] });
                if (variables.friendlyUrl) {
                    queryClient.invalidateQueries({ queryKey: ["quizFriendly", variables.friendlyUrl] });
                }
                toast.success("Quiz starred successfully");
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to star quiz");
        }
    });
};

export default useStarQuiz;