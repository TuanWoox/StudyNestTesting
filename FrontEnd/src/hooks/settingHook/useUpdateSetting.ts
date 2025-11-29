import settingService from "@/services/settingService";
import { SettingDTO } from "@/types/setting/settingDTO";
import { UpdateSettingDTO } from "@/types/setting/updateSettingDTO";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateSetting = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<SettingDTO, AxiosError, UpdateSettingDTO>({
        mutationKey: ["updateSetting"],
        mutationFn: async (payload) => {
            const res = await settingService.updateSetting(payload);
            return res;
        },
        onSuccess: (res) => {
            if (res) {
                queryClient.invalidateQueries({ queryKey: ["settings"] });

                toast.success("Setting successfully updated!");
            }
        },
        onError: (err) => {
            console.log("err", err);
        },
    });

    return {
        updateSetting: mutation.mutate,
        updateSettingAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useUpdateSetting;