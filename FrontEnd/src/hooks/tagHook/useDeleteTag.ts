import tagService from "@/services/tagService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteTag = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, AxiosError, string>({
        mutationKey: ["deleteTag"],
        mutationFn: (tagId) => tagService.deleteTag(tagId),
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["tags"] });
                queryClient.invalidateQueries({ queryKey: ["folders"] });
                queryClient.invalidateQueries({ queryKey: ["notes"] });
                toast.success("Tag deleted successfully");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        deleteTag: mutation.mutate,
        deleteTagAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

export default useDeleteTag;