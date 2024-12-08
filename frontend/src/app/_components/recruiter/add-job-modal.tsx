'use client'

import { useEffect, useState } from "react";
import { Error } from "@/app/_components/global/error";
import useAuth from "../global/useAuth";
import axios from "axios";

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
    const { isAuthenticated, user, loading } = useAuth();
    const [recruiterData, setRecruiterData] = useState({} as any);

    const handleFormChange = (e: any) => {
        setError("");
        // convert required experience to number
        if (e.target.name === "requiredExperience") {
            setJobListingForm({ ...jobListingForm, [e.target.name]: parseInt(e.target.value) });
            return;
        }

        setJobListingForm({ ...jobListingForm, [e.target.name]: e.target.value });
    }

    const createJobListing = async () => {


        await axios.post(`http://localhost:8000/joblisting`, { ...jobListingForm, recruiterId: recruiterData.id }).then((response) => {
            modalRef.current?.close();
            window.location.reload();
        }).catch((error) => {
            setError(error.response.data.details ?? "An error occurred");
        });
    }

    useEffect(() => {
        if (!loading) {
            getRecruiterProfile();
        }
    }, [loading]);

    const getRecruiterProfile = async () => {

        await axios.get(`http://localhost:8000/recruiter/userId/${user.id}`).then((response) => {
            const data = response.data.data[0];


            setRecruiterData(data);
        }).catch((error) => { });
    }

    const handleFromSubmit = async () => {
        // verify the form
        if (jobListingForm.title === "" || jobListingForm.description === "" || jobListingForm.location === "" || jobListingForm.requiredSkills === "" || isNaN(jobListingForm.requiredExperience)) {
            setError("Please fill all fields");
            return;
        }
        createJobListing();
    }

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                <div className="modal-header mb-10">
                    <h1 className="text-xl font-bold m-2">Add Your Job Offer</h1>
                    <h3>Inter your job information right here</h3>
                </div>
                <div className="modal-body">
                    <input type="text" placeholder="Job Title" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="title" />
                    <textarea placeholder="Job Description" className="textarea textarea-bordered w-full mt-2" onChange={handleFormChange} name="description" />
                    <input type="text" placeholder="Job Location" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="location" />
                    <input type="text" placeholder="Required Skills" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="requiredSkills" />
                    <input type="number" placeholder="Required Experience" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="requiredExperience" />
                    {error && <Error message={error} />}
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