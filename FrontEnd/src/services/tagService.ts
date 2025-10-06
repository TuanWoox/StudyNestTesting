import instance from '@/config/axiosConfig';
import { CreateTagDTO, Tag, UpdateTagDTO } from '@/types/note/notes';
import { ReturnResult } from '@/types/common/return-result';
import { PagedData } from '@/types/common/paged-data';
import { Page } from '@/types/common/page';

const tagService = {
    // async getTags(): Promise<Tag[]> {
    //     const { data } = await instance.get<ReturnResult<PagedData<Tag, string>>>('/ViewTag.json');
    //     return data.result.data;
    // }
    getAllTag: async (
        payload: Page<string>
    ): Promise<PagedData<Tag, string>> => {
        const { data } = await instance.post<
            ReturnResult<PagedData<Tag, string>>
        >("/Tag/GetOwnPaging", payload);
        return data.result;
    },

    getTagDetail: async (tagId: string): Promise<Tag> => {
        const { data } = await instance.get<ReturnResult<Tag>>(`/Tag/${tagId}`);
        return data.result;

    },

    createTag: async (payload: CreateTagDTO): Promise<Tag> => {
        const { data } = await instance.post<ReturnResult<Tag>>("/Tag", payload);
        return data.result;
    },

    deleteTag: async (tagId: string): Promise<boolean> => {
        const { data } = await instance.delete<ReturnResult<boolean>>(`/Tag/${tagId}`);
        return data.result;
    },

    updateTag: async (payload: UpdateTagDTO): Promise<Tag> => {
        const { data } = await instance.put<ReturnResult<Tag>>("/Tag", payload);
        return data.result;
    }
};

export default tagService;