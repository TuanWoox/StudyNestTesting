import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Spinner from '@/components/Spinner/Spinner';
import useRegister from '@/hooks/authHook/useRegister';
import { useReduxSelector } from '@/hooks/reduxHook/useReduxSelector';
import { selectRole } from '@/store/authSlice';
import { ERole } from '@/utils/enums/ERole';

interface RegisterFormInputs {
    email: string;
    username: string;
    fullName: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { registerFn, isRegistering } = useRegister();
    const role = useReduxSelector(selectRole);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid }
    } = useForm<RegisterFormInputs>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            username: '',
            fullName: '',
            password: '',
            confirmPassword: ''
        }
    });

    // Handle role-based redirects
    switch (role) {
        case ERole.User:
            return <Navigate to="/user/notes" replace />
        case ERole.Admin:
            return <Navigate to="/admin/dashboard" replace />
    }

    const onSubmit = (data: RegisterFormInputs) => {
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        registerFn({ userName: data.username, fullName: data.fullName, password: data.password, email: data.email });
    };

    return (
        <div className="w-full max-w-xl rounded-lg bg-white p-12 shadow-xl border border-gray-200">
            <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-gray-900 text-center mb-10">
                    Study Nest
                </div>

                <h2 className="text-2xl font-medium text-gray-600 text-center mb-10">
                    Create your account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-7">

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white text-gray-900 transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register('username', {
                                required: 'Username is required',
                                minLength: {
                                    value: 3,
                                    message: 'Must be at least 3 characters'
                                }
                            })}
                            placeholder="Enter your username"
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white text-gray-900 transition ${errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-base font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            {...register('fullName', {
                                required: 'Full name is required'
                            })}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white text-gray-900 transition ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', {
                                required: 'Password is required',
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
                                    message:
                                        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character'
                                }
                            })}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white text-gray-900 transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-2">
                            Repeat Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === watch('password') || 'Passwords do not match'
                            })}
                            placeholder="Repeat your password"
                            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white text-gray-900 transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isValid || isRegistering}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isRegistering ? (
                            <Spinner />
                        ) : (
                            'Register'
                        )}
                    </button>

                    {/* Links */}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span
                            className="cursor-pointer hover:text-gray-900 transition"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
