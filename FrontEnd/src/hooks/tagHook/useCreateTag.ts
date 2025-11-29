import tagService from "@/services/tagService";
import { CreateTagDTO, Tag } from "@/types/note/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateTag = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<Tag, AxiosError, CreateTagDTO>({
        mutationKey: ["createTag"],
        mutationFn: (payload) => tagService.createTag(payload),
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["tags"] });

                toast.success("Tag successfully created!");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        createTag: mutation.mutate,
        createTagAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useCreateTag;