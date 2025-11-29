import noteService from "@/services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteNote = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, AxiosError, string>({
        mutationKey: ["deleteNote"],
        mutationFn: (noteId: string) => noteService.deleteNote(noteId),
        onSuccess: (res) => {
            if (res) {
                queryClient.invalidateQueries({ queryKey: ["notes"] });
                queryClient.invalidateQueries({ queryKey: ["folders"] });
                queryClient.invalidateQueries({ queryKey: ["tags"] });
                toast.success("Note deleted successfully");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        deleteNote: mutation.mutate,
        deleteNoteAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

export default useDeleteNote;