'use client'

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Error } from "@/app/_components/global/error";
import axios from 'axios';

export function SigninForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState({ email: '', password: '' });

    const router = useRouter();

    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.name === 'password' && e.target.value.length < 8) {
            setError('Password must contain at least 8 characters');
        }

        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (error) return;

        setLoading(true);

        await axios.post("http://localhost:8000/auth/login", {
            email: userData.email,
            password: userData.password
        }).then((res) => {
            localStorage.setItem("authToken", res.data.access_token);
            window.location.reload();
            setLoading(false);
        }).catch((err) => {
            setError(err.response.data.detail ?? err.response);
            setLoading(false);
        });
    }

    return (
        <div className="p-4 drop-shadow-md bg-base-100 mx-auto rounded-2xl w-100 text-center">
            <div className="mb-10">
                <h3 className="font-semibold text-2xl">Sign In</h3>
                <p>Please sign in to your account.</p>
            </div>
            {error && <Error message={error} />}
            <div className="space-y-5">
                <div>
                    <form className="space-y-4 my-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                            value={userData.email}
                            onChange={handleFormDataChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                            value={userData.password}
                            onChange={handleFormDataChange}
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
                        CarreerFit AI
                    </a>
                </span>
            </div>
        </div>
    )
}