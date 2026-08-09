import {useRouteError, isRouteErrorResponse, useNavigate} from 'react-router';
import {isErrorResponse} from "@/helper/type-helper.tsx";
import {Button} from "@/components/ui/button.tsx";

export const  ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate()
    let errorCode = 'Oops!';
    let errorMessage = 'An unexpected error occurred';
    let errorDescription = "Sorry, we couldn’t find the page you’re looking for"

    if (isRouteErrorResponse(error)) {
	errorCode = error.status.toString();
	errorMessage = error.statusText || error.data?.message;
    } else if (error instanceof Error) {
	errorMessage = error.message;
    } else if (isErrorResponse(error)) {
	errorCode = error.statusCode.toString()
	errorMessage = error.message
	errorDescription = error.errors[0].message[0]
    }

    return (
	<div
	    className="flex flex-col items-center justify-center min-h-screen bg-ptba-primary-navy text-slate-800 px-4 text-center">
	    <p className="text-base font-semibold text-indigo-400">{errorCode}</p>
	    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl uppercase">
		{errorMessage}
	    </h1>
	    <p className="mt-6 text-lg capitalize font-medium text-pretty text-gray-400 sm:text-xl/8">
		{errorDescription}
	    </p>
	    <div className="mt-6 flex items-center justify-center gap-x-6">
		<Button variant="link" className="text-white" onClick={()=> navigate("/")}>
			&larr; Back to dashboard
		</Button>

	    </div>
	</div>
    );
}