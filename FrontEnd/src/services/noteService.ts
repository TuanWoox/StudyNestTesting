import instance from '@/config/axiosConfig';
import { CreateNoteDTO, Note, UpdateNoteDTO } from '@/types/note/notes';
import { PagedData } from '@/types/common/paged-data';
import { ReturnResult } from '@/types/common/return-result';
import { Page } from '@/types/common/page';

const noteService = {
    getAllNote: async (
        payload: Page<string>
    ): Promise<PagedData<Note, string>> => {
        const { data } = await instance.post<
            ReturnResult<PagedData<Note, string>>
        >("/Note/GetPaging", payload);
        return data.result;
    },

    getNoteDetail: async (noteId: string): Promise<Note> => {
        const { data } = await instance.get<ReturnResult<Note>>(`/Note/${noteId}`);
        return data.result;
    },

    createNote: async (payload: CreateNoteDTO): Promise<Note> => {
        const { data } = await instance.post<ReturnResult<Note>>("/Note", payload);
        return data.result;
    },

    deleteNote: async (noteId: string): Promise<boolean> => {
        const { data } = await instance.delete<ReturnResult<boolean>>(`/Note/${noteId}`);
        return data.result;
    },

    updateNote: async (payload: UpdateNoteDTO): Promise<Note> => {
        const { data } = await instance.put<ReturnResult<Note>>("/Note", payload);
        return data.result;
    },
};

export default noteService;