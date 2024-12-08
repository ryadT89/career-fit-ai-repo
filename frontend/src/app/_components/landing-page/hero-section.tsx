'use client'

import useAuth from "../global/useAuth";
import { useRouter } from "next/navigation"

export function HeroSection() {

    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    const getStarted = () => {
        if (!isAuthenticated) {
            router.push('/user/signin');
        } else if (user.userType === 'Candidate') {
            router.push('/candidate/job-offers');
        } else if (user.userType === 'Recruiter') {
            router.push('/recruiter/my-offers');
        } else {
            router.push('/user/complete');
        }
    }


    return (
        <div className="bg-white">
            <div className="isolate px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-24">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                            Announcing our next update.{' '}
                            <a href="#" className="font-semibold text-neutral">
                                <span aria-hidden="true" className="absolute inset-0" />
                                Read more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                            Empowering Connections Between Top Talent and Recruiters
                        </h1>
                        <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                            Discover a seamless way to match skilled candidates with leading opportunities. CareerFit AI leverages data to make recruiting faster, smarter, and more effective.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                className="btn bg-base-content text-white rounded-full" onClick={getStarted}
                            >
                                Get started
                            </a>
                            <a href="#" className="text-sm/6 font-semibold text-gray-900">
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}