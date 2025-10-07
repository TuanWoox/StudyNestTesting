import noteService from "@/services/noteService"
import { Note } from "@/types/note/notes"
import { useQuery } from "@tanstack/react-query"

const useGetNoteDetail = (
    noteId: string,
    options?: { enabled?: boolean }
) => {
    const enabled = options?.enabled ?? !!noteId;

    return useQuery<Note>({
        queryKey: ["note", noteId],
        enabled,
        queryFn: () => noteService.getNoteDetail(noteId)
    });
};

export default useGetNoteDetail;