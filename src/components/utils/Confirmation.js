import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Box, Typography, Button } from "@material-ui/core";
import {
	useLocation,
	useHistory,
} from "react-router-dom";

import logo from "../../images/logo.jpg";
import { useRealmApp } from "../App/RealmApp";

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: '30px',
		maxWidth: '400px',
		width: '100%'
	},
	close: {
		padding: theme.spacing(0.5),
	},
	loginButton: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	registerButton: {
		marginTop: theme.spacing(3),
	}
}));

const Confirmation = () => {
	const classes = useStyles();
	const app = useRealmApp();

	const query = new URLSearchParams(useLocation().search)
	const token = query.get('token');
	const tokenId = query.get('tokenId')

	let history = useHistory();

	const confirm = async () => {
		try {
			await app.emailPasswordAuth.confirmUser(token, tokenId);
			history.push('/')
		} catch (error) {
			console.log(error)
			alert('Er is helaas iets mis gegaan bij het bevestigen.')
		}
	}

	return (
		<Box
			display="flex"
			width="100%"
			height="100vh"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			p={1}
		>
			<Paper className={classes.paper}>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center">
					<img width="250px" src={logo} alt="RIVM logo" />
					<Typography>Hiermee bevestig je de registratie.</Typography>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
					>
						<Button className={classes.loginButton} variant="contained" color="primary" onClick={confirm}>Bevestigen</Button>
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default Confirmation;
