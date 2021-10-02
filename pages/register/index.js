/* eslint-disable @next/next/no-css-tags */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
// @ts-nocheck
import Head from "next/head";
import {Fragment, useRef, useState, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import j from "jquery";
import {MessagesContext} from "../../lib/messages-context";

function Register() {
	// ----- useRef Properties ------
	const eye = useRef(null);
	const password = useRef(null);
	const Email = useRef(null);
	const UserName = useRef(null);
	const fullName = useRef(null);
	const form = useRef(null);
	// ---------------------------------

	const [messages, setMessages] = useState("");
	const router = useRouter();

	const visibility_change = () => {
		const p = j(password.current);
		const i = j(eye.current);

		if (p.attr("type") == "password") {
			p.attr("type", "text");
		} else {
			p.attr("type", "password");
		}

		if (i.hasClass("ion-md-eye-off")) {
			i.attr("class", "ion-md-eye");
			i.css("color", "var(--color-logo)");
		} else {
			i.attr("class", "ion-md-eye-off");
			i.css("color", "");
		}

		p.focus();
	};

	async function validate_submit(ev) {
		ev.preventDefault();
		setMessages(null);
		if (!form.current.checkValidity()) {
			j(form.current).addClass("was-validated");
			return;
		}

		const gender = j("form").find("input:checked").attr("value") || "male";
		console.log(gender);
		const data = {
			fullName: fullName.current.value,
			UserName: UserName.current.value,
			Email: Email.current.value,
			Password: password.current.value,
			gender,
		};

		try {
			const submit = await fetch("/api/users/register", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const res = await submit.json();
			res?.success
				? (setMessages(res.success),
				  setTimeout(() => {
						router.replace("/login");
				  }, 500))
				: res?.Exist
				? setMessages(res.Exist)
				: setMessages("Internal Server Error");
		} catch (err) {
			console.log(err);
			setMessages("internal server error");
		}
	}

	return (
		<Fragment>
			<Head>
				<title>Zablot - Register Page</title>
				<link rel="stylesheet" href="/dist/css/index.css" key="index" />
				<link rel="stylesheet" href="/dist/css/bootstrap-custom.css" />
			</Head>
			<div className="container">
				<div className="logo_container">
					<p className="logo">ZABLOT</p>
					<div>
						<i></i>
						<div></div>
					</div>
				</div>
				<div className="wrapper_sign_up">
					<div className="wrap">
						<div className="wrap_main">
							<form
								action="#"
								className="form-group sign_up_form"
								ref={form}
							>
								<div className="form-wrapper">
									<h3 className="sign_up_text">SIGN UP</h3>
									<div className="form_group_wrapper sign_up_wrapper">
										{messages ? (
											<div className="alert alert-dismissible alert-warning show">
												<div className="messages">
													{messages}
												</div>
											</div>
										) : (
											""
										)}
										<div className="details username_wrapper">
											<input
												type="text"
												name="fullName"
												className="form-control"
												placeholder="Enter your name.."
												ref={fullName}
												maxLength="20"
												required
											/>
											<div className="invalid-feedback username_feedback">
												Enter your name
											</div>
										</div>
										<div className="details username_wrapper">
											<input
												type="text"
												name="userName"
												className="username form-control"
												placeholder="Username/Nickname"
												maxLength="10"
												ref={UserName}
												required
											/>
											<div className="invalid-feedback username_feedback">
												Enter username or nickname
											</div>
										</div>
										<div className="details">
											<label>gender</label>
											<input
												type="radio"
												name="gender"
												className="form-control"
												id="gender"
												value="M"
												required
											/>
											<input
												type="radio"
												name="gender"
												className="form-control"
												id="gender"
												value="F"
												required
											/>
											<div className="invalid-feedback">
												Date of birth is invalid
											</div>
										</div>
										<div className="details">
											<input
												type="email"
												name="userEmail"
												className="form-control"
												placeholder="Email"
												ref={Email}
												required
											/>
											<div className="invalid-feedback">
												Email is invalid or empty
											</div>
										</div>
										<div className="password_detail">
											<input
												type="password"
												id="userPassword_sign_up"
												name="userPassword"
												className="user_password form-control pwd"
												placeholder="Password"
												ref={password}
												required
											/>
											<i
												className="ion-md-eye-off eye"
												id="show_hide_signup"
												ref={eye}
												onClick={visibility_change}
											></i>
											<div className="invalid-feedback">
												Security key required
											</div>
										</div>
										<div className="roboto">
											<input
												type="checkbox"
												name="roboto"
												id=""
											/>
											<span>I'm not a robot</span>
										</div>
										<button
											type="button"
											className="signup_submit_button submit_button btn"
											onClick={validate_submit}
										>
											SIGN UP
										</button>

										<p>
											Already have an account?{" "}
											<Link href="/login">
												<a className="login_in">
													Login In
												</a>
											</Link>
										</p>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default Register;
