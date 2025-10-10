// useDeleteQuestion.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import questionService from "@/services/questionService";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface UseDeleteQuestionOptions {
  quizId?: string; // Optional quizId to invalidate specific quiz cache
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

const useDeleteQuestion = (options?: UseDeleteQuestionOptions) => {
  const queryClient = useQueryClient();
  const { quizId, onSuccess, onError } = options || {};

  const mutation = useMutation<boolean, AxiosError, string>({
    mutationKey: ["deleteQuestion"],
    mutationFn: async (questionId: string) => {
      const ok = await questionService.deleteQuestion(questionId);
      // Guard against unexpected false without message (shouldn't happen, but safe)
      if (!ok) throw new Error("Delete question failed.");
      return true;
    },
    onSuccess: () => {
      toast.success("Question deleted successfully");
      // Invalidate the specific quiz detail if quizId is provided
      if (quizId) {
        queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      }
      // Always invalidate the quizzes list
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      onSuccess?.();
    },
    onError: (error) => {
      // Error toast already shown by the interceptor; just pass it through
      toast.error("Failed to delete question");
      onError?.(error);
    },
  });

  return {
    deleteQuestion: mutation.mutate, // (id: string) => void
    deleteQuestionAsync: mutation.mutateAsync, // (id: string) => Promise<boolean>
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useDeleteQuestion;
