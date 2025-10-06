import { CreateFolderDTO, Folder, UpdateFolderDTO } from '@/types/note/notes';
import instance from '@/config/axiosConfig';
import { PagedData } from '@/types/common/paged-data';
import { Page } from '@/types/common/page';
import { ReturnResult } from '@/types/common/return-result';

const folderService = {
    getAllFolder: async (
        payload: Page<string>
    ): Promise<PagedData<Folder, string>> => {
        const { data } = await instance.post<
            ReturnResult<PagedData<Folder, string>>
        >("/Folder/GetPaging", payload);
        return data.result;
    },

    createFolder: async (payload: CreateFolderDTO): Promise<Folder> => {
        const { data } = await instance.post<ReturnResult<Folder>>("/Folder", payload);
        return data.result;
    },

    updateFolder: async (payload: UpdateFolderDTO): Promise<Folder> => {
        const { data } = await instance.put<ReturnResult<Folder>>("/Folder", payload);
        return data.result;
    },

    deleteFolder: async (folderId: string): Promise<boolean> => {
        const { data } = await instance.delete<ReturnResult<boolean>>(`/Folder/${folderId}`);
        return data.result;
    },

    getFolderDetail: async (folderId: string): Promise<Folder> => {
        const { data } = await instance.get<ReturnResult<Folder>>(`/Folder/${folderId}`);
        return data.result;
    }
};

export default folderService;