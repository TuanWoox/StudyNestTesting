import tagService from "@/services/tagService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteTag = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, AxiosError, string>({
        mutationKey: ["deleteTag"],
        mutationFn: async (tagId) => {
            const ok = await tagService.deleteTag(tagId);
            if (!ok) throw new Error("Delete failed");
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            toast.success("Tag deleted successfully");
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err?.message ?? "Failed to delete tag");
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