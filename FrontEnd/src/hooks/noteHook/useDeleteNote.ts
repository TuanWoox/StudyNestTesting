import noteService from "@/services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteNote = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, AxiosError, string>({
        mutationKey: ["deleteNote"],
        mutationFn: async (noteId: string) => {
            const ok = await noteService.deleteNote(noteId);
            if (!ok) throw new Error("Delete failed");
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            toast.success("Note deleted successfully");
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err?.message ?? "Failed to delete note");
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