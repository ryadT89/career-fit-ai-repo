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

    const { user, loading } = useAuth();
    const [recruiterData, setRecruiterData] = useState<any>({});
    const [profileImage, setProfileImage] = useState<string>();

    const getRecruiter = async () => {
        await axios.get(`http://localhost:8000/recruiter/userId/${user.id}`).then((response) => {
            const data = response.data.data[0];
            setRecruiterData(data);
        }).catch((error) => {});
    }

    useEffect(() => {
        if(!loading) {
            getRecruiter();
            const loadImage = async () => {
                setProfileImage(await getProfilePicture(user.id));
            }
            loadImage();
        }
    }, [loading]);

    const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        setRecruiterProfile(recruiterData);
    }, [recruiterData]);

    const userUpdate = async (data: any) => {
        await axios.put(`http://localhost:8000/user/${user.id}`, data).then(() => {
            setSuccess(true);
        }).catch((error) => {
            setError(error.response.data.details ?? "An error occurred");
        });
    }

    const recruiterUpdate = async (data: any) => {
        await axios.put(`http://localhost:8000/recruiter/${data.id}`, data).then(() => {
            setSuccess(true);
        }).catch((error) => {
            setError(error.response.data.details ?? "An error occurred");
        });
    }

    const handleChange = (e: any) => {
        setError('');
        setSuccess(false);
        if (['fullname', 'email'].includes(e.target.name)) {
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
        if (recruiterProfile?.user.fullname === '' || recruiterProfile?.user.email === '' || recruiterProfile?.company === '' || recruiterProfile?.sector === '') {
            setError('Required fields are missing');
            return;
        }

        delete recruiterProfile.user.password;

        if (recruiterProfile) {
            userUpdate(recruiterProfile.user);
            recruiterUpdate(recruiterProfile);
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
                        <ProfilePictureUpload refetchUser={getRecruiter} userId={user.id || ''} userImage={profileImage || ''} />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.user?.fullname} placeholder="Full Name" name="fullname" />
                        <ProfileInput onChange={handleChange} defaultValue={recruiterProfile?.user?.email} placeholder="Email" name="email" />
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