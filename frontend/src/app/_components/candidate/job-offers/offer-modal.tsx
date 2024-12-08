'use client'

import { HiCheckCircle } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { formatDistance } from 'date-fns'
import { ApplyModal } from "./apply-modal";
import axios from 'axios';

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    refetchOffers: () => void;
    jobListingId: number;
    candidateId: number;
}

export const OfferModal: React.FC<AddJobModalProps> = ({ modalRef, refetchOffers, jobListingId, candidateId }) => {

    const [offerData, setOfferData] = useState<any>(null);
    const fetchJobListing = async () => {

        await axios.get(`http://localhost:8000/joblisting/${jobListingId}`).then(response => {
            setOfferData(response.data.data[0]);
        }).catch(error => { });
    }

    useEffect(() => {
        fetchJobListing();
    }, []);

    const applyModalRef = useRef<HTMLDialogElement>(null);
    const showApplyModal = () => {
        const modal = applyModalRef.current;
        if (!modal) return null;
        modal.showModal();
    }

    const [applied, setApplied] = useState<boolean>(false);

    useEffect(() => {
        fetchJobListing();
    }, [applied]);

    useEffect(() => {
        setApplied(offerData?.applications?.find((application: { candidateId: number }) => application.candidateId === candidateId) ? true : false);
    }, [offerData]);

    useEffect(() => {
        fetchJobListing();
        setApplied(offerData?.applications?.find((application: { candidateId: number }) => application.candidateId === candidateId) ? true : false);
    }, [jobListingId]);

    const relativeTime = formatDistance(new Date(offerData?.createdAt * 1000 || new Date()), new Date(), { addSuffix: true });

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                {offerData === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                    :
                    <>
                        <div className="modal-header mb-4">
                            <div className="flex justify-between">
                                <h1 className="text-xl font-bold my-2">{offerData?.title}</h1>
                                {applied ?
                                    <div className="rounded-full btn btn-success hover:bg-success no-animation cursor-default text-white"><HiCheckCircle className="text-xl" /> Applied </div>
                                    :
                                    <span>
                                        <div onClick={showApplyModal} className="btn bg-sky-400 text-white rounded-full">Apply</div>
                                        <ApplyModal modalRef={applyModalRef} setApplied={setApplied} jobListingId={jobListingId} candidateId={candidateId} />
                                    </span>
                                }
                            </div>
                            {offerData?.status === "open" ?
                                <div className="rounded-full bg-success w-fit mb-4 text-white px-2">{offerData?.status}</div>
                                :
                                <div className="rounded-full bg-error w-fit mb-4 text-white px-2">{offerData?.status}</div>
                            }
                            <div className="text-sm font-bold">{'test'}</div>
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