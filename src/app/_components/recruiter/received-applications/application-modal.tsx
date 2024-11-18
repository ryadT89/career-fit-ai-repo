'use client'

import { HiDocumentRemove, HiDotsVertical, HiPencil } from "react-icons/hi";
import { api } from "@/trpc/react";
import { use, useEffect, useRef, useState } from "react";
import { EditJobModal } from "../my-offers/edit-job-modal";
import { formatDistance } from 'date-fns'
import { Profile } from "../profile/profile";
import { ProfilePicture } from "../../global/profile-picture";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    refetchApplications: () => void;
    applicationId: number;
}

export const ApplicationModal: React.FC<AddJobModalProps> = ({ modalRef, refetchApplications, applicationId }) => {

    const editModalRef = useRef<HTMLDialogElement>(null);

    const { data: application, refetch: refetchApplication } = api.application.getApplicationById.useQuery({
        id: applicationId
    });

    useEffect(() => {
        refetchApplication();
    }, [applicationId]);

    var color = '';
    switch (application?.status) {
        case 'applied':
            color = 'bg-info';
            break;
        case 'accepted':
            color = 'bg-success';
            break;
        case 'rejected':
            color = 'bg-error';
            break;
    }

    const [showApply, setShowApply] = useState(true);

    const updateApplication = api.application.updateApplication.useMutation({
        onSuccess: () => {
            refetchApplications();
            refetchApplication();
            setShowApply(false);
        }
    });

    useEffect(() => {
        console.log(application?.status);
        if (application?.status === 'accepted' || application?.status === 'rejected') {
            setShowApply(false);
        } else {
            setShowApply(true);
        }
    }, [application]);

    const handleStatusChange = (status: string) => {
        updateApplication.mutate({
            id: applicationId,
            status
        });
    }

    const relativeTime = formatDistance(new Date(application?.appliedAt || new Date()), new Date(), { addSuffix: true });

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                {application === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                    :
                    <>
                        <div className="modal-header mb-4">
                            <div className="flex justify-between">
                                <h1 className="text-xl font-bold my-2">{application?.jobListing.title}</h1>
                                {showApply ?
                                    <div className="flex gap-4">
                                        <div onClick={() => handleStatusChange('accepted')} className="btn rounded-full btn-success text-white">Accept</div>
                                        <div onClick={() => handleStatusChange('rejected')} className="btn rounded-full btn-error text-white">Reject</div>
                                    </div>
                                    :
                                    <div onClick={() => handleStatusChange('applied')} className="btn btn-error text-white rounded-full"> Drop Status </div>
                                }
                            </div>
                            <div className={`rounded-full ${color} w-fit mb-4 text-white px-2`}>{application?.status}</div>
                            <h2 className="text-sm">Applied {relativeTime}</h2>
                        </div>
                        <div className="modal-body">
                            <h1 className="text-lg font-bold">Candidate Details</h1>
                            <div className="border-2 rounded-lg p-2 mt-4 flex flex-col items-center">
                                <ProfilePicture className='w-24 h-24' src={application?.candidate.user.image || ''} />
                                <h2 className="text-lg font-bold">Name</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.candidate.user.name}
                                </p>
                                <h2 className="text-lg font-bold">Location</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.candidate.location}
                                </p>
                                <h2 className="text-lg font-bold">Cover Letter</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.coverLetter}
                                </p>
                                <h2 className="text-lg font-bold">Skills</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.candidate.skills}
                                </p>
                                <h2 className="text-lg font-bold">Experience</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.candidate.experience} {application?.candidate.experience === 1 ? 'year' : 'years'} of experience
                                </p>
                                <h2 className="text-lg font-bold">Interest Sectors</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.candidate.interestSectors}
                                </p>
                            </div>
                            <h1 className="text-lg font-bold mt-4">Offer Details</h1>
                            <div className="border-2 rounded-lg p-2 mt-4">
                                <h2 className="text-lg font-bold">Description</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.jobListing.description}
                                </p>
                                <h2 className="text-lg font-bold">Location</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.jobListing.location}
                                </p>
                                <h2 className="text-lg font-bold">Skills</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.jobListing.requiredSkills}
                                </p>
                                <h2 className="text-lg font-bold">Experience</h2>
                                <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {application?.jobListing.requiredExperience} {application?.jobListing.requiredExperience === 1 ? 'year' : 'years'} of experience
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