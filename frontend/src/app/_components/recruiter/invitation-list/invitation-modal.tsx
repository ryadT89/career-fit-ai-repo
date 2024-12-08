'use client'

import { useEffect, useRef, useState } from "react";
import { ProfilePicture } from "../../global/profile-picture";
import axios from "axios";
import { getProfilePicture } from "../../global/fileService";
import { ResumeButton } from "../resume-button";
import ReactMarkdown from "react-markdown";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    invitationId: number;
}

export const InvitationModal: React.FC<AddJobModalProps> = ({ modalRef, invitationId}) => {

    const [invitation, setInvitation] = useState<any>();
    const getInvitation = async () => {
        await axios.get(`http://localhost:8000/invitation/${invitationId}`).then(response => {
            setInvitation(response.data.data[0]);
        }).catch(error => {});
    }

    const [image, setImage] = useState<string>();
    const getImage = async () => {  
        setImage(await getProfilePicture(invitation?.candidate?.userId));
    }

    useEffect(() => {
        if (invitation?.candidate?.userId) {
            getImage();
        }
    }, [invitation]);

    useEffect(() => {
        getInvitation();
    }, [invitationId]);

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content w-1/4">
                { invitation === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="modal-body">
                        <div className="flex flex-col justify-center items-center">
                            <ProfilePicture className='w-24 h-24' src={image || ''} />
                            <h1 className="text-xl font-bold my-2">{invitation?.candidate?.user.name}</h1>
                            <div className="text-center border-2 w-full rounded-lg p-2 mb-4">
                                <h1 className="font-bold text-sm mb-2">Invitation Message</h1>
                                <p><ReactMarkdown>{invitation?.message}</ReactMarkdown></p>
                            </div>
                            <div className="text-center border-2 w-full flex flex-col gap-2 justify-center items-center py-4 rounded-lg">
                                <ResumeButton userId={invitation?.candidate?.userId as string} />
                                <h2 className="text-sm font-bold">Skills</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.candidate?.skills}
                                </p>
                                <h2 className="text-sm font-bold">Experience</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.candidate?.experience} {invitation?.candidate?.experience === 1 ? 'years' : 'year'} of experience
                                </p>
                                <h2 className="text-sm font-bold">Sectors of Interest</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.candidate?.interestSectors}
                                </p>
                            </div>
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