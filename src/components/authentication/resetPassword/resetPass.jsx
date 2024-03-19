import React, { useState } from "react";
import "./resetPass.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import loginimg from "../../../assets/resetImg.jpg";
import { api } from "../../../constants";
import ClipLoader from "react-spinners/ClipLoader";
import {
	HiOutlineInformationCircle,
	HiCheckCircle,
	HiXCircle
} from "react-icons/hi";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";

export const Resetpass = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");
	const navigate = useNavigate();
	const [confirmpass, setConfirmpass] = useState("");
	const [emailborder, setEmailborder] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordborder, setPasswordborder] = useState(false);
	const [ispassvis, setIspassvis] = useState(false);
	const [isValid,setIsValid]=useState(true)
	const sendresetlink = async () => {	
		

		if (password != confirmpass) {
			toast.error("Passwords Does not Match");
			setEmailborder(true);
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(`${api}/auth/reset-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					password: password,
					passwordConfirmation: confirmpass,
					code: code
				})
			});

			const data = await response.json();
			if (data?.error) {
				throw data?.error;
			} else {
				navigate("/resetsuccessful");
			}
		} catch (error) {
			toast.error(error?.message ?? "Something went wrong!");
		}
	};

	const checkpass = (e) => {
		setPassword(e.target.value);
		setIsValid(e.target.value.length >=6 );
	};

	return (
		<div className="loginpage">
			<div>
				<Toaster
					containerStyle={{
						position: "absolute",
						top: "90px"
					}}
				/>
			</div>
			<div className="logincont">
				<h2>Reset Password</h2>

				<div className="loginitem">
					{/* <label htmlFor="password">Enter Your Secure Password</label> */}
					<input
						className={
							passwordborder
								? "inputborderred logininput passwordsignupinput"
								: "logininput passwordsignupinput"
						}
						// className="logininput"
						value={password}
						type={ispassvis ? "text" : "password"}
						id="password"
						placeholder="Enter a Secure Password"
						onChange={(e) => {
							checkpass(e);
						}}
					></input>
					{ispassvis ? (
						<AiFillEyeInvisible
							className="eyeicons"
							size={22}
							onClick={() => {
								setIspassvis(!ispassvis);
							}}
						/>
					) : (
						<AiFillEye
							className="eyeicons"
							size={22}
							onClick={() => {
								setIspassvis(!ispassvis);
							}}
							color={"#f96f2e"}
						/>
					)}
					
					
				</div>
				{!isValid && (
						<div
							className="passerr"
							style={{ display: "flex", alignItems: "center" }}
						>
							<HiOutlineInformationCircle color="red" size={20} />
							<span>The password should be atleast 6 characters</span>
						</div>
					)}
				<div className="loginitem">
					<input
						className={emailborder ? "inputborderred logininput" : "logininput"}
						type="password"
						placeholder="Confirm Password"
						onChange={(e) => {
							setConfirmpass(e.target.value);
						}}
						value={confirmpass}
					/>
				</div>
				<button
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					onClick={() => {
						sendresetlink();
					}}
				>
					{isLoading ? (
						<ClipLoader color="white" size={20}></ClipLoader>
					) : (
						"Change Password"
					)}
				</button>
			</div>
		</div>
	);
};
export default Resetpass;