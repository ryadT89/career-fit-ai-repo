'use client'

import { useState } from 'react';
import { api } from "@/trpc/react";
import { useSession } from 'next-auth/react';
import { Error } from '@/app/_components/global/error';
import { useRouter } from 'next/navigation';

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
    const candidateMutation = api.candidate.createCandidateProfile.useMutation({
        onSuccess: () => {
            console.log("Candidate Profile Created");
            window.location.reload();
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const userMutation = api.user.updateUser.useMutation({
        onSuccess: () => {
            console.log("User Type Updated");
        },
        onError: (error: any) => {
            setError(error);
        }
    });

    const { data: session } = useSession();

    const handleSubmit = async () => {
        if (!candidateData.skills || !candidateData.experience || !candidateData.location) {
            setError('All fields are required');
            return;
        }

        if (!session) {
            setError('You must be logged in to complete this action');
            return;
        }

        userMutation.mutate({
            id: session.user.id,
            userType: 'Candidate'
        });

        candidateMutation.mutate({
            userId: session.user.id,
            skills: candidateData.skills,
            experience: candidateData.experience,
            location: candidateData.location,
            interestSectors: candidateData.interestSectors
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