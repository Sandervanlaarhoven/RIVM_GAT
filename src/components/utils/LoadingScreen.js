import React from 'react';
import { Box, Typography } from "@material-ui/core";
import Loader from "./Loader";

const LoadingScreen = ({ title }) => {
	return (
		<Box
			display="flex"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
			>
				<Typography variant="h3">{title}</Typography>
			</Box>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="flex-start"
				justifyContent="center"
			>
				<Box
					display="flex"
					flexDirection="column"
					justifyContent="center"
					p={3}
				>
					<Loader />
				</Box>
			</Box>
		</Box>
	)
}

export default LoadingScreen;
