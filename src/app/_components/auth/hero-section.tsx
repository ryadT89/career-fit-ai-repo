'use client'

import React from "react"

export function HeroSection({title, description, Form}: {title: string, description: string, Form: React.FC}) {

    return (
        <div className="bg-white">
            <div className="isolate px-6 lg:px-8">
                <div className="grid md:grid-cols-2 grid-cols-1 max-w-4xl py-32 m-auto gap-10 sm:py-24 lg:py-32">
                    <div className="md:text-left text-center md:col-span-1 place-content-center">
                        <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 md:text-6xl">
                            {title}
                        </h1>
                        <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                            {description}
                        </p>
                    </div>
                    <div className="md:col-span-1 place-content-center p-4">
                        <Form />
                    </div>
                </div>
            </div>
        </div>
    )
}