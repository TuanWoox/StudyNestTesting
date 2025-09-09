import { useQuery } from '@tanstack/react-query';
import folderService from '@/services/folderService';

export const useFolders = () => {
    return useQuery({
        queryKey: ['folders'],
        queryFn: folderService.getFolders
    });
};