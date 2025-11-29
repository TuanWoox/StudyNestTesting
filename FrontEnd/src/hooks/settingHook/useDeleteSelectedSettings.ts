import settingService from "@/services/settingService";
import { Page } from "@/types/common/page";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteSelectedSettings = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<number, AxiosError, Page<string>>({
        mutationKey: ["deleteSettings"],
        mutationFn: (payload) => settingService.deleteSettings(payload),
        onSuccess: (deletedCount) => {
            if (deletedCount > 0) {
                queryClient.invalidateQueries({ queryKey: ["settings"] });
                toast.success(`${deletedCount} setting(s) deleted successfully`);
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        deleteSettings: mutation.mutate,
        deleteSettingsAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

export default useDeleteSelectedSettings;