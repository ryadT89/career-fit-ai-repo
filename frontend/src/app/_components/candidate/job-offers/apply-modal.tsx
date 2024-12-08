'use client'

import { useState, useEffect } from "react";
import axios from 'axios';
import { SiGoogleassistant } from "react-icons/si";

interface ApplyModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    setApplied: (val: boolean) => void;
    jobListingId: number;
    candidateId: number;
}

export function ApplyModal({ modalRef, setApplied, jobListingId, candidateId }: ApplyModalProps) {
    const [coverLetter, setCoverLetter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Handle changes in the cover letter textarea
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCoverLetter(e.target.value);
    };

    // Apply job listing with cover letter
    const applyJobListing = async () => {
        setLoading(true);
        await axios.post(`http://localhost:8000/application/`, {
            jobListingId: jobListingId,
            candidateId: candidateId,
            status: "applied",
            coverLetter: coverLetter, // Use the cover letter (whether manually entered or generated)
        }).then(() => {
            setApplied(true);
            modalRef.current?.close();
        }).catch((error) => {}).finally(() => {
            setLoading(false);
        });
    };

    // Generate a cover letter using the assistant API and fill it into the textarea
    const generateCoverLetter = async () => {
        setLoading(true);
        await axios.post('http://localhost:8000/assistant/cover-letter', {
            jobListing_id: jobListingId,
            candidate_id: candidateId,
        }).then((response) => {
            setCoverLetter(response.data.response);
        }).catch((error) => {}).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        // Optionally, auto-generate the cover letter when the modal is opened
        generateCoverLetter();
    }, [jobListingId, candidateId]);

    return (
        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                <div className="modal-header mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">Apply for this job</h1>
                            <p className="text-sm text-gray-500">Write or generate a cover letter for the recruiter</p>
                        </div>
                        <button onClick={applyJobListing} className="btn bg-info rounded-full text-white">
                            Apply
                        </button>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="modal-body relative">
                        <textarea
                            onChange={handleChange}
                            name="coverLetter"
                            className="textarea h-24 min-h-60 textarea-bordered w-full font-normal"
                            placeholder="Write your invite message here..."
                            value={coverLetter}
                        ></textarea>
                        <button
                            onClick={generateCoverLetter}
                            className="btn absolute mb-2 bottom-2 right-2 bg-neutral text-white rounded-full"
                            disabled={loading}
                        >
                            <SiGoogleassistant /> {loading ? 'Generating...' : 'Generate Cover Letter'}
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>Close</button>
            </form>
        </dialog>
    );
}
