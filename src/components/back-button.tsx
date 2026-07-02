import {useNavigate} from "react-router";

export const BackButton = () => {
    const navigate = useNavigate();
    return (
	<button
	    onClick={()=> navigate(-1)}
	    className="text-sm font-medium text-gray-500 hover:text-ptba-primary transition-colors cursor-pointer"
	>
	    ← Back
	</button>
    )
}