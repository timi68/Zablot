import React, {Fragment} from "react";
import UploadScreen from "./uploadsection";
import AppChatBoard from "./chatboard";

export default function DashboardComponent() {
	return (
		<Fragment>
			<section className="main-body wide center-content">
				<div className="posts social-feeds informations view-screen">
					<UploadScreen />
				</div>
				<div className="chat-form-container empty"></div>
			</section>
			<AppChatBoard />
		</Fragment>
	);
}
