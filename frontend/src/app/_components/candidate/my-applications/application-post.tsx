import { formatDistance } from 'date-fns';

export function ApplicationPost({ title, description, applicationStatus, user, time }: { title: string, description: string, applicationStatus: string, user: string, time: number}) {

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    const relativeTime = formatDistance(new Date(time * 1000), new Date(), { addSuffix: true });

    var color = "";
    switch (applicationStatus) {
        case "applied":
            color = "bg-info";
            break;
        case "in-progress":
            color = "bg-warning";
            break;
        case "accepted":
            color = "bg-success";
            break;
        case "rejected":
            color = "bg-error";
            break;
    };      

    return (
        <div className="shadow-lg rounded-xl p-4 cursor-pointer hover:bg-gray-50">
            <h1 className="text-lg font-bold pb-2">{title}</h1>
            <p className="text-sm text-gray-500 text-ellipsis mb-2">{truncate(description, 100)}</p>
            <div className={`rounded-full ${color} w-fit mb-4 text-white px-2`}>{applicationStatus}</div>
            <div className="text-sm text-gray-500"> Applied {relativeTime}</div>
        </div>
    )
}