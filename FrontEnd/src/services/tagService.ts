import instance from '@/config/axiosConfig';
import { Tag } from '@/types/notes';
import { ReturnResult } from '@/types/common/return-result';
import { PagedData } from '@/types/common/paged-data';

const tagService = {
    async getTags(): Promise<Tag[]> {
        const { data } = await instance.get<ReturnResult<PagedData<Tag, string>>>('/ViewTag.json');
        return data.result.data;
    }
};

export default tagService;