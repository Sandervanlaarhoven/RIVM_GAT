import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, TextField, Snackbar, Box, IconButton, Typography } from "@material-ui/core";
import {
	useLocation,
	useHistory,
} from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';

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
	primaryButton: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	secondaryButton: {
		marginTop: theme.spacing(3),
	},
}));

const ResetPasswordConfirm = () => {
	const classes = useStyles();
	const app = useRealmApp();

	const query = new URLSearchParams(useLocation().search)
	const token = query.get('token');
	const tokenId = query.get('tokenId')

	let history = useHistory();
	const [credentials, setCredentials] = useState({});
	const [validation, setValidation] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const setPassWord = (event) => {
		setCredentials({
			...credentials,
			password: event.target.value
		});
	}

	const setPassWordCheck = (event) => {
		setCredentials({
			...credentials,
			passwordCheck: event.target.value
		});
	}

	const validatePassWord = (password) => {
		if (password && password.length < 8) {
			return false;
		}
		return true;
	}

	const validatePassWordCheck = (password) => {
		if (password && password.length < 8 && credentials.password) {
			return false;
		}
		return true;
	}

	const resetPassword = async () => {
		if (validatePassWord(credentials.password) && validatePassWordCheck(credentials.password, credentials.passwordCheck)) {
			try {
				await app.emailPasswordAuth.resetPassword(token, tokenId, credentials.password);
				history.push('/')
				setSuccessMessage('Je wachtwoord is gereset, je kunt nu inloggen met je nieuwe wachtwoord.')
			} catch (error) {
				setError("Het resetten is niet gelukt, probeer het nog eens.");
			}
		} else {
			setValidation(true);
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
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
					>
						<Typography variant="h6">Wachtwoord reset</Typography>
					</Box>
					<TextField
						margin="dense"
						error={validation && !validatePassWord(credentials.password)}
						id="password"
						label="Wachtwoord"
						type="password"
						value={credentials.password || ""}
						fullWidth
						onChange={setPassWord}
					/>
					<TextField
						margin="dense"
						error={validation && !validatePassWord(credentials.password)}
						id="passwordCheck"
						label="Nogmaals wachtwoord"
						type="password"
						value={credentials.passwordCheck || ""}
						fullWidth
						onChange={setPassWordCheck}
					/>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
					>
						<Button className={classes.secondaryButton} color="default" onClick={() => history.push('/')}>Inloggen</Button>
						<Button className={classes.primaryButton} variant="contained" color="primary" onClick={resetPassword}>Reset</Button>
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default ResetPasswordConfirm;
