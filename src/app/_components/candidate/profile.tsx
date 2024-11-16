'use client'

import { useSession } from "next-auth/react"
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Error } from "../global/error";
import { Success } from "../global/success";
import { ProfileInput } from "./profile-input";

export function Profile() {
    const { data: session } = useSession();

    const candidateData: { data: any } = api.candidate.getCandidateProfileById.useQuery({
        userId: session?.user.id ? session?.user.id : ''
    });
    const [candidateProfile, setCandidateProfile] = useState(candidateData.data || null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        setCandidateProfile(candidateData.data);
    }, [candidateData.data]);

    const userUpdateMutation = api.user.updateUser.useMutation({
        onSuccess: () => {
            console.log("User Type Updated");
            setSuccess(true);
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const candidateUpdateMutation = api.candidate.updateCandidateProfile.useMutation({
        onSuccess: () => {
            console.log("Candidate Profile Updated");
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
            if (candidateProfile && candidateProfile.user) {
                setCandidateProfile({
                    ...candidateProfile,
                    user: {
                        ...candidateProfile.user,
                        [e.target.name]: e.target.value
                    }
                });
            }
        } else {

            if (candidateProfile) {

                if (e.target.name === "experience") {
                    setCandidateProfile({
                        ...candidateProfile,
                        [e.target.name]: parseInt(e.target.value)
                    });
                    return;
                }

                setCandidateProfile({
                    ...candidateProfile,
                    [e.target.name]: e.target.value
                });
            }
        }
    }

    const handleSubmit = async () => {
        console.log(candidateProfile);
        if (candidateProfile?.user.name === '' || candidateProfile?.user.email === '' || candidateProfile?.company === '' || candidateProfile?.sector === '') {
            setError('Required fields are missing');
            return;
        }

        delete candidateProfile.user.password;

        if (candidateProfile) {
            userUpdateMutation.mutate({ ...candidateProfile.user });
            candidateUpdateMutation.mutate({ ...candidateProfile });
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
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.user.name} placeholder="Name" name="name" />
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.user.email} placeholder="Email" name="email" />
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.skills} placeholder="Skills" name="skills" />
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.experience || ''} placeholder="Experience" name="experience" />
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.location} placeholder="Location" name="location" />
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.interestSectors} placeholder="Interest Sectors" name="interestSectors" />
                        {success && <Success message="Profile Updated" />}
                        {error && <Error message={error} />}
                        <button onClick={handleSubmit} className="btn bg-base-content text-white">Update</button>
                    </div>
                </div>
            </div>
        </>
    )
}