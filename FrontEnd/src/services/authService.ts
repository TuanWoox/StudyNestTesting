import instance from "@/config/axiosConfig";
import { UserLogin } from "@/types/auth/UserLogin";
import { UserRegister } from "@/types/auth/userRegister";
import { ReturnResult } from "@/types/common/return-result";

const authService = {
    login: async (userLogin: UserLogin) => {
        const { data } = await instance.post<ReturnResult<string>>('/Auth/Login', userLogin)
        return data;
    },
    register: async (userRegister: UserRegister) => {
        const { data } = await instance.post<ReturnResult<string>>('/Auth/Register', userRegister)
        return data;
    },
    validateToken: async () => {
        const { data } = await instance.get<ReturnResult<boolean>>('/Auth/ValidateToken');
        return data;
    }
}

export default authService;