import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { CreateQuizDTO } from "@/types/quiz/createQuizDTO";
import quizService from "@/services/quizService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UseGenerateQuizOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  redirectOnSuccess?: boolean;
}

export const useGenerateQuiz = (options?: UseGenerateQuizOptions) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onSuccess, onError, redirectOnSuccess = true } = options || {};

  const mutation = useMutation({
    mutationFn: (quizData: CreateQuizDTO) => {
      return quizService.generateQuiz(quizData);
    },
    onSuccess: (data) => {
      toast.success("Quiz successfully generated!");
      queryClient.invalidateQueries({
        queryKey: ["quizzes"],
        refetchType: "inactive",
      });
      if (redirectOnSuccess) {
        // Redirect to the quiz view page with the new quiz ID
        navigate(`/user/quiz/${data.id}`);
      }

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate quiz. Please try again.";
      message.error(errorMessage);

      if (onError) {
        onError(error);
      }
    },
  });

  return {
    generateQuiz: mutation.mutate,
    generateQuizAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};

export default useGenerateQuiz;
