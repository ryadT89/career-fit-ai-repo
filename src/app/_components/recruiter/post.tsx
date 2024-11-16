import { formatDistance } from 'date-fns';

export function Post({title, description, jobStatus, user, time}: {title: string, description: string, jobStatus: string, user: string, time: Date}) {

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    const relativeTime = formatDistance(time, new Date(), { addSuffix: true });

    return (
        <div className="shadow-lg rounded-xl p-4 cursor-pointer hover:bg-gray-50">
            <h1 className="text-lg font-bold pb-4">{title}</h1>
            <p className="text-sm text-gray-500 text-ellipsis mb-2">{truncate(description, 100)}</p>
            { jobStatus === "open" ?
                <div className="rounded-full bg-success w-fit mb-4 text-white px-2">{jobStatus}</div>
                :
                <div className="rounded-full bg-error w-fit mb-4 text-white px-2">{jobStatus}</div>
            }
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="text-sm font-bold">{user}</div>
                </div>
                <div className="text-sm text-gray-500">{relativeTime}</div>
            </div>
        </div>
    )
}