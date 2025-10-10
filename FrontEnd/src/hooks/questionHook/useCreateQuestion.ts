// useCreateQuestion.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import questionService from "@/services/questionService";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { CreateQuestionDTO } from "@/types/question/createQuestionDTO";

interface UseCreateQuestionOptions {
  onSuccess?: (data: boolean) => void;
  onError?: (error: unknown) => void;
}

const useCreateQuestion = (options?: UseCreateQuestionOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation<boolean, AxiosError, CreateQuestionDTO>({
    mutationKey: ["createQuestion"],
    mutationFn: async (payload: CreateQuestionDTO) => {
      const result = await questionService.createQuestion(payload);
      // Guard against unexpected false without message (shouldn't happen, but safe)
      if (!result) throw new Error("Create question failed.");
      return true;
    },
    onSuccess: (data, variables) => {
      toast.success("Question created successfully");
      // Invalidate the specific quiz detail to refresh the questions list
      queryClient.invalidateQueries({ queryKey: ["quiz", variables.quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      onSuccess?.(data);
    },
    onError: (error) => {
      // Error toast already shown by the interceptor; just pass it through
      toast.error("Failed to create question");
      onError?.(error);
    },
  });

  return {
    createQuestion: mutation.mutate, // (payload: CreateQuestionDTO) => void
    createQuestionAsync: mutation.mutateAsync, // (payload: CreateQuestionDTO) => Promise<boolean>
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useCreateQuestion;
