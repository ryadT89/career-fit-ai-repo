'use client'

import { useState } from 'react';
import { Error } from '@/app/_components/global/error';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAuth from '../../global/useAuth';

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
    const { isAuthenticated, user } = useAuth();

    const handleChange = (e: any) => {
        setError('');
        setRecruiterData({
            ...recruiterData,
            [e.target.name]: e.target.value
        });
    }

    const router = useRouter();

    const handleSubmit = async () => {

        if (recruiterData.company === '' || recruiterData.sector === '') {
            setError('Required fields are missing');
            return;
        }

        if (!isAuthenticated) {
            setError('You must be logged in to complete this action');
            return;
        }

        await axios.put(`http://localhost:8000/user/${user.id}`, {
            user_type: 'Recruiter'
        }).catch((error) => {
            setError(error.response.data.details ?? "An error occurred");
            return;
        });

        await axios.post(`http://localhost:8000/recruiter`, {
            userId: user.id,
            company: recruiterData.company,
            website: recruiterData.website,
            sector: recruiterData.sector,
            description: recruiterData.description
        }).then(() => {
            router.push('/recruiter/my-offers');
        }).catch((error) => {
            setError(error.response.data.details ?? "An error occurred");
            return;
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