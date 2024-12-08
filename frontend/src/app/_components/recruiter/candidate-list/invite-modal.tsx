'use client'

import { useEffect, useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import useAuth from "../../global/useAuth";
import axios from "axios";
import { SiGoogleassistant } from "react-icons/si";

interface ApplyModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    candidateId: number;
}

export function InviteModal({ modalRef, candidateId }: ApplyModalProps) {
    const { isAuthenticated, user, loading } = useAuth();
    const [recruiterData, setRecruiterData] = useState({} as any);
    const [message, setMessage] = useState<string>('');
    const [invitationSent, setInvitationSent] = useState<boolean>(false);

    // Fetch recruiter data
    const getRecruiter = async () => {
        await axios.get(`http://localhost:8000/recruiter/userId/${user.id}`)
            .then((response) => {
                const data = response.data.data[0];
                setRecruiterData(data);
            }).catch((error) => { console.error(error); });
    }

    useEffect(() => {
        if (!loading) {
            getRecruiter();
        }
    }, [loading]);

    // Handle textarea changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    // Send invite API request
    const sendInvite = async () => {
        await axios.post(`http://localhost:8000/invitation`, {
            candidateId: candidateId,
            recruiterId: recruiterData.id,
            message: message,
        }).then(() => {
            setInvitationSent(true);
            modalRef.current?.close();
            setInvitationSent(false);
        }).catch((error) => {
            console.error(error);
        });
    }

    // Generate invite message via assistant
    const generateInviteMessage = async () => {
        await axios.post('http://localhost:8000/assistant/invite', {
            recruiter_id: recruiterData.id,
            candidate_id: candidateId,
        }).then((response) => {
            setMessage(response.data.response);
        }).catch((error) => {
            console.error('Error generating invite message:', error);
        });
    }

    return (
        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                {invitationSent ? (
                    <div className="h-60 flex flex-col items-center justify-center">
                        <HiCheckCircle className="text-4xl text-green-500" />
                        Invitation Sent!
                    </div>
                ) : (
                    <>
                        <div className="modal-header mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold">Send Candidate Invite</h1>
                                    <p className="text-sm font-normal text-gray-500">
                                        Write a message for the candidate
                                    </p>
                                </div>
                                <button onClick={sendInvite} className="btn bg-info rounded-full text-white">Send Invite</button>
                            </div>
                        </div>
                        <div className="modal-body relative">
                            <textarea
                                onChange={handleChange}
                                name="coverLetter"
                                className="textarea h-24 min-h-60 textarea-bordered w-full font-normal"
                                placeholder="Write your invite message here..."
                                value={message} // Make sure to bind the message to the textarea
                            ></textarea>
                            <button
                                onClick={generateInviteMessage}
                                className="btn absolute mb-2 bottom-2 right-2 bg-neutral text-white rounded-full"
                            >
                                    <SiGoogleassistant /> Generate
                            </button>
                        </div>
                    </>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
