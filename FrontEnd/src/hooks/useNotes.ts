import { useQuery } from '@tanstack/react-query';
import noteService from '@/services/noteService';

export const useNotes = () => {
    return useQuery({
        queryKey: ['notes'],
        queryFn: noteService.getNotes
    });
};