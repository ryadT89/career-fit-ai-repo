'use client'

import { HiDocumentRemove, HiDotsVertical, HiPencil } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { EditJobModal } from "./edit-job-modal";
import { formatDistance } from 'date-fns'
import axios from "axios";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    refetchOffers: () => void;
    jobListingId: number;
    userName: string;
}

export const OfferModal: React.FC<AddJobModalProps> = ({ modalRef, refetchOffers, jobListingId, userName}) => {

    const editModalRef = useRef<HTMLDialogElement>(null);
    const [offerData, setOfferData] = useState<any>(null);

    const getJobListingById = async () => {
        await axios.get(`http://localhost:8000/joblisting/${jobListingId}`).then(response => {
            setOfferData(response.data.data[0]);
        }).catch(error => {});
    }

    useEffect(() => {
        getJobListingById();
    }, [jobListingId]);

    const refetch = () => {
        getJobListingById();
        refetchOffers();
    }


    const removeJobListing = async () => {
        await axios.delete(`http://localhost:8000/joblisting/${jobListingId}`).then(response => {
            refetchOffers();
            modalRef.current?.close();
        }).catch(error => {});
    }

    const openEditModal = () => {
        editModalRef.current?.showModal();
    }

    const handleDelete = () => {
        removeJobListing();
    }

    const relativeTime = formatDistance(new Date(offerData?.createdAt * 1000 || new Date()), new Date(), { addSuffix: true });

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                { offerData === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="modal-header mb-4">
                        <div className="flex justify-between">
                            <h1 className="text-xl font-bold my-2">{offerData?.title}</h1>
                            <details className="dropdown dropdown-end">
                                <summary className="btn btn-ghost rounded-full">
                                    <HiDotsVertical className="text-lg"/>
                                </summary>
                                <ul
                                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li><a onClick={openEditModal}>
                                        <HiPencil /> Edit
                                        <EditJobModal modalRef={editModalRef} refetchOffer={refetch} id={jobListingId}/>
                                    </a></li>
                                    <li><a onClick={handleDelete} className="text-error">
                                        <HiDocumentRemove /> Delete
                                    </a></li>
                                </ul>
                            </details>
                        </div>
                        {offerData?.status === "open" ?
                            <div className="rounded-full bg-success w-fit mb-4 text-white px-2">{offerData?.status}</div>
                            :
                            <div className="rounded-full bg-error w-fit mb-4 text-white px-2">{offerData?.status}</div>
                        }
                        <div className="text-sm font-bold">{userName}</div>
                        <div className="text-sm text-gray-500">{relativeTime}</div>
                    </div>
                    <div className="modal-body">
                        <h2 className="text-lg font-bold">Description</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.description}
                        </p>
                        <h2 className="text-lg font-bold">Location</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.location}
                        </p>
                        <h2 className="text-lg font-bold">Skills</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.requiredSkills}
                        </p>
                        <h2 className="text-lg font-bold">Experience</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.requiredExperience} {offerData?.requiredExperience === 1 ? 'year' : 'years'} of experience
                        </p>
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