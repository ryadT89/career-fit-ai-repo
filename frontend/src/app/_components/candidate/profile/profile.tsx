'use client'

import { useEffect, useState } from "react";
import { Error } from "../../global/error";
import { Success } from "../../global/success";
import { ProfileInput } from "./profile-input";
import ProfilePictureUpload from "../../global/profile-picture-upload";
import axios from "axios";
import useAuth from "../../global/useAuth";
import { getProfilePicture } from "../../global/fileService";

export function Profile() {
    const { isAuthenticated, user, loading } = useAuth();

    const [candidateProfile, setCandidateProfile] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string>();

    const fetchCandidateData = async () => {
        await axios.get(`http://localhost:8000/candidate/userId/${user.id}`).then((response) => {
            const data = response.data.data[0];
            setCandidateProfile(data);
        }).catch((error) => { });
    }

    useEffect(() => {
        if (!loading) {
            fetchCandidateData();
            const loadImage = async () => {
                setProfileImage(await getProfilePicture(user.id));
            }
            loadImage();
        }
    }, [loading]);

    const updateUser = async (data: any) => {
        await axios.put(`http://localhost:8000/user/${user.id}`, data).then((response) => {
            setSuccess(true);
        }).catch((error) => { });
    }

    const updateCandidate = async (data: any) => {
        await axios.put(`http://localhost:8000/candidate/${candidateProfile.id}`, data).then((response) => {
            setSuccess(true);
        }).catch((error) => { });
    }

    const handleChange = (e: any) => {
        setError('');
        setSuccess(false);
        if (['fullname', 'email'].includes(e.target.name)) {
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

        if (candidateProfile?.user.fullname === '' || candidateProfile?.user.email === '' || candidateProfile?.skills === '' || candidateProfile?.experience === 0 || candidateProfile?.location === '' || candidateProfile?.interestSectors === '') {
            setError('Required fields are missing');
            return;
        }

        delete candidateProfile?.user.password;

        if (candidateProfile) {
            updateUser(candidateProfile.user);
            updateCandidate(candidateProfile);
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
                        <ProfilePictureUpload refetchUser={fetchCandidateData} userId={user.id || ''} userImage={profileImage || ''} />
                        <ProfileInput onChange={handleChange} defaultValue={candidateProfile?.user.fullname} placeholder="Name" name="fullname" />
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