import instance from "@/config/axiosConfig";
import { ReturnResult } from "@/types/common/return-result";
import { UploadImageResponse } from "@/types/image/uploadImageResponse";

const imageService = {
    uploadImage: async (file: File): Promise<UploadImageResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await instance.post<ReturnResult<UploadImageResponse>>(
            "/Image",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data.result;
    },

    uploadQuestionImage: async (file: File): Promise<UploadImageResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await instance.post<ReturnResult<UploadImageResponse>>(
            "/Image/Question",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data.result;
    },
};

export default imageService;
