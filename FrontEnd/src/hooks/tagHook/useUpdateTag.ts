import tagService from "@/services/tagService";
import { Tag, UpdateTagDTO } from "@/types/note/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateTag = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<Tag, AxiosError, UpdateTagDTO>({
        mutationKey: ["updateTag"],
        mutationFn: (payload) => tagService.updateTag(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            toast.success("Tag successfully updated");
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err?.message ?? "Failed to update tag");
        },
    });

    return {
        updateTag: mutation.mutate,
        updateTagAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useUpdateTag;