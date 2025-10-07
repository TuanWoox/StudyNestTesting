import noteService from "@/services/noteService";
import { CreateNoteDTO, Note } from "@/types/note/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateNote = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<Note, AxiosError, CreateNoteDTO>({
        mutationKey: ["createNote"],
        mutationFn: (payload) => noteService.createNote(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            queryClient.invalidateQueries({ queryKey: ["tags"] });

            toast.success("Note successfully created!");
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err?.message ?? "Failed to create new note");
        },
    });

    return {
        createNote: mutation.mutate,
        createNoteAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useCreateNote;