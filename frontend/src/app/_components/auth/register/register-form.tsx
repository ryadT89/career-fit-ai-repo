'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Error } from '@/app/_components/global/error';
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        // validate the password to contains at least 8 characters
        if (e.target.name === "password" && e.target.value.length < 8) {
            setError("Password must contain at least 8 characters");
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (error) return;

        setLoading(true);

        await axios.post(
            "http://localhost:8000/auth/register",
            {
                fullname: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password
            }
        ).then((res) => {
            localStorage.setItem("authToken", res.data.access_token);
            router.push("/user/complete");
            setLoading(false);
        }).catch((err) => {
            setError(err.response.data.detail ?? err.response);
            setLoading(false);
        });
    };


    return (
        <div className="sm:flex sm:flex-row mx-0 justify-center">
            <div className="p-12 drop-shadow-md bg-base-100 mx-auto rounded-2xl w-100 text-center">
                <div className="mb-4">
                    <h3 className="font-semibold text-2xl">Register</h3>
                    <p>Enter your information to register your account.</p>
                </div>
                <div className="space-y-5">
                    <div>
                        {/* Sign in with credentials */}
                        {error && <Error message={error} />}
                        <form className="space-y-4 my-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                className="input input-bordered w-full"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className="input input-bordered w-full"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Name"
                                className="input input-bordered w-full"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="input input-bordered w-full"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="btn bg-base-content text-white w-full">{loading ? <span className="loading loading-spinner loading-md"></span> : 'Submit'}</button>
                        </form>
                    </div>
                </div>
                <div className="pt-5 text-center text-gray-400 text-xs">
                    <span className="flex gap-1 justify-center">
                        Copyright © 2024-2025
                        <a
                            href="#"
                        >
                            CareerFit AI
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};