import { SortOrderType } from "@/constants/sortOrderType";
import noteService from "@/services/noteService";
import { Page } from "@/types/common/page";
import { PagedData } from "@/types/common/paged-data";
import { Note } from "@/types/note/notes";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UseGetAllNoteOptions {
    enabled?: boolean;
    sortByNewest?: boolean;
    pageSize?: number;
    pageNumber?: number;
}

const useGetAllNote = (options?: UseGetAllNoteOptions) => {
    const enabled = options?.enabled ?? true;
    const sortByNewest = options?.sortByNewest ?? true;
    const pageSize = options?.pageSize ?? -1; // để lấy tất cả tag
    const pageNumber = options?.pageNumber ?? 0;

    return useQuery<PagedData<Note, string>, AxiosError>({
        queryKey: ["notes", { pageNumber, pageSize, sortByNewest }],
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
                    ] : [],
                filter: [],
                selected: [],
            };

            return await noteService.getAllNote(payload);
        },
        gcTime: 10 * 60 * 1000,
    });
};

export default useGetAllNote;