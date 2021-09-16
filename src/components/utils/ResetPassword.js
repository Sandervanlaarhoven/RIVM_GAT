import React, { useState } from 'react';
import { useRealmApp } from "../App/RealmApp";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, TextField, Snackbar, Box, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { useHistory, useParams } from "react-router-dom";

import logo from "../../images/logo.jpg";

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: '30px',
		maxWidth: '400px',
		width: '100%'
	},
	close: {
		padding: theme.spacing(0.5),
	},
	primaryButton: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	secondaryButton: {
		marginTop: theme.spacing(3),
	}
}));

// Create a component that lets an anonymous user log in
const ResetPassword = () => {
	let history = useHistory();
	const app = useRealmApp();
	const { email } = useParams();
	const [credentials, setCredentials] = useState(email ? {
		email
	} : {});
	const [validation, setValidation] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const classes = useStyles();

	const setEmail = (event) => {
		setCredentials({
			...credentials,
			email: event.target.value
		});
	}

	const validateEmail = (email) => {
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

		if (!email || !pattern.test(email)) {
			return false;
		}
		return true;
	}

	const resetPassword = async () => {
		if (validateEmail(credentials.email)) {
			try {
				await app.emailPasswordAuth.sendResetPasswordEmail(credentials.email);
				setSuccessMessage('Er wordt een email verstuurd met een link om je wachtwoord te resetten, gebruik deze binnen 30 minuten.')
			} catch (error) {
				setError("Het resetten is niet gelukt, probeer het nog eens.");
			}
		} else {
			setValidation(true);
		}
	}

	const toLogIn = () => {
		history.push('/');
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
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				open={!!error}
				onClose={() => setError(null)}
				autoHideDuration={6000}
				message={error}
				action={<IconButton
					aria-label="close"
					color="inherit"
					className={classes.close}
					onClick={() => setError(null)}
				>
					<CloseIcon />
				</IconButton>}
			/>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				open={!!successMessage}
				onClose={() => setSuccessMessage(null)}
				autoHideDuration={6000}
				message={successMessage}
				action={<IconButton
					aria-label="close"
					color="inherit"
					className={classes.close}
					onClick={() => setSuccessMessage(null)}
				>
					<CloseIcon />
				</IconButton>}
			/>
			<Paper className={classes.paper}>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center">
					<img width="250px" src={logo} alt="RIVM logo" />
					<TextField
						autoFocus
						margin="dense"
						error={validation && !validateEmail(credentials.email)}
						id="email"
						label="E-mailadres"
						type="email"
						value={credentials.email || ""}
						fullWidth
						onChange={setEmail}
					/>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
					>
						<Button className={classes.secondaryButton} color="default" onClick={toLogIn}>Inloggen</Button>
						<Button className={classes.primaryButton} variant="contained" color="primary" onClick={resetPassword}>Wachtwoord resetten</Button>
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default ResetPassword;
