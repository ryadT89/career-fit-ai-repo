import { ForwardedRef, forwardRef } from "react";

interface UserTypeModalProps {

    modalRef: ForwardedRef<HTMLDialogElement>;

}

export const UserTypeModal = forwardRef<HTMLDialogElement, UserTypeModalProps>(({ modalRef }, ref) => {

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box">
                <div className="modal-header mb-10">
                    <h1 className="text-xl font-bold m-2">Welcome to CareerFit AI</h1>
                    <h3>Choose your user type</h3>
                </div>
                <div className="modal-body flex justify-between gap-4 h-52">
                    <a href="/candidate" className="w-full border-2 rounded-xl place-content-center place-items-center cursor-pointer hover:bg-base-200">
                        <img src="/job-seeker.png" className="w-1/2" alt="Job Seeker" />
                        <div className="m-4 text-xl font-bold">Job Seeker</div>
                    </a>
                    <a href="/recruiter" className="w-full border-2 rounded-xl place-content-center place-items-center cursor-pointer hover:bg-base-200">
                        <img src="/recruiter.png" className="w-1/2" alt="Recruiter" />
                        <div className="m-4 text-xl font-bold"> Recruiter </div>
                    </a>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

    )

});