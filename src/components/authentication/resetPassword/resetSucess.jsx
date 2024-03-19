import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ResetSuccessfull = () => {
	const navigate = useNavigate();

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
				<div className="emailverificationdiv">
					<h2>Password reset successful!</h2>
					<img
						src={
							"https://media.tenor.com/0AVbKGY_MxMAAAAM/check-mark-verified.gif"
						}
						alt=""
						style={{
							width: "150px",
							marginBottom: "20px",
							marginTop: "20px",
                            marginLeft:"auto",
                            marginRight:"auto"
						}}
					/>
					<div className="verificationbox">
						<p>You're back in the game 🎯</p>
						<p>Time to explore new frontiers with your new password. 😎</p>
					</div>
					<button
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 mx-auto dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => {
							navigate("/");
						}}
					>
						Go To Log In
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResetSuccessfull