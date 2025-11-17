import { ERole } from "@/utils/enums/ERole";
import useValidateToken from "./useValidateToken";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useReduxSelector } from "../reduxHook/useReduxSelector";
import { initAuthState, selectRole } from "@/store/authSlice";
import { useDispatch } from "react-redux";

interface DecodedToken {
    nameid: string;
    role: string;
    exp?: number;
    iat?: number;
}

const useLayoutValidateToken = (roleLayout: ERole) => {
    const navigate = useNavigate();
    const { data: validatingResult, isLoading, refetch } = useValidateToken({ enabled: false });
    const dispatch = useDispatch();
    const roleFromRedux = useReduxSelector(selectRole); // This is only sets when user register or login

    useEffect(() => {

        const checkTokenAccess = async () => {
            const accessToken = window.localStorage.getItem("accessToken");
            if (!accessToken) {
                return navigate('/login')
            }
            const { role: roleFromAccessToken }: DecodedToken = jwtDecode(accessToken);
            // We will take the role either from:
            // 1) login/register success response, or
            // 2) the accessToken, if the user later accesses the page via a link.
            const role = roleFromRedux || roleFromAccessToken || "";
            if (role === roleLayout) {
                refetch();
            }
            else {
                switch (role) {
                    case ERole.Admin:
                        return navigate("/admin")
                    case ERole.User:
                        return navigate("/user")
                    default:
                        return navigate('/login')
                }
            }
        }

        checkTokenAccess();

    }, [navigate, roleLayout, refetch, roleFromRedux])

    useEffect(() => {

        const checkValidatingResult = async () => {
            if (validatingResult) {
                if (!validatingResult.result) return navigate('/login');
                const accessToken = window.localStorage.getItem("accessToken");
                if (accessToken) {
                    dispatch(initAuthState(accessToken));
                }
            }
        }
        checkValidatingResult();

    }, [navigate, validatingResult, dispatch])

    return {
        isLoading
    }
}

export default useLayoutValidateToken;