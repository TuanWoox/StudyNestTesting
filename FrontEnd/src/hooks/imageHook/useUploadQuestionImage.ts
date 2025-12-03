import imageService from "@/services/imageService";
import { UploadImageResponse } from "@/types/image/uploadImageResponse";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useUploadQuestionImage = () => {
    return useMutation<UploadImageResponse, Error, File>({
        mutationFn: (file: File) => imageService.uploadQuestionImage(file),
        onSuccess: (data) => {
            if (data.success !== 1) {
                toast.error("Failed to upload image, please try again later");
            }
        },
    });
};

export default useUploadQuestionImage;
