import React, { useState } from 'react';
import * as Realm from "realm-web";
import { useRealmApp } from "../App/RealmApp";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, TextField, Snackbar, Box, IconButton, Link } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack'

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
	},
}));

const LogIn = () => {
	let history = useHistory();
	const app = useRealmApp();
	const [credentials, setCredentials] = useState({});
	const [validation, setValidation] = useState(false);
	const [isNewUser, setIsNewUser] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const { enqueueSnackbar } = useSnackbar()

	const classes = useStyles();

	const setEmail = (event) => {
		setCredentials({
			...credentials,
			email: event.target.value
		});
	}

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

	const validateEmail = (email) => {
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		if (email && pattern.test(email)) {
			return true;
		}
		return false;
	}

	const emailValid = validateEmail(credentials.email)

	const validatePassWord = (password) => {
		if (password && password.length < 8) {
			return false;
		}
		return true;
	}

	const passwordValid = validatePassWord(credentials.password)

	const validatePassWordCheck = (password) => {
		if (password && password.length < 8 && credentials.password) {
			return false;
		}
		return true;
	}

	const login = async () => {
		if (emailValid && passwordValid) {
			const isRIVMEmployee = credentials.email.trim().endsWith('@rivm.nl')
			const isWhitelisted = credentials.email.trim().endsWith('@isala.nl') || credentials.email.trim().endsWith('@etz.nl') || credentials.email.trim().endsWith('@amsterdamumc.nl') || credentials.email.trim().endsWith('@ysl.nl')
			const isSander = credentials.email.trim().endsWith('sandervanlaarhoven@gmail.com')

			if (!isRIVMEmployee && !isSander && !isWhitelisted) {
				enqueueSnackbar('Alleen gebruikers van het NHS LIMS mogen deelnemen aan de GAT testen.', {
					variant: 'error',
				})
				return
			}
			try {
				const credentialsForLogin = Realm.Credentials.emailPassword(credentials.email, credentials.password);
				await app.logIn(credentialsForLogin);
			} catch (error) {
				setError("Het inloggen is niet gelukt, probeer het nog eens.");
			}
		} else {
			setValidation(true);
		}
	};

	const register = async () => {
		if (emailValid && passwordValid && validatePassWordCheck(credentials.password, credentials.passwordCheck)) {
			const isRIVMEmployee = credentials.email.trim().endsWith('@rivm.nl')
			const isWhitelisted = credentials.email.trim().endsWith('@isala.nl') || credentials.email.trim().endsWith('@etz.nl') || credentials.email.trim().endsWith('@amsterdamumc.nl') || credentials.email.trim().endsWith('@ysl.nl')
			const isSander = credentials.email.trim().endsWith('sandervanlaarhoven@gmail.com')
			if (!isRIVMEmployee && !isSander && !isWhitelisted) {
				enqueueSnackbar('Alleen gebruikers van het NHS LIMS mogen deelnemen aan de GAT testen.', {
					variant: 'error',
				})
				return
			}
			try {
				await app.emailPasswordAuth.registerUser(credentials.email, credentials.password);
				setIsNewUser(false);
				setSuccessMessage('Er wordt een email verstuurd met een bevestigingslink.')
			} catch (error) {
				setError("Het inloggen is niet gelukt, probeer het nog eens.");
			}
		} else {
			setValidation(true);
		}
	};

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
						error={validation && !emailValid}
						id="email"
						label="E-mailadres"
						type="email"
						value={credentials.email || ""}
						fullWidth
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								console.log(event.target.value)
								isNewUser ? register() : login()
							}
						}}
						onChange={setEmail}
					/>
					<TextField
						margin="dense"
						error={validation && !passwordValid}
						id="password"
						label="Wachtwoord"
						type="password"
						value={credentials.password || ""}
						fullWidth
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								console.log(event.target.value)
								isNewUser ? register() : login()
							}
						}}
						onChange={setPassWord}
					/>
					{isNewUser && <TextField
						margin="dense"
						error={validation && !validatePassWord(credentials.passwordCheck)}
						id="passwordCheck"
						label="Nogmaals wachtwoord"
						type="password"
						value={credentials.passwordCheck || ""}
						fullWidth
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								register()
							}
						}}
						onChange={setPassWordCheck}
					/>}
					<Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
					>
						<Link
							component="button"
							variant="body2"
							onClick={() => history.push(credentials.email && credentials.email !== '' ? `/resetpassword/${credentials.email}` : '/resetpassword')}
						>
							Wachtwoord vergeten
						</Link>
					</Box>
					{isNewUser ? <Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
					>
						<Button className={classes.secondaryButton} color="default" onClick={() => setIsNewUser(false)}>Inloggen</Button>
						<Button className={classes.primaryButton} variant="contained" color="primary" onClick={register}>Registreren</Button>
					</Box> : <Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
					>
							<Button className={classes.secondaryButton} color="default" onClick={() => setIsNewUser(true)}>Registreren</Button>
							<Button className={classes.primaryButton} variant="contained" color="primary" onClick={login}>Inloggen</Button>
						</Box>}
				</Box>
			</Paper>
		</Box>
	)
}

export default LogIn;
