/* eslint-disable @next/next/no-css-tags */
/* eslint-disable react/no-unescaped-entities */
// @ts-check
import {Fragment, useEffect, useRef, useState, useContext} from "react";
import {useRouter} from "next/router";
import Head from "next/head";
import Link from "next/link";
import j from "jquery";
import {MessagesContext} from "../../lib/messages-context";

function Login({message}) {
	// -------- useRef properties ---------------
	const eye = useRef(null);
	const password = useRef(null);
	const form = useRef(null);
	const email = useRef(null);
	// ------------------------------------------

	const [messages, setMessages] = useState(message || null);
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

	const validate_submit = async (ev) => {
		ev.preventDefault();
		if (!form.current.checkValidity()) {
			j(form.current).addClass("was-validated");
			return;
		}
		const data = {
			Email: email.current.value,
			Password: password.current.value,
		};

		try {
			const submit = await fetch("/api/users/login", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const res = await submit.json();

			console.log(res);
			res?.success
				? router.replace("/dashboard")
				: setMessages(res?.error ?? res?.not_success);
		} catch (err) {
			console.log(err);
			setMessages("internal server error");
		}
	};

	return (
		<Fragment>
			<Head>
				<link rel="stylesheet" href="/dist/css/index.css" />
				<link rel="stylesheet" href="/dist/css/bootstrap-custom.css" />
				<title>Zablot - Login Page</title>
			</Head>
			<div className="container">
				<div className="logo_container">
					<p className="logo">ZABLOT</p>
					<div>
						<i></i>
						<div></div>
					</div>
				</div>
				<div className="wrapper_sign_in">
					<div className="wrap">
						<div className="wrap_main">
							<form
								action="#"
								className="form-group sign_in_form"
								ref={form}
							>
								<h3 className="sign_in_text">SIGN IN</h3>
								<div className="form_group_wrapper sign_in_wrapper">
									{messages ? (
										<div className="alert alert-dismissible alert-warning show">
											<div className="messages">
												{messages}
											</div>
										</div>
									) : (
										""
									)}
									<div className="login_details details">
										<input
											type="email"
											name="userEmail"
											className="form-control"
											placeholder="Enter your Email"
											ref={email}
											required
										/>
										<div className="invalid-feedback">
											Email is invalid or empty
										</div>
									</div>
									<div className="password_detail">
										<input
											type="password"
											id="userPassword_sign_in"
											name="userPassword"
											placeholder="Enter your password"
											className="user_password form-control"
											ref={password}
											required
										/>
										<i
											className="ion-md-eye-off eye"
											id="show_hide_signin"
											ref={eye}
											onClick={visibility_change}
										></i>
										<div className="invalid-feedback">
											Required*
										</div>
									</div>
									<button
										type="button"
										className="sign_in_submit_button submit_button btn"
										onClick={validate_submit}
									>
										SIGN IN
									</button>
									<p>
										Don't have an account?
										<Link href="/register">
											<a className="Create">Create One</a>
										</Link>
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export async function getServerSideProps({req, res}) {
	const flash = req?.session?.flash;

	return {
		props: {
			message: flash?.Error || null,
		},
	};
}

export default Login;
