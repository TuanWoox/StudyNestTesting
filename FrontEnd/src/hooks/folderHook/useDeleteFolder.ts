import folderService from "@/services/folderService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteFolder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, AxiosError, string>({
        mutationKey: ["deleteFolder"],
        mutationFn: (folderId: string) => folderService.deleteFolder(folderId),
        onSuccess: (res) => {
            if (res) {
                queryClient.invalidateQueries({ queryKey: ["folders"] });
                queryClient.invalidateQueries({ queryKey: ["notes"] });
                queryClient.invalidateQueries({ queryKey: ["tags"] });
                toast.success("Folder deleted successfully");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        deleteFolder: mutation.mutate,
        deleteFolderAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

export default useDeleteFolder;