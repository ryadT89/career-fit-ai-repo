'use client'

import { useState } from 'react';
import { Error } from '@/app/_components/global/error';
import { useRouter } from 'next/navigation';
import useAuth from '../../global/useAuth';
import axios from 'axios';

interface CandidateData {
    skills: string;
    experience: number;
    location: string;
    interestSectors: string;
}

export function CandidateForm() {

    const [candidateData, setCandidateData] = useState<CandidateData>({
        skills: '',
        experience: 0,
        location: '',
        interestSectors: ''
    });
    const [error, setError] = useState<string>('');
    const { isAuthenticated, user } = useAuth();


    const handleChange = (e: any) => {
        setError('');
        if (e.target.name === 'experience') {
            setCandidateData({
                ...candidateData,
                [e.target.name]: parseInt(e.target.value)
            });
            return;
        }

        setCandidateData({
            ...candidateData,
            [e.target.name]: e.target.value
        });
    }

    const router = useRouter();

    const handleSubmit = async () => {
        if (!candidateData.skills || !candidateData.experience || !candidateData.location) {
            setError('All fields are required');
            return;
        }

        if (!isAuthenticated) {
            setError('You must be logged in to complete this action');
            return;
        }

        await axios.put(`http://localhost:8000/user/${user.id}`, {
            user_type: 'Candidate'
        }).catch((error) => {

            setError(error.response.data.details ?? "An error occurred");
            return;
        });


        await axios.post("http://localhost:8000/candidate/", {
            userId: user.id,
            skills: candidateData.skills,
            experience: candidateData.experience,
            location: candidateData.location,
            interestSectors: candidateData.interestSectors
        }).then(() => {
            router.push('/candidate/job-offers');
        }).catch((error) => {
            setError(error.response.data.details ?? "An error occurred");
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <input type="text" onChange={handleChange} name="skills" placeholder="*Skills" className="input input-bordered w-full" />
            <input type="number" onChange={handleChange} name='experience' placeholder="*Years of Experience" className="input input-bordered w-full" />
            <input type="text" onChange={handleChange} name="location" placeholder="*Location" className="input input-bordered w-full" />
            <input type="text" onChange={handleChange} name="interestSectors" placeholder="Sectors of Interest" className="input input-bordered w-full" />
            {error && <Error message={error} />}
            <button onClick={handleSubmit} className="btn bg-base-content text-white">Complete</button>
        </div>
    )
}