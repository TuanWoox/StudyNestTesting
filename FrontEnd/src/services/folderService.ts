import { Folder } from '@/types/notes';
import instance from '@/config/axiosConfig';
import { PagedData } from '@/types/common/paged-data';
import { ReturnResult } from '@/types/common/return-result';

const folderService = {
    async getFolders(): Promise<Folder[]> {
        const { data } = await instance.get<ReturnResult<PagedData<Folder, string>>>('/ViewFolder.json');
        return data.result.data;
    }
};

export default folderService;