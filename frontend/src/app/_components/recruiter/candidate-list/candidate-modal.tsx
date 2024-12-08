'use client'

import { useEffect, useRef, useState } from "react";
import { InviteModal } from './invite-modal';
import { ProfilePicture } from "../../global/profile-picture";
import axios from "axios";
import { getProfilePicture, getResume } from "../../global/fileService";
import { HiDocumentSearch, HiOutlineInbox } from "react-icons/hi";
import { ResumeButton } from "../resume-button";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    candidateId: number;
}

export const CandidateModal: React.FC<AddJobModalProps> = ({ modalRef, candidateId}) => {

    const [candidate, setCandidate] = useState<any>(null);
    const getCandidate = async () => {
        await axios.get(`http://localhost:8000/candidate/${candidateId}`).then(response => {
            setCandidate(response.data.data[0]);
        }).catch(error => {});
    }

    const [image, setImage] = useState<string>();
    const getImage = async () => {  
        setImage(await getProfilePicture(candidate.userId));
    }

    useEffect(() => {
        if (candidate?.userId) {
            getImage();
        }
    }, [candidate]);

    useEffect(() => {
        getCandidate();
    }, [candidateId]);

    const inviteModalRef = useRef<HTMLDialogElement>(null);
    const openInviteModal = () => {
        const modal = inviteModalRef.current;
        if (!modal) return null;
        modal.showModal();
    }

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content w-1/4">
                { candidate === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="relative modal-body">
                        <div className="flex justify-end">
                            <div onClick={openInviteModal} className="font-bold gap-1 border-2 cursor-pointer hover:bg-gray-50 flex items-center py-1 px-2 rounded-full">
                                <HiOutlineInbox className="text-xl" /> Invite
                                <InviteModal modalRef={inviteModalRef} candidateId={candidateId} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <ProfilePicture className='w-20 h-20' src={image || ''} />
                            <h1 className="text-xl font-bold my-2">{candidate?.user.fullname}</h1>
                            <ResumeButton userId={candidate?.userId as string} />
                            <h2 className="text-sm"></h2>
                            <h2 className="text-lg font-bold">Skills</h2>
                            <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {candidate?.skills}
                            </p>
                            <h2 className="text-lg font-bold">Experience</h2>
                            <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {candidate?.experience} {candidate?.experience === 1 ? 'years' : 'year'} of experience
                            </p>
                            <h2 className="text-lg font-bold">Sectors of Interest</h2>
                            <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {candidate?.interestSectors}
                            </p>
                        </div>
                    </div>
                </>
                }
                </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

    )
};