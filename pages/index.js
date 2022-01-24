/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Head from "next/head";
import { Fragment } from "react";
import img from "next/image";

const Home = (props) => {
	return (
		<Fragment>
			<Head>
				<meta
					name="description"
					content="Zablot providing Link challenge method to your fellow student"
				/>
				<title>Zablot -- Challenge </title>
			</Head>
			<div className="main_container">
				<div className="main_wrapper">
					<div className="logo_container">
						<p className="logo">ZABLOT</p>
						<div>
							<i></i>
							<div></div>
						</div>
					</div>
					<div className="wrapper_home_screen">
						<div className="svg_container">
							<div className="svg1">
								<img
									src="/images/lover_book.svg"
									alt="lover_book"
								/>
							</div>
						</div>
						<div className="index_main_body">
							<h2 className="preview_text">SCHOLAR CHALLENGE</h2>
							<div className="signin_signup_container">
								<Link href="/login" className="sign_in">
									SIGN IN
								</Link>
								<Link href="/register" className="sign_up">
									SIGN UP
								</Link>
							</div>
						</div>
						<div className="svg_container">
							<div className="svg2">
								<img
									src="/images/maths.svg"
									alt="zablot-image-maths"
								/>
								<img
									src="/images/knowledge.svg"
									alt="zablot-image-learning"
								/>
								<img
									src="/images/learning.svg"
									alt="zablot-image-learning"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export function getServerSideProps({ req, res }) {
	console.log(req.session);

	return { props: { params: req.query } };
}

export default Home;
