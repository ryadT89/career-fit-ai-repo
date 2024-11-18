'use client'

import { api } from "@/trpc/react";
import { useState } from "react";

interface ApplyModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    setApplied: (val:boolean) => void;
    jobListingId: number;
    candidateId: number;
}

export function ApplyModal({ modalRef, setApplied, jobListingId, candidateId }: ApplyModalProps) {
    
    const applyJobListing = api.application.createApplication.useMutation({
        onSuccess: () => {
            console.log("Application Created");
            setApplied(true);
            modalRef.current?.close();
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const [ coverLetter, setCoverLetter ] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCoverLetter(e.target.value);
    }


    const apply = () => {
        applyJobListing.mutate({
            jobListingId: jobListingId,
            candidateId: candidateId,
            status: "applied",
            coverLetter: coverLetter,
        });
    }

    return (
        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                <div className="modal-header mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold ">Apply for this job</h1>
                            Write a cover-letter for the recruiter
                        </div>
                        <button onClick={apply} className="btn bg-info rounded-full text-white">Apply</button>
                    </div>
                </div>
                <div className="modal-body">
                    <textarea onChange={handleChange} name="coverLetter" className="textarea h-24 min-h-60 textarea-bordered w-full" placeholder="Write your cover letter here..."></textarea>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}