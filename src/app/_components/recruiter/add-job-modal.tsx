'use client'

import { useState } from "react";
import { api } from "@/trpc/react";
import { Error } from "@/app/_components/global/error";
import { useSession } from "next-auth/react";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
}

interface jobListing {
    title: string,
    description: string,
    location: string,
    status: "open" | "filled",
    requiredSkills: string,
    requiredExperience: number,
    recruiterId: number
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ modalRef }) => {

    const [jobListingForm, setJobListingForm] = useState<jobListing>({ title: "", description: "", location: "", requiredSkills: "", requiredExperience: NaN, status: "open", recruiterId: NaN });
    const [error, setError] = useState("");
    const { data: session } = useSession();

    const handleFormChange = (e: any) => {
        setError("");
        // convert required experience to number
        if (e.target.name === "requiredExperience") {
            setJobListingForm({ ...jobListingForm, [e.target.name]: parseInt(e.target.value) });
            return;
        }

        setJobListingForm({ ...jobListingForm, [e.target.name]: e.target.value });
    }

    // create a new job listing
    const jobMutation = api.jobListing.createJobListing.useMutation({
        onSuccess: () => {
            console.log("Job Listing Created");
            modalRef.current?.close();
            window.location.reload();
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const recruiterData = api.recruiter.getRecuiterProfileById.useQuery({
        userId: session?.user.id ? session?.user.id : ''
    });

    const handleFromSubmit = async () => {
        // verify the form
        if (jobListingForm.title === "" || jobListingForm.description === "" || jobListingForm.location === "" || jobListingForm.requiredSkills === "" || isNaN(jobListingForm.requiredExperience)) {
            setError("Please fill all fields");
            return;
        }

        if (!recruiterData.data?.id) {
            setError("You are not a recruiter");
            return;
        }

        jobMutation.mutate({ ...jobListingForm, recruiterId: recruiterData.data.id });
    }

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                <div className="modal-header mb-10">
                    <h1 className="text-xl font-bold m-2">Add Your Job Offer</h1>
                    <h3>Inter your job information right here</h3>
                </div>
                <div className="modal-body">
                    <input type="text" placeholder="Job Title" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="title"/>
                    <textarea placeholder="Job Description" className="textarea textarea-bordered w-full mt-2" onChange={handleFormChange} name="description" />
                    <input type="text" placeholder="Job Location" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="location" />
                    <input type="text" placeholder="Required Skills" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="requiredSkills" />
                    <input type="number" placeholder="Required Experience" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="requiredExperience" />
                    { error && <Error message={error} />}
                    <br />
                    <div className="btn mt-8 w-full" onClick={handleFromSubmit}>Add Offer</div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

    )
};