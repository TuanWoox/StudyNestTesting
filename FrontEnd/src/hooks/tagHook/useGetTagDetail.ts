import tagService from "@/services/tagService"
import { Tag } from "@/types/note/notes"
import { useQuery } from "@tanstack/react-query"

const useGetTagDetail = (
    tagId: string,
    options?: { enabled?: boolean }
) => {
    const enabled = options?.enabled ?? !!tagId;

    return useQuery<Tag>({
        queryKey: ["tag", tagId],
        enabled,
        queryFn: () => tagService.getTagDetail(tagId),
    });
};

export default useGetTagDetail;