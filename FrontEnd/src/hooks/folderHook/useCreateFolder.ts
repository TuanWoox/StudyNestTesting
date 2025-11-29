import folderService from "@/services/folderService";
import { CreateFolderDTO, Folder } from "@/types/note/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateFolder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<Folder, AxiosError, CreateFolderDTO>({
        mutationKey: ["createFolder"],
        mutationFn: (payload) => folderService.createFolder(payload),
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ["folders"] });

                toast.success("Folder successfully created!");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        createFolder: mutation.mutate,
        createFolderAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useCreateFolder;