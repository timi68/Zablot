import Link from "next/link";

function Footer() {
	return (
		<footer className="chat_footer">
			<div className="attached_links_of_zablot">
				<ul>
					<li>
						<Link href="">Terms Services</Link>
					</li>
					<li>
						<Link href="">Policy</Link>
					</li>
					<li>
						<Link href="">Disclaimer</Link>
					</li>
					<li className="follow_us">Follow us</li>
				</ul>
			</div>
			<div className="copyright">
				<h6>
					&COPY; Copyright 2021 <i>ZABLOT</i>
				</h6>
			</div>
		</footer>
	);
}

export default Footer;
