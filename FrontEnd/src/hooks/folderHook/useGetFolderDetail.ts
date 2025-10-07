import folderService from "@/services/folderService"
import { Folder } from "@/types/note/notes"
import { useQuery } from "@tanstack/react-query"

const useGetFolderDetail = (
    folderId: string,
    options?: { enabled?: boolean }
) => {
    const enabled = options?.enabled ?? !!folderId;

    return useQuery<Folder>({
        queryKey: ["folder", folderId],
        enabled,
        queryFn: () => folderService.getFolderDetail(folderId),
    });
};

export default useGetFolderDetail;