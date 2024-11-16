'use client'

import { useState } from 'react';
import { api } from "@/trpc/react";
import { useSession } from 'next-auth/react';
import { Error } from '@/app/_components/global/error';
import { useRouter } from 'next/navigation';

interface RecruiterData {
    company: string;
    website: string;
    sector: string;
    description: string;
}

export const RecruiterForm = () => {

    const [recruiterData, setRecruiterData] = useState<RecruiterData>({
        company: '',
        website: '',
        sector: '',
        description: ''
    })

    const [error, setError] = useState<string>('');

    const handleChange = (e: any) => {
        setError('');
        setRecruiterData({
            ...recruiterData,
            [e.target.name]: e.target.value
        });
    }

    const router = useRouter();
    const recruiterMutation = api.recruiter.createRecruiterProfile.useMutation({
        onSuccess: () => {
            console.log("Recruiter Profile Created");
            router.push('/');
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
        console.log(recruiterData);
        if (recruiterData.company === '' || recruiterData.sector === '') {
            setError('Required fields are missing');
            return;
        }

        if (!session) {
            setError('You must be logged in to complete this action');
            return;
        }

        userMutation.mutate({
            id: session.user.id,
            userType: 'Recruiter'
        });

        recruiterMutation.mutate({
            userId: session.user.id,
            company: recruiterData.company,
            website: recruiterData.website,
            sector: recruiterData.sector,
            description: recruiterData.description
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <input type="text" onChange={handleChange} name="company" placeholder="*Company" className="input input-bordered w-full" />
            <input type="text" onChange={handleChange} name="website" placeholder="Website url" className="input input-bordered w-full" />
            <input type="text" onChange={handleChange} name="sector" placeholder="*Sector" className="input input-bordered w-full" />
            <input type="text" onChange={handleChange} name="description" placeholder="Description" className="input input-bordered w-full" />
            {error && <Error message={error} />}
            <button onClick={handleSubmit} className="btn bg-base-content text-white">Complete</button>
        </div>
    )
}