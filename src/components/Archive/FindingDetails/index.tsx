import React, { useEffect, useState } from 'react'
import {
	Typography,
	Box,
	Button,
	Paper,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'

import { useParams, useHistory } from 'react-router-dom'
import { BSON } from 'realm-web'

import { useRealmApp } from '../../App/RealmApp'
import { Finding, FindingType, Status } from '../../../types'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import HistoryOverview from '../../utils/HistoryOverview'

const useStyles: any = makeStyles((theme) => ({
	optionListItem: {
		width: '100%',
	},
	button: {
		marginLeft: 10
	},
	formControl: {
		minWidth: 200
	},
	optionList: {
		width: '100%'
	},
	paperForForm: {
		width: '100%',
		padding: 20,
		marginBottom: 20,
	},
	greyedOutText: {
		color: 'grey'
	},
}))

interface params {
	id: string
}

interface IProps {
}

const FindingDetailsAdmin: React.FC<IProps> = () => {
	const classes = useStyles()
	const app = useRealmApp()
	const history = useHistory()
	let { id } = useParams<params>()
	const mongo = app.currentUser.mongoClient("mongodb-atlas")
	const mongoArchivedFindingsCollection = mongo.db("RIVM_GAT").collection("archived_findings")
	const [finding, setFinding] = useState<Finding>()
	const [showHistory, setShowHistory] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar()

	const getData = async () => {
		try {
			let findingData = {
				description: "",
				status: Status.Open,
				type: FindingType.Bug,
				testDate: new Date(),
				history: []
			}
			if (id) {
				findingData = await mongoArchivedFindingsCollection.findOne({
					_id: new BSON.ObjectId(id)
				})
			}
			if (!findingData.status) findingData.status = Status.Open
			if (!findingData.testDate) findingData.testDate = new Date()
			setFinding(findingData)
		} catch (error) {
			enqueueSnackbar('Er is helaas iets mis gegaan bij het ophalen van de gegevens.', {
				variant: 'error',
			})
		}
	}

	useEffect(() => {
		getData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const back = () => {
		history.goBack()
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
				pb={5}
			>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="flex-start"
					justifyContent="center"
				>
					<Typography variant="h4">Gearchiveerde bevinding</Typography>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
				>
					<Button variant="text" className={classes.button} onClick={back}>Terug</Button>
				</Box>
			</Box>
			{!showHistory && <>
				<Paper className={classes.paperForForm}>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="space-between"
						width="100%"
					>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
							justifyContent="center"
							mb={2}
						>
							<Typography variant="caption">Testdatum: {finding?.testDate ? format(finding.testDate, 'Pp', { locale: nl }) : ""}</Typography>
							{finding?.userEmail && <Typography variant="caption">Opgevoerd door: {finding?.userEmail}</Typography>}
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="flex-end"
						>
							<Button variant="outlined" className={classes.button} onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Terug' : 'Toon historie'}</Button>
						</Box>
					</Box>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						{finding?.description && <Typography variant="body1">Omschrijving: {finding?.description || ''}</Typography>}
						{finding?.type && <Typography variant="body1">Type bevinding: {finding?.type}</Typography>}
						{finding?.theme && <Typography variant="body1">Thema: {finding?.theme}</Typography>}
						{finding?.featureRequestDescription && <Typography variant="body1">Beschrijving: {finding?.featureRequestDescription}</Typography>}
						{finding?.expectedResult && <Typography variant="body1">Verwachte uitkomst: {finding?.expectedResult}</Typography>}
						{finding?.actualResult && <Typography variant="body1">Daadwerkelijke uitkomst: {finding?.actualResult}</Typography>}
						{finding?.additionalInfo && <Typography variant="body1">Extra informatie: {finding?.additionalInfo}</Typography>}
						{finding?.browser && <Typography variant="body1">Browser: {finding?.browser}</Typography>}
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						mb={2}
					>
						<Typography variant="body2"><i>Eventuele screenshots zijn opgeslagen onder de volgende naam: </i></Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						mb={2}
					>
						<Typography variant="body2"><b>"{finding?.testDate ? format(finding.testDate, 'Pp', { locale: nl }) : ""} - {finding?.userEmail || 'onbekend'}"</b></Typography>
					</Box>
				</Paper>
				<Paper className={classes.paperForForm}>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						my={3}
					>
						<Typography variant="h6">Terugkoppeling en status informatie</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						{finding?.status && <Typography variant="body1">Status: {finding.status}</Typography>}
						{finding?.feedbackDeveloper && <Typography variant="body1">Terugkoppeling van de ontwikkelaar: {finding.feedbackDeveloper}</Typography>}
						{finding?.feedbackToGATUser && <Typography variant="body1">Terugkoppeling van de testco??rdinator: {finding.feedbackToGATUser}</Typography>}
						{finding?.feedbackProductOwner && <Typography variant="body1">Terugkoppeling van de product owner: {finding.feedbackProductOwner}</Typography>}
					</Box>
				</Paper>
			</>}
			{showHistory && finding?.history && <Paper className={classes.paperForForm}>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="space-between"
					width="100%"
				>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						mb={2}
					>
						<Typography variant="caption">Testdatum: {finding?.testDate ? format(finding.testDate, 'Pp', { locale: nl }) : ""}</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-end"
					>
						<Button variant="outlined" className={classes.button} onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Terug' : 'Toon historie'}</Button>
					</Box>
				</Box>
				<HistoryOverview findingHistory={finding.history} />
			</Paper>}
		</Box>
	)
}

export default FindingDetailsAdmin
