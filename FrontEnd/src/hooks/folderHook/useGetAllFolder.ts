// src/hooks/useGetAllFolder.ts
import { useQuery } from "@tanstack/react-query";
import folderService from "@/services/folderService";
import { Page } from "@/types/common/page";
import { SortOrderType } from "@/constants/sortOrderType";
import { PagedData } from "@/types/common/paged-data";
import { Folder } from "@/types/note/notes";
import type { AxiosError } from "axios";

interface UseGetAllFolderOptions {
    enabled?: boolean;
    sortByNewest?: boolean;
    pageSize?: number;
    pageNumber?: number;
}

/**
 * Hook to fetch paginated folder list
 */
const useGetAllFolder = (options?: UseGetAllFolderOptions) => {
    const enabled = options?.enabled ?? true;
    const sortByNewest = options?.sortByNewest ?? true;
    const pageSize = options?.pageSize ?? -1; // 👈 -1 để lấy tất cả folder nếu muốn
    const pageNumber = options?.pageNumber ?? 0;

    return useQuery<PagedData<Folder, string>, AxiosError>({
        queryKey: ["folders", { pageNumber, pageSize, sortByNewest }],
        enabled,
        queryFn: async () => {
            const payload: Page<string> = {
                size: pageSize,
                pageNumber: pageNumber,
                totalElements: 0,
                orders: sortByNewest
                    ? [
                        {
                            sort: "dateCreated",
                            sortDir: SortOrderType.DESC,
                            dynamicProperty: "",
                            delimiter: "",
                            dataType: "",
                        },
                    ]
                    : [],
                filter: [],
                selected: [],
            };

            return await folderService.getAllFolder(payload);
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export default useGetAllFolder;
