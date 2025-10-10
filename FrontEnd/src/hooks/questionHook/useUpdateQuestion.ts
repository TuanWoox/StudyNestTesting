// useUpdateQuestion.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import questionService from "@/services/questionService";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { UpdateQuestionDTO } from "@/types/question/updateQuestionDTO";

interface UseUpdateQuestionOptions {
  onSuccess?: (data: boolean) => void;
  onError?: (error: unknown) => void;
}

const useUpdateQuestion = (options?: UseUpdateQuestionOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation<boolean, AxiosError, UpdateQuestionDTO>({
    mutationKey: ["updateQuestion"],
    mutationFn: async (payload: UpdateQuestionDTO) => {
      const result = await questionService.updateQuestion(payload);
      // Guard against unexpected false without message (shouldn't happen, but safe)
      if (!result) throw new Error("Update question failed.");
      return true;
    },
    onSuccess: (data, variables) => {
      toast.success("Question updated successfully");
      // Invalidate the specific quiz detail to refresh the questions list
      queryClient.invalidateQueries({ queryKey: ["quiz", variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      onSuccess?.(data);
    },
    onError: (error) => {
      // Error toast already shown by the interceptor; just pass it through
      toast.error("Failed to update question");
      onError?.(error);
    },
  });

  return {
    updateQuestion: mutation.mutate, // (payload: UpdateQuestionDTO) => void
    updateQuestionAsync: mutation.mutateAsync, // (payload: UpdateQuestionDTO) => Promise<boolean>
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useUpdateQuestion;
