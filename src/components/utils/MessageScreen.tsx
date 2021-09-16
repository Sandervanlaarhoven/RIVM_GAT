import React from 'react';
import { Box, Typography } from "@material-ui/core";

interface IProps {
	message: string
}

const MessageScreen: React.FC<IProps> = ({ message }) => {
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
				<Typography variant="h6">{message}</Typography>
			</Box>
		</Box>
	)
}

export default MessageScreen;
