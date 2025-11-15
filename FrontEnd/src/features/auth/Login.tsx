import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import useLogin from "@/hooks/authHook/useLogin";
import { useReduxSelector } from "@/hooks/reduxHook/useReduxSelector";
import { initAuthState, selectRole, selectUserId } from "@/store/authSlice";
import { ERole } from "@/utils/enums/ERole";
import GoogleLogin from "@/components/GoogleLogin/GoogleLogin";
import { useReduxDispatch } from "@/hooks/reduxHook/useReduxDispatch";
import { theme } from "antd";
import { selectDarkMode } from "@/store/themeSlice";

interface LoginFormInputs {
    username: string;
    password: string;
    rememberMe: boolean;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const darkMode = useReduxSelector(selectDarkMode);
    const { login, isAuthenticating } = useLogin();
    const role = useReduxSelector(selectRole);
    const dispatch = useReduxDispatch();
    const userId = useReduxSelector(selectUserId);
    const { token } = theme.useToken();

    const borderColor = `${token.colorPrimary}E0`; // 88% opacity
    const shadowColor = `${token.colorPrimary}55`; // 33% opacity
    const bgColor = `${token.colorBgLayout}`;
    const textColor = `${token.colorText}`;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormInputs>({
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false,
        },
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            window.localStorage.setItem("accessToken", token);
            dispatch(initAuthState(token));
        }
    }, [dispatch]);

    // Handle redirect if user reloads the page
    if (role) {
        const lastRoute = localStorage.getItem('lastRoute');
        const userIdLocal = localStorage.getItem('userId');
        //Only the same user can reload the page or move to that previous page when log in again
        if (lastRoute && userIdLocal === userId) {
            return <Navigate to={lastRoute} replace />;
        }

        switch (role) {
            case ERole.User:
                return <Navigate to="/user/notes" replace />;
            case ERole.Admin:
                return <Navigate to="/admin/dashboard" replace />;
        }
    }

    const onSubmit = (data: LoginFormInputs) => {
        login({
            userNameOrEmail: data.username,
            password: data.password,
            rememberMe: data.rememberMe,
        });
    };

    return (
        <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[50%] max-w-xl m-5 transition-all duration-300 ease-out">
            <button
                type="button"
                onClick={() => navigate("/homepage")}
                className="self-start mb-4 px-3 py-1 border text-sm sm:text-base hover:-translate-y-[2px] transition-all"
                style={{
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    boxShadow: `3px 3px 0 ${shadowColor}`,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 600,
                    cursor: "pointer"
                }}
            >
                ← Back to Home
            </button>

            <div
                style={{
                    border: `1.5px solid ${borderColor}`,
                    boxShadow: `6px 6px 0 ${shadowColor}`,
                    backgroundColor: bgColor,
                    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                }}
            >
                <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 py-6">
                    {/* Title */}
                    <div
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5"
                        style={{
                            color: token.colorPrimary,
                            textShadow: `2px 2px 0 ${shadowColor}`,
                            letterSpacing: "1px",
                        }}
                    >
                        Study Nest
                    </div>

                    {/* Subtitle */}
                    <h2
                        className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-5"
                        style={{
                            color: textColor,
                            fontFamily: "'IBM Plex Mono', monospace",
                        }}
                    >
                        Sign in to your account
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 sm:space-y-7">
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-base sm:text-lg mb-2"
                                style={{
                                    color: textColor,
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }}
                            >
                                Username or Email
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username", {
                                    required: "Username or email is required",
                                    minLength: {
                                        value: 3,
                                        message: "Must be at least 3 characters",
                                    },
                                })}
                                placeholder="Enter your username or email"
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 outline-none font-mono ${errors.username
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border border-gray-300 focus:border-gray-900"
                                    }`}
                                style={{
                                    backgroundColor: darkMode ? "#1e1e1e" : "#fafafa",
                                    color: textColor,
                                    boxShadow: `4px 4px 0 ${shadowColor}`,
                                    border: `1.5px solid ${borderColor}`,
                                }}
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-base sm:text-lg mb-2"
                                style={{
                                    color: textColor,
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                placeholder="Enter your password"
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 outline-none font-mono ${errors.password
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border border-gray-300 focus:border-gray-900"
                                    }`}
                                style={{
                                    backgroundColor: darkMode ? "#1e1e1e" : "#fafafa",
                                    color: textColor,
                                    boxShadow: `4px 4px 0 ${shadowColor}`,
                                    border: `1.5px solid ${borderColor}`,
                                }}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                {...register("rememberMe")}
                                className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-1 focus:ring-gray-900"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="ml-2 text-sm sm:text-base"
                                style={{
                                    color: textColor,
                                    fontFamily: "'IBM Plex Mono', monospace",
                                }}
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!isValid || isAuthenticating}
                            className="w-full py-3 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[3px] hover:cursor-pointer"
                            style={{
                                color: token.colorText,
                                boxShadow: `4px 4px 0 ${shadowColor}`,
                                border: `1px solid ${borderColor}`,
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontWeight: 600
                            }}
                        >
                            {isAuthenticating ? <Spinner /> : "Login"}
                        </button>
                    </form>

                    {/* Google Login */}
                    <div className="my-7 w-full">
                        <GoogleLogin disable={isAuthenticating} />
                    </div>

                    {/* Links */}
                    <div
                        className="flex justify-between w-full text-sm sm:text-base"
                        style={{
                            color: textColor,
                            fontFamily: "'IBM Plex Mono', monospace",
                        }}
                    >
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </span>
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
