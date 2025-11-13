// import { StudyNestFilterType } from "@/constants/filterType";
// import { SortOrderType } from "@/constants/sortOrderType";
// import noteService from "@/services/noteService";
// import { Page } from "@/types/common/page";
// import { PagedData } from "@/types/common/paged-data";
// import { Note } from "@/types/note/notes";
// import { useQuery } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// interface UseGetAllNoteOptions {
//     enabled?: boolean;
//     sortByNewest?: boolean;
//     pageSize?: number;
//     pageNumber?: number;
//     searchTerm?: string;
//     folderId?: string | null;
//     tagIds?: string[]; // array of tag ids
// }

// const useGetAllNote = (options?: UseGetAllNoteOptions) => {
//     const enabled = options?.enabled ?? true;
//     const sortByNewest = options?.sortByNewest ?? true;
//     const pageSize = options?.pageSize ?? 5; // -1 để lấy tất cả note
//     const pageNumber = options?.pageNumber ?? 0;
//     const searchTerm = options?.searchTerm ?? "";
//     const folderId = options?.folderId;
//     const tagIds = options?.tagIds ?? [];

//     return useQuery<PagedData<Note, string>, AxiosError>({
//         queryKey: ["notes", { pageNumber, pageSize, sortByNewest, searchTerm, folderId, tagIds }],
//         enabled,
//         queryFn: async () => {
//             const filter: any[] = [];

//             if (searchTerm) {
//                 filter.push({
//                     prop: "title",
//                     value: searchTerm,
//                     filterOperator: "Contains",
//                     filterType: StudyNestFilterType.Text,
//                     dynamicProperty: "",
//                     delimiter: "",
//                 });
//             }

//             if (folderId) {
//                 filter.push({
//                     prop: "folderId",
//                     value: folderId,
//                     filterOperator: "IsEqualTo",
//                     filterType: StudyNestFilterType.Text,
//                     dynamicProperty: "",
//                     delimiter: "",
//                 });
//             }

//             // Add tag filters (one per selected tag) - backend must support these props or be adapted.
//             if (tagIds.length > 0) {
//                 tagIds.forEach((t) =>
//                     filter.push({
//                         prop: "noteTags.tagId",
//                         value: t,
//                         filterOperator: "IsEqualTo",
//                         filterType: StudyNestFilterType.Text,
//                         dynamicProperty: "",
//                         delimiter: "",
//                     })
//                 );
//             }

//             const payload: Page<string> = {
//                 size: pageSize,
//                 pageNumber: pageNumber,
//                 totalElements: 0,
//                 orders: sortByNewest
//                     ? [
//                         {
//                             sort: "dateCreated",
//                             sortDir: SortOrderType.DESC,
//                             dynamicProperty: "",
//                             delimiter: "",
//                             dataType: "",
//                         },
//                     ] : [],
//                 // filter: searchTerm
//                 //     ?
//                 //     [{
//                 //         prop: "title",
//                 //         value: searchTerm,
//                 //         filterOperator: "Contains",
//                 //         filterType: StudyNestFilterType.Text,
//                 //         dynamicProperty: "",
//                 //         delimiter: "",
//                 //     },]
//                 //     : [],
//                 filter,
//                 selected: [],
//             };

//             return await noteService.getAllNote(payload);
//         },
//         gcTime: 10 * 60 * 1000,
//     });
// };

// export default useGetAllNote;

import { StudyNestFilterType } from "@/constants/filterType";
import { SortOrderType } from "@/constants/sortOrderType";
import noteService from "@/services/noteService";
import { Page } from "@/types/common/page";
import { PagedData } from "@/types/common/paged-data";
import { Note } from "@/types/note/notes";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";

interface UseGetAllNoteOptions {
    enabled?: boolean;
    pageSize?: number;
    pageNumber?: number;
    searchTerm?: string;
    sortField?: "dateCreated" | "dateModified" | "title";
    sortDir?: SortOrderType.ASC | SortOrderType.DESC;
    createdRange?: [Dayjs | null, Dayjs | null];
    modifiedRange?: [Dayjs | null, Dayjs | null];
}

const useGetAllNote = (options?: UseGetAllNoteOptions) => {
    const enabled = options?.enabled ?? true;
    const pageSize = options?.pageSize ?? 10;
    const pageNumber = options?.pageNumber ?? 0;
    const searchTerm = options?.searchTerm ?? "";
    const sortField = options?.sortField ?? "dateCreated";
    const sortDir = options?.sortDir ?? SortOrderType.DESC;
    const createdRange = options?.createdRange;
    const modifiedRange = options?.modifiedRange;

    return useQuery<PagedData<Note, string>, AxiosError>({
        queryKey: ["notes",
            { pageNumber, pageSize, searchTerm, sortField, sortDir, createdRange, modifiedRange },
        ],
        enabled,
        queryFn: async () => {
            const filter: any[] = [];

            if (searchTerm) {
                filter.push({
                    prop: "title",
                    value: searchTerm,
                    filterOperator: "Contains",
                    filterType: StudyNestFilterType.Text,
                    dynamicProperty: "",
                    delimiter: "",
                });
            };

            // Filter by createdRange
            if (createdRange?.[0]) {
                filter.push({
                    prop: "dateCreated",
                    value: createdRange[0].startOf("day").toISOString(),
                    filterOperator: "IsAfterOrEqual",
                    filterType: StudyNestFilterType.DateTime,
                    dynamicProperty: "",
                    delimiter: "",
                });
            }
            if (createdRange?.[1]) {
                filter.push({
                    prop: "dateCreated",
                    value: createdRange[1].endOf("day").toISOString(),
                    filterOperator: "IsBeforeOrEqual",
                    filterType: StudyNestFilterType.DateTime,
                    dynamicProperty: "",
                    delimiter: "",
                });
            };

            // Filter by modifiedRange
            if (modifiedRange?.[0]) {
                filter.push({
                    prop: "dateModified",
                    value: modifiedRange[0].startOf("day").toISOString(),
                    filterOperator: "IsAfterOrEqual",
                    filterType: StudyNestFilterType.DateTime,
                    dynamicProperty: "",
                    delimiter: "",
                });
            }
            if (modifiedRange?.[1]) {
                filter.push({
                    prop: "dateModified",
                    value: modifiedRange[1].endOf("day").toISOString(),
                    filterOperator: "IsBeforeOrEqual",
                    filterType: StudyNestFilterType.DateTime,
                    dynamicProperty: "",
                    delimiter: "",
                });
            };

            const payload: Page<string> = {
                size: pageSize,
                pageNumber,
                totalElements: 0,
                orders: [
                    {
                        sort: sortField,
                        sortDir,
                        dynamicProperty: "",
                        delimiter: "",
                        dataType: "",
                    },
                ],
                filter,
                selected: [],
            };

            return await noteService.getAllNote(payload);
        },
        gcTime: 10 * 60 * 1000,
    });
};

export default useGetAllNote;
