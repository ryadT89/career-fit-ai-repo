'use client'

import { useSession } from "next-auth/react"
import { api } from "@/trpc/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { Error } from "../../global/error";
import { Success } from "../../global/success";
import { ProfileInput } from "./profile-input";
import ProfilePictureUpload from "../../global/profile-picture-upload";

export function Profile() {
    const { data: session } = useSession();

    const {data: recruiterData, refetch: refetchUser} = api.recruiter.getRecuiterProfileById.useQuery({
        userId: session?.user.id ? session?.user.id : ''
    });
    const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        setRecruiterProfile(recruiterData);
    }, [recruiterData]);

    const userUpdateMutation = api.user.updateUser.useMutation({
        onSuccess: () => {
            console.log("User Type Updated");
            setSuccess(true);
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const recruiterUpdateMutation = api.recruiter.updateRecruiterProfile.useMutation({
        onSuccess: () => {
            console.log("Recruiter Profile Updated");
            setSuccess(true);
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const handleChange = (e: any) => {
        setError('');
        setSuccess(false);
        if (['name', 'email'].includes(e.target.name)) {
            if (recruiterProfile && recruiterProfile.user) {
                setRecruiterProfile({
                    ...recruiterProfile,
                    user: {
                        ...recruiterProfile.user,
                        [e.target.name]: e.target.value
                    }
                });
            }
        } else {
            if (recruiterProfile) {
                setRecruiterProfile({
                    ...recruiterProfile,
                    [e.target.name]: e.target.value
                });
            }
        }
    }

    const handleSubmit = async () => {
        console.log(recruiterProfile);
        if (recruiterProfile?.user.name === '' || recruiterProfile?.user.email === '' || recruiterProfile?.company === '' || recruiterProfile?.sector === '') {
            setError('Required fields are missing');
            return;
        }

        delete recruiterProfile.user.password;

        if (recruiterProfile) {
            userUpdateMutation.mutate({ ...recruiterProfile.user });
            recruiterUpdateMutation.mutate({ ...recruiterProfile });
        }
    }


    return (
        <>
            <div className='py-4 pb-8 font-bold text-3xl'>My Profile</div>
            <div className='overflow-y-scroll row-span-7'>
                <div className="shadow-md rounded-lg p-8 bg-white flex flex-col items-center text-center">
                    <div className="w-1/3">
                        <h1 className="text-2xl font-bold">Your Information</h1>
                        <p>Update your information below.</p>
                    </div>
                    <div className="w-2/4 flex flex-col gap-4 mt-8">
                        {success && <Success message="Profile Updated" />}
                        {error && <Error message={error} />}
                        <ProfilePictureUpload refetchUser={refetchUser} userId={session?.user.id || ''} userImage={recruiterProfile?.user.image || ''} />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.user.name} placeholder="Name" name="name" />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.user.email} placeholder="Email" name="email" />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.company} placeholder="Company" name="company" />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.website || ''} placeholder="Website" name="website" />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.sector} placeholder="Sector" name="sector" />
                        <div>
                            <div className="font-bold text-left mb-2">Description</div>
                            <textarea onChange={handleChange} defaultValue={recruiterProfile?.description || ''} className="textarea textarea-bordered w-full" placeholder="Description" name="description" />
                        </div>
                        <button onClick={handleSubmit} className="btn bg-base-content text-white">Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}