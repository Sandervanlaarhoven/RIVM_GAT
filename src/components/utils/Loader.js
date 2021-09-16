import React from 'react';
import { Box } from "@material-ui/core";
import loaderGif from "../../images/ajax-loader.gif";

const Loader = () => {
	return (
		<Box
			display="flex"
			width="100%"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			minHeight="100px"
		>
			<img width="50px" src={loaderGif} alt="Loading.." />
		</Box>
	)
}

export default Loader;
