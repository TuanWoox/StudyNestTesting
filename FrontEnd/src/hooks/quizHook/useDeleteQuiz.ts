// useDeleteQuiz.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import quizService from "@/services/quizService";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface UseDeleteQuizOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

const useDeleteQuiz = (options?: UseDeleteQuizOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation<boolean, AxiosError, string>({
    mutationKey: ["deleteQuiz"],
    mutationFn: async (quizId: string) => {
      const ok = await quizService.deleteQuiz(quizId);
      // Guard against unexpected false without message (shouldn’t happen, but safe)
      if (!ok) throw new Error("Delete failed.");
      return true;
    },
    onSuccess: () => {
      toast.success("Quiz deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      onSuccess?.();
    },
    onError: (error) => {
      // Error toast already shown by the interceptor; just pass it through
      onError?.(error);
    },
  });

  return {
    deleteQuiz: mutation.mutate, // (id: string) => void
    deleteQuizAsync: mutation.mutateAsync, // (id: string) => Promise<boolean>
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useDeleteQuiz;
