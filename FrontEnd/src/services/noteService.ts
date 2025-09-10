import instance from '@/config/axiosConfig';
import { Note } from '@/types/notes';
import { PagedData } from '@/types/common/paged-data';
import { ReturnResult } from '@/types/common/return-result';

const noteService = {
    async getNotes(): Promise<Note[]> {
        const { data } = await instance.get<ReturnResult<PagedData<Note, string>>>('/ViewNote.json');
        return data.result.data;
    }
};

export default noteService;