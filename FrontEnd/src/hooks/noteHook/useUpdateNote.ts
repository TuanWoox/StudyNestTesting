import noteService from "@/services/noteService";
import { Note, UpdateNoteDTO } from "@/types/note/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateNote = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<Note, AxiosError, UpdateNoteDTO>({
        mutationKey: ["updateNote"],
        mutationFn: (payload) => noteService.updateNote(payload),
        onSuccess: (res) => {
            if (res) {
                queryClient.invalidateQueries({ queryKey: ["notes"] });
                queryClient.invalidateQueries({ queryKey: ["folders"] });
                queryClient.invalidateQueries({ queryKey: ["tags"] });

                toast.success("Note successfully updated!");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        updateNote: mutation.mutate,
        updateNoteAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useUpdateNote;