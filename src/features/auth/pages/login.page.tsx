import React, {useState} from "react";
import {BukitAsam} from "../../../components/logo.tsx";
import {InputField} from "../../../components/form/input-fields.tsx";
import {useTheme} from "../../../context/ThemeContext.tsx";
import {Blob} from "../../../components/blob.tsx";
import {Check, Moon, Sun} from "lucide-react";
import type {IErrorResponse, IErrors} from "../../../types/api.type.ts";
import {findFieldError} from "../../../helper/helper.tsx";
import {useNavigate} from "react-router";
import {useAuth} from "../../../context/AuthContext.tsx";

export const LoginPage = () => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState<IErrors[]>([]);
    const [generalError, setGeneralError] = useState<string[] | undefined>([]);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const {toggleTheme, theme} = useTheme();
    const navigate = useNavigate();
    const {login} = useAuth()


    const handleSubmit = async (e: React.SubmitEvent) => {
	e.preventDefault();
	setLoading(true);
	setErrors([]);

	await login(username, password)
	    .then(() => navigate('/'))
	    .catch((err: IErrorResponse) => {
		setErrors(err.errors);
		setGeneralError(findFieldError(err.errors, 'general'));
	    })
	    .finally(() => {
		setLoading(false);
	    });
    };

    return (
	<div
	    className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500 bg-ptba-bg-light dark:bg-ptba-bg-dark`}
	>
	    {/* Ambient blobs */}
	    <Blob position={"-top-40 left-180"} size={600} initialColor={"from-slate-300/40 dark:from-indigo-700/35"}/>
	    <Blob position={"top-120 left-20"} size={500} initialColor={"from-ptba-primary/10 dark:from-indigo-500/20"}/>
	    <Blob position={"right-20 bottom-20"} size={300} initialColor={"from-indigo-200/40 dark:from-sky-400/10"}/>

	    {/* Noise */}
	    <div
		className="absolute inset-0 pointer-events-none opacity-[0.1] bg-repeat bg-size-[128px_128px]"
		style={{
		    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
		}}
	    />

	    {/* Theme toggle — top right */}
	    <button
		onClick={() => {
		    toggleTheme()
		}}
		className={`absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 z-10 border bg-ptba-primary/5 dark:bg-white/10 border-ptba-primary/20 dark:border-white/20 text-ptba-primary dark:text-white `}
		aria-label="Toggle theme"
	    >
		{theme === "dark" ? (
		   <Sun className="w-5 h-5" />
		) : (
		    <Moon className="w-5 h-5" />
		)}
	    </button>

	    {/* Card */}
	    <div className="relative w-full mx-4 max-w-105">
		<div
		    className={`relative rounded-2xl overflow-hidden transition-all duration-500 backdrop-blur-[28px] border bg-white/65 dark:bg-white/8 border-white/65 dark:border-white/10`}
		>
		    <div className="px-8 pt-10 pb-10">
			{/* Logo */}
			<div className="flex items-center gap-2.5 mb-8">
			    <BukitAsam size={25} colorMode={theme === "dark" ? 'white' : 'colorful'}/>
			</div>

			{/* Heading */}
			<div className={`${generalError && generalError.length > 0 ? 'mb-4' : 'mb-8'}`}>
			    <h1 className={`text-2xl font-semibold mb-1.5 transition-colors duration-500 tracking-[-0.01em] text-ptba-text dark:text-ptba-text-dark`}>
				Welcome back
			    </h1>
			    <p className={`text-sm transition-colors duration-500 font-light text-ptba-subtext dark:text-ptba-subtext-dark`}>
				Sign in to continue to your workspace
			    </p>
			</div>

			{(generalError && generalError.length > 0) && (
			    <div className="my-4 bg-ptba-red py-4 px-2 rounded-lg">
				{
				    generalError.map((err) => (
					<span className="text-xs text-white mt-0.5 ml-2 font-medium block">
					    {err}
					</span>
				    ))
				}
			    </div>

			)}

			{/* Form */}
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			    <InputField
				label={'username'}
				type={'text'}
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder={"Enter your username"}
				error = {findFieldError(errors, 'username')}

			    />
			    <InputField
				label={'password'}
				type={'password'}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={"••••••••"}
				error = {findFieldError(errors, 'password')}

			    />

			    {/* Remember me */}
			    <div className="flex items-center gap-2.5">
				<button
				    type="button"
				    role="checkbox"
				    aria-checked={rememberMe}
				    onClick={() => setRememberMe(!rememberMe)}
				    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-200 border ${
					rememberMe
					    ? "bg-ptba-primary border-ptba-primary"
					    : `bg-white/65 dark:bg-white/5 border-gray-200 dark:border-gray-600`
				    }`}
				>
				    {rememberMe && (
					<Check className="w-3 h-3 text-white" />
				    )}
				</button>
				<span className={`text-sm transition-colors duration-500 text-ptba-subtext dark:text-ptba-subtext-dark`}>
				    Remember me for 30 days
				</span>
			    </div>

			    {/* Submit */}
			    <button
				type="submit"
				disabled={loading}
				className={`w-full py-3 rounded-xl text-sm font-medium mt-1 transition-all duration-200 text-white ${
				    loading
					? "bg-[rgba(52,70,137,0.5)] cursor-not-allowed"
					: "bg-ptba-primary cursor-pointer"
				}`}
			    >
				{loading ? (
				    <span className="flex items-center justify-center gap-2">
					<svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
					  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
					</svg>
					Signing in…
				      </span>
				) : (
				    "Sign in"
				)}
			    </button>
			</form>


			<p className={`text-center text-sm mt-6 transition-colors duration-500 text-ptba-subtext/80 dark:text-ptba-subtext-dark`}>
			    Only authorized personnel may enter
			</p>
		    </div>
		</div>

	    </div>
	</div>
    );
}