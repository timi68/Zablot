import React from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import {Tab, Tabs, CircularProgress} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

type NavbarType = {tabToOpen: number; setTabToOpen(value: number): void};
function Navbar(props: NavbarType) {
	const {setTabToOpen, tabToOpen} = props;
	function a11yProps(index) {
		return {
			id: `tab${index}`,
		};
	}

	function handleChange(event, value) {
		console.log(value);
		setTabToOpen(value);
	}
	return (
		<Tabs
			variant="fullWidth"
			value={tabToOpen}
			textColor="inherit"
			onChange={handleChange}
			aria-label="Chats tab"
			className="tab_list"
		>
			<Tab
				icon={<PeopleAltOutlinedIcon fontSize="medium" />}
				{...a11yProps(0)}
			/>
			<Tab icon={<SecurityIcon fontSize="medium" />} {...a11yProps(1)} />
		</Tabs>
	);
}
export default Navbar;
