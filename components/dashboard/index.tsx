import React from "react";
import UploadScreen from "./uploadsection";
import AppChatBoard from "./chatboard";
import Sidebar from "../global/sidebar/Sidebar";

export default function DashboardComponent() {
	return (
		<div className="main">
			<Sidebar />
			<section className="main-body wide center-content">
				<div className="posts social-feeds informations view-screen">
					<UploadScreen />
				</div>
				<div className="chat-form-container empty"></div>
			</section>
			<AppChatBoard />
		</div>
	);
}
