import React, { useState } from 'react'
import {
	Typography,
	Box,
	Chip,
	ButtonBase,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import BugReportIcon from '@material-ui/icons/BugReport'
import MailOutlineIcon from '@material-ui/icons/MailOutline'

import { HistoryElement } from '../../../types'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

const useStyles: any = makeStyles(() => ({
	greyedOutText: {
		color: 'grey'
	},
}))

interface IProps {
	item: HistoryElement,
}

const HistoryItem: React.FC<IProps> = ({ item }) => {
	const classes = useStyles()
	const [showDetails, setShowDetails] = useState<boolean>(false);

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			border={"1px solid rgba(0, 0, 0, 0.23)"}
			borderRadius={11}
			bgcolor="#FFF"
			mb={2}
		>
			<ButtonBase onClick={() => setShowDetails(!showDetails)}>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						p={1}
					>
						{item?.finding?.type === 'bug' && <Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="flex-start"
						>
							<BugReportIcon />
						</Box>}
						{item?.finding?.type === 'verbetering' && <Box
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
							<Chip variant="outlined" color="primary" label={item?.finding?.status} size="small" />
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="flex-start"
							ml={1}
						>
							<Typography variant="caption">{item?.createdOn ? format(item?.createdOn, 'Pp', { locale: nl }) : ""}</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="flex-start"
							ml={1}
						>
							<Typography variant="caption">{item?.createdBy?.email ? ` - ${item.createdBy.email}` : ""}</Typography>
						</Box>
					</Box>
					{showDetails && <Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						p={1}
						mb={1}
					>
						{item?.finding?.description && <Typography className={classes.greyedOutText} variant="caption">Omschrijving: {item?.finding?.description}</Typography>}
						{item?.finding?.theme && <Typography className={classes.greyedOutText} variant="caption">Thema: {item?.finding?.theme}</Typography>}
						{item?.finding?.featureRequestDescription && <Typography className={classes.greyedOutText} variant="caption">Beschrijving: {item?.finding?.featureRequestDescription}</Typography>}
						{item?.finding?.expectedResult && <Typography className={classes.greyedOutText} variant="caption">Verwachte uitkomst: {item?.finding?.expectedResult}</Typography>}
						{item?.finding?.actualResult && <Typography className={classes.greyedOutText} variant="caption">Daadwerkelijke uitkomst: {item?.finding?.actualResult}</Typography>}
						{item?.finding?.additionalInfo && <Typography className={classes.greyedOutText} variant="caption">Extra informatie: {item?.finding?.additionalInfo}</Typography>}
						{item?.finding?.browser && <Typography className={classes.greyedOutText} variant="caption">Browser: {item?.finding?.browser}</Typography>}
						{item?.finding?.feedbackDeveloper && <Typography className={classes.greyedOutText} variant="caption">Terugkoppeling van de ontwikkelaar: {item?.finding?.feedbackDeveloper}</Typography>}
						{item?.finding?.feedbackToGATUser && <Typography className={classes.greyedOutText} variant="caption">Terugkoppeling van de testcoördinator: {item?.finding?.feedbackToGATUser}</Typography>}
						{item?.finding?.feedbackProductOwner && <Typography className={classes.greyedOutText} variant="caption">Terugkoppeling van de product owner: {item?.finding?.feedbackProductOwner}</Typography>}
						</Box>}
					</Box>
			</ButtonBase>
		</Box>
	)
}

export default HistoryItem
