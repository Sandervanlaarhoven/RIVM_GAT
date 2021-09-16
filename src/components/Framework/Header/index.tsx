import React from 'react';
import {
	Typography,
	Box,
	Button,
	IconButton,
	useTheme,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useDispatch } from 'react-redux';

import { useRealmApp } from '../../App/RealmApp';
import { toggle } from '../../../redux/menu/menuSlice'

const useStyles = makeStyles((theme) => ({
	logoutButton: {
		marginLeft: theme.spacing(1),
	}
}));

const Header = () => {
	const classes = useStyles();
	const app = useRealmApp();
	const user = app.currentUser;

	let dispatch = useDispatch()

	const logOut = async () => {
		await app.logOut();
	};

	const theme = useTheme();
	const desktop = useMediaQuery(theme.breakpoints.up('md'));

	return <Box
		display="flex"
		width="100%"
		flexDirection="row"
		alignItems="center"
		justifyContent="flex-end"
		flexGrow={1}
	>
		{!desktop && <IconButton onClick={() => dispatch(toggle())}>
			<Menu />
		</IconButton>}
		<Box
			display="flex"
			width="100%"
			flexDirection="row"
			alignItems="center"
			justifyContent="flex-end"
			flexGrow={1}
		>
			<Typography variant="body2">Ingelogd als: {user?.profile?.email}</Typography>
			<Button className={classes.logoutButton} color="primary" onClick={logOut}>Afmelden</Button>
		</Box>
	</Box>
}

export default Header
