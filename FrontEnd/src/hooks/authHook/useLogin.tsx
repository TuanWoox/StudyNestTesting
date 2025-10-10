import userService from "@/services/userService";
import { UserLogin } from "@/types/auth/UserLogin";
import { useMutation } from "@tanstack/react-query";
import { useReduxDispatch } from "../reduxHook/useReduxDispatch";
import { initAuthState, selectRole } from "@/store/authSlice";
import { useReduxSelector } from "../reduxHook/useReduxSelector";
import { ERole } from "@/utils/enums/ERole";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const dispatch = useReduxDispatch();
    const role = useReduxSelector(selectRole);
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: (userLogin: UserLogin) => userService.login(userLogin),
        onSuccess: (data) => {
            if (data.result) {
                dispatch(initAuthState(data.result));
                window.localStorage.setItem('accessToken', data.result);
                switch (role) {
                    case ERole.User:
                        navigate("/user/notes");
                        break;
                    case ERole.Admin:
                        navigate("/admin/dashboard");
                        break;
                }
            }
        }
    })
    return {
        login: mutation.mutate,
        isAuthenticating: mutation.isPending,
        authenError: mutation.error,
    }
}

export default useLogin;