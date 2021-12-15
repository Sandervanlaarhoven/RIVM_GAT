import React, {  } from 'react'
import {
	Typography,
	Box,
	Chip,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import BugReportIcon from '@material-ui/icons/BugReport'
import MailOutlineIcon from '@material-ui/icons/MailOutline'

import { HistoryElement } from '../../../types'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { FindingData } from '../../../types/index';

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

	const HistoryItem = (finding: FindingData) => {
		return <Box
			display="flex"
			flexDirection="row"
			alignItems="top"
			justifyContent="space-between"
			width="100%"
		>
			<Box>
				<Typography>{finding.description}</Typography>
			</Box>
		</Box>
	}

	return (
		<Box
			display="flex"
			width="100%"
			flexDirection="column"
			alignItems="flex-start"
			justifyContent="center"
			className={classes.dummy}
			p={2}
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
					return findingHistoryItem?.finding ? <Box
						display="flex"
						key={index}
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						width="100%"
						border={"1px solid rgba(0, 0, 0, 0.23)"}
						borderRadius={11}
						bgcolor="#FFF"
						mb={2}
					>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							width="100%"
							p={1}
						>
							<Box
								display="flex"
								flexDirection="row"
								alignItems="center"
								justifyContent="flex-start"
							>
								{findingHistoryItem?.finding?.type === 'bug' && <Box
									display="flex"
									flexDirection="row"
									alignItems="center"
									justifyContent="flex-start"
								>
									<BugReportIcon />
								</Box>}
								{findingHistoryItem?.finding?.type === 'verbetering' && <Box
									display="flex"
									flexDirection="row"
									alignItems="center"
									justifyContent="flex-start"
								>
									<MailOutlineIcon />
								</Box>}
								<Box
									display="flex"
									flexDirection="row"
									alignItems="center"
									justifyContent="flex-start"
									ml={1}
								>
									<Chip variant="outlined" color="primary" label={findingHistoryItem?.finding?.status} size="small" />
								</Box>
								<Box
									display="flex"
									flexDirection="row"
									alignItems="center"
									justifyContent="flex-start"
									ml={1}
								>
									<Typography variant="caption">{findingHistoryItem?.createdOn ? format(findingHistoryItem?.createdOn, 'Pp', { locale: nl }) : ""}</Typography>
								</Box>
								<Box
									display="flex"
									flexDirection="row"
									alignItems="center"
									justifyContent="flex-start"
									ml={1}
								>
									<Typography variant="caption">{findingHistoryItem?.createdBy?.email ? ` - ${findingHistoryItem.createdBy.email}` : ""}</Typography>
								</Box>
							</Box>
						</Box>
					</Box> : null
				})}
			</Box>
		</Box>
	)
}

export default HistoryOverview
