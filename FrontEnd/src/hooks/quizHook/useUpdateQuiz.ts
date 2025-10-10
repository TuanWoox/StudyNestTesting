// useUpdateQuiz.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { UpdateQuizDTO } from "@/types/quiz/updateQuizDTO";

interface UseUpdateQuizOptions {
  onSuccess?: (data: boolean) => void;
  onError?: (error: unknown) => void;
}

const useUpdateQuiz = (options?: UseUpdateQuizOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation<boolean, AxiosError, UpdateQuizDTO>({
    mutationKey: ["updateQuiz"],
    mutationFn: async (payload: UpdateQuizDTO) => {
      const result = await quizService.updateQuiz(payload);
      // Guard against unexpected false without message (shouldn't happen, but safe)
      if (!result) throw new Error("Update failed.");
      return true;
    },
    onSuccess: (data, variables) => {
      toast.success("Quiz updated successfully");
      // Invalidate the specific quiz detail and the quiz list
      queryClient.invalidateQueries({ queryKey: ["quiz", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      onSuccess?.(data);
    },
    onError: (error) => {
      // Error toast already shown by the interceptor; just pass it through
      toast.error("Failed to update quiz");
      onError?.(error);
    },
  });

  return {
    updateQuiz: mutation.mutate, // (payload: UpdateQuizDTO) => void
    updateQuizAsync: mutation.mutateAsync, // (payload: UpdateQuizDTO) => Promise<boolean>
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useUpdateQuiz;
