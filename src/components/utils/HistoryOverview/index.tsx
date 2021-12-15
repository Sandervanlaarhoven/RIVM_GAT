import React, {  } from 'react'
import {
	Typography,
	Box,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'

import { HistoryElement } from '../../../types'
import HistoryItem from './HistoryItem'

const useStyles: any = makeStyles(() => ({
	button: {
		marginLeft: 10
	},
	formControl: {
		minWidth: 200
	},
}))

interface IProps {
	findingHistory: HistoryElement[]
}

const HistoryOverview: React.FC<IProps> = ({ findingHistory }) => {
	const classes = useStyles()

	return (
		<Box
			display="flex"
			width="100%"
			flexDirection="column"
			alignItems="flex-start"
			justifyContent="center"
			className={classes.dummy}
			pb={2}
		>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent="space-between"
				width="100%"
				pb={3}
			>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="flex-start"
					justifyContent="center"
				>
					<Typography variant="h4">Historie van de bevinding</Typography>
				</Box>
			</Box>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				justifyContent="flex-start"
				width="100%"
				mt={2}
			>
				{findingHistory.length === 0 && <Box
					display="flex"
					flexDirection="column"
					alignItems="flex-start"
					justifyContent="center"
				>
					<Typography variant="body2"><i>Er is geen historie gevonden.</i></Typography>
				</Box>}
				{findingHistory && findingHistory.map((findingHistoryItem, index) => {
					return findingHistoryItem?.finding ? <HistoryItem item={findingHistoryItem}/> : null
				})}
			</Box>
		</Box>
	)
}

export default HistoryOverview
