'use client'

import React, { useState} from 'react';
import { CandidateForm } from "./candidate-form";
import { RecruiterForm } from "./recruiter-form";

export const CompleteForm = () => {

    const [showCandidateForm, setShowCandidateForm] = useState(true);

    const toggleForm = (formType: string) => {
        if (formType === 'candidate') {
            setShowCandidateForm(true);
        } else {
            setShowCandidateForm(false);
        }
    }

    return (
        <div className="sm:flex sm:flex-row mx-0 justify-center">
            <div className="p-12 drop-shadow-md bg-base-100 mx-auto rounded-2xl w-100 text-center">
                <div className="mb-4">
                    <h3 className="font-semibold text-2xl">Register</h3>
                    <p>Complete your information.</p>
                </div>
                <div className="space-y-5"></div>
                <div className="flex gap-2">
                    <div onClick={() => toggleForm('candidate')} className="w-full border-2 rounded-xl p-2 place-content-center place-items-center cursor-pointer hover:bg-base-200">
                        <img src="/job-seeker.png" className="w-1/2" alt="Job Seeker" />
                        <div className="m-4 text-xl font-bold">Candidate</div>
                    </div>
                    <div onClick={() => toggleForm('recruiter')} className="w-full border-2 rounded-xl p-2 place-content-center place-items-center cursor-pointer hover:bg-base-200">
                        <img src="/recruiter.png" className="w-1/2" alt="Recruiter" />
                        <div className="m-4 text-xl font-bold"> Recruiter </div>
                    </div>
                </div>
                <div className="mt-4">
                {showCandidateForm ? <CandidateForm /> : <RecruiterForm />}
                </div>
            </div>
        </div>
    )
};