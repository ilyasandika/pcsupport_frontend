import React, { forwardRef, useId } from "react";
import {twMerge} from "tailwind-merge";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string[];
    rightElement?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, rightElement, className = "", ...props }, ref) => {
	const generatedId = useId();
	const inputId = props.id || generatedId;
	return (
	    <div className="flex flex-col gap-1.5 w-full">
		<label
		    htmlFor={inputId}
			className="text-xs font-semibold uppercase tracking-wider text-ptba-subtext dark:text-ptba-subtext-dark"
		>
		    {label}
		</label>

		<div className="relative w-full">
		    <input
			{...props}
			id={inputId}
			ref={ref}
			className={
				twMerge(`w-full py-3 px-4 rounded-xl text-sm border bg-slate-50/20 border-slate-200 text-ptba-subtext placeholder-ptba-placeholder 
				  focus:bg-slate-50 focus:border-ptba-primary focus:ring-2 focus:ring-ptba-primary/5 outline-none transition-all 
				  dark:bg-gray-700/70 dark:border-slate-800 dark:text-ptba-subtext-dark dark:placeholder-ptba-placeholder-dark dark:focus:bg-gray-700/80 dark:focus:border-slate-500`,
				    rightElement ? "pr-11" : "",
				    error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500" : "",
				    className
				    )
			}
			/>

		    {rightElement && (
			<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
			    {rightElement}
			</div>
		    )}
		</div>

		{error && (
		    error.map((err) => (
			<span className="text-xs text-red-500 mt-0.5 ml-2 font-medium block">
			    {err}
		    	</span>
		    ))
		)}
	    </div>
	);
    }
);

InputField.displayName = "InputField";
