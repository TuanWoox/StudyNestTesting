import folderService from "@/services/folderService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteFolder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, AxiosError, string>({
        mutationKey: ["deleteFolder"],
        // hỏi lại cảnh
        mutationFn: async (folderId: string) => {
            const ok = await folderService.deleteFolder(folderId);
            if (!ok) throw new Error("Delete failed.");
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            toast.success("Folder deleted successfully");
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err?.message ?? "Failed to delete folder");
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