'use client'

import { useRouter } from "next/navigation";
import useAuth from "./useAuth";
import useSignOut from "./useSignout";

export function Navbar() {

    const { isAuthenticated, user } = useAuth();
    const signOut = useSignOut();

    const router = useRouter();
    const redirectToProfile = () => {
        if (user.userType === 'Candidate') {
            router.push('/candidate/profile');
        } else if (user.userType === 'Recruiter') {
            router.push('/recruiter/profile');
        } else {
            router.push('/user/complete');
        }
    }

    return (
        <div className="fixed max-w-screen-xl navbar backdrop-blur-lg py-2 my-2 shadow-lg rounded-full z-20">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost rounded-full lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Details</a></li>
                        <li><a href="#">Team</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <a href="/" className="btn btn-ghost rounded-full text-xl">CareerFit AI</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">Details</a></li>
                    <li><a href="#">Team</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>
            {isAuthenticated ? (
                <div className="navbar-end">
                    <a onClick={redirectToProfile} className="btn btn-ghost rounded-full">Profile</a>
                    <a className="btn bg-base-content text-white rounded-full" onClick={signOut} >SignOut</a>
                </div>
            ) : (
                <div className="navbar-end">
                    <a href="/user/signin" className="btn btn-ghost rounded-full">SignIn</a>
                    <a href="/user/register" className="btn bg-base-content text-white rounded-full">Register</a>
                </div>
            )
            }
        </div>
    )
}