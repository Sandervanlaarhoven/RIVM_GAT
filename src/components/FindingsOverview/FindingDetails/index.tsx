import React, { useEffect, useState } from 'react'
import {
	Typography,
	Box,
	FormControl,
	TextField,
	Button,
	InputLabel,
	MenuItem,
	Select,
	Paper,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'

import { useParams, useHistory } from 'react-router-dom'
import { BSON } from 'realm-web'

import { useRealmApp } from '../../App/RealmApp'
import { Browser, Finding, FindingType, Status } from '../../../types'
import { catitaliseFirstLetter } from '../../utils'
import { FindingTheme } from '../../../types/index';
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

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
	const mongoFindingsCollection = mongo.db("RIVM_GAT").collection("findings")
	const mongoFindingThemesCollection = mongo.db("RIVM_GAT").collection("finding_themes")
	const [finding, setFinding] = useState<Finding>()
	const [findingThemes, setFindingThemes] = useState<FindingTheme[]>([])
	const [showNewTheme, setShowNewTheme] = useState<boolean>(false)
	const [newTheme, setNewTheme] = useState<FindingTheme | undefined>()
	const { enqueueSnackbar } = useSnackbar()

	const onChangeNewTheme = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setNewTheme({
			name: catitaliseFirstLetter(event.target.value)
		})
	}

	const createNewTheme = async () => {
		if (newTheme?.name) {
			try {
				await mongoFindingThemesCollection.updateOne({
					name: newTheme?.name
				}, newTheme, {
					upsert: true
				})
				setFindingThemes([
					...findingThemes,
					newTheme
				])
				setNewTheme(undefined)
				setShowNewTheme(false)
			} catch (error) {
				enqueueSnackbar('Er is helaas iets mis gegaan bij het aanmaken van het nieuwe thema.', {
					variant: 'error',
				})
			}
		}
	}

	const getData = async () => {
		try {
			let findingData = {
				description: "",
				status: Status.Open,
				type: FindingType.Bug,
				testDate: new Date(),
			}
			let findingThemesDataRequest = mongoFindingThemesCollection.find()
			if (id) {
				findingData = await mongoFindingsCollection.findOne({
					_id: new BSON.ObjectId(id)
				})
			}
			if (!findingData.status) findingData.status = Status.Open
			if (!findingData.testDate) findingData.testDate = new Date()
			setFinding(findingData)
			setFindingThemes(await findingThemesDataRequest)
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

	const cancel = () => {
		history.goBack()
	}

	const wasInitiallyEnteredAsBug = () => {
		let wasBug = false
		if (finding?.expectedResult) wasBug = true
		if (finding?.additionalInfo) wasBug = true
		if (finding?.actualResult) wasBug = true
		if (finding?.browser) wasBug = true
		if (finding?.theme) wasBug = true
		return wasBug
	}

	const save = async () => {
		try {
			if (id && finding) {
				const updatedFinding: Finding = {
					...finding
				}
				delete updatedFinding._id
				await mongoFindingsCollection.updateOne({
					_id: new BSON.ObjectId(id)
				}, updatedFinding)
				enqueueSnackbar('De bevinding is aangepast.', {
					variant: 'success',
				})
			} else if (finding) {
				await mongoFindingsCollection.insertOne(finding)
				enqueueSnackbar('De nieuwe bevinding is aangemaakt.', {
					variant: 'success',
				})
			}
			history.push("/findingsoverview")
		} catch (error) {
			enqueueSnackbar('Er is helaas iets mis gegaan bij het opslaan van de bevinding.', {
				variant: 'error',
			})
		}
	}

	enum FindingFieldName {
		description = 'description',
		expectedResult = 'expectedResult',
		actualResult = 'actualResult',
		additionalInfo = 'additionalInfo',
		type = 'type',
		findingTheme = 'theme',
		browser = 'browser',
		status = 'status',
		feedbackDeveloper = 'feedbackDeveloper',
		feedbackToGATUser = 'feedbackToGATUser',
		feedbackProductOwner = 'feedbackProductOwner',
		featureRequestDescription = 'featureRequestDescription',
	}

	const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: FindingFieldName) => {
		if (finding) {
			setFinding({
				...finding,
				[fieldName]: catitaliseFirstLetter(event.target.value)
			})
		}
	}

	type selectEventProps = {
		name?: string | undefined,
		value: unknown
	}

	const handleChangeSelect = (event: React.ChangeEvent<selectEventProps>, fieldName: FindingFieldName) => {
		if (finding) {
			let newFinding = {
				...finding,
				[fieldName]: event.target.value
			}
			if (fieldName === FindingFieldName.type) {
				newFinding.status = Status.Open
			}
			setFinding(newFinding)
		}
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
					<Typography variant="h4">{id ? 'Bevinding aanpassen' : 'Nieuwe bevinding'}</Typography>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
				>
					<Button variant="text" className={classes.button} onClick={cancel}>Annuleren</Button>
					<Button variant="contained" className={classes.button} color="primary" onClick={save}>
						Opslaan
					</Button>
				</Box>
			</Box>
			<Paper className={classes.paperForForm}>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-start"
					width="100%"
					mb={2}
				>
					<Typography variant="caption">Testdatum: {finding?.testDate ? format(finding.testDate, 'Pp', { locale: nl }) : ""}</Typography>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					width="100%"
					pb={3}
				>
					<TextField
						label="Omschrijving"
						value={finding?.description || ''}
						fullWidth
						variant="outlined"
						helperText="Korte omschrijving van de bevinding"
					/>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-start"
					width="100%"
					pb={3}
				>
					<FormControl className={classes.formControl}>
						<InputLabel id="type">Type bevinding</InputLabel>
						<Select
							labelId="type"
							id="type"
							value={finding?.type || ''}
							onChange={(event) => handleChangeSelect(event, FindingFieldName.type)}
						>
							<MenuItem value={''}></MenuItem>
							<MenuItem value={FindingType.Bug}>Bug</MenuItem>
							<MenuItem value={FindingType.Verbetering}>Verbetering</MenuItem>
						</Select>
					</FormControl>
				</Box>
				{finding?.type === FindingType.Verbetering &&
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						<TextField
							label="Beschrijving"
							value={finding?.featureRequestDescription || ''}
							fullWidth
							variant="outlined"
							onChange={(event) => handleChangeTextField(event, FindingFieldName.featureRequestDescription)}
							helperText="Beschrijf zo goed mogelijk wat je graag zou willen verbeteren in de applicatie"
						/>
					</Box>
				}
				{finding?.type === FindingType.Bug && finding?.featureRequestDescription && <>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						<Typography className={classes.greyedOutText} variant="h6">Voorheen ingevoerd als verbetering</Typography>
						<Typography className={classes.greyedOutText} variant="body2">Beschrijving: {finding?.featureRequestDescription || ''}</Typography>
					</Box>
				</>}
				{finding?.type === FindingType.Verbetering && wasInitiallyEnteredAsBug() && <>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						<Typography className={classes.greyedOutText} variant="h6">Voorheen ingevoerd als Bug</Typography>
						{finding?.theme && <Typography className={classes.greyedOutText} variant="body2">Thema: {finding?.theme}</Typography>}
						{finding?.expectedResult && <Typography className={classes.greyedOutText} variant="body2">Verwachte uitkomst: {finding?.expectedResult}</Typography>}
						{finding?.actualResult && <Typography className={classes.greyedOutText} variant="body2">Daadwerkelijke uitkomst: {finding?.actualResult}</Typography>}
						{finding?.additionalInfo && <Typography className={classes.greyedOutText} variant="body2">Extra informatie: {finding?.additionalInfo}</Typography>}
						{finding?.browser && <Typography className={classes.greyedOutText} variant="body2">Browser: {finding?.browser}</Typography>}
					</Box>
				</>}
				{finding?.type === FindingType.Bug && <>
					{!showNewTheme && <Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						pb={3}
					>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl className={classes.formControl}>
								<InputLabel id="type">Thema</InputLabel>
								<Select
									labelId="type"
									id="type"
									value={finding?.theme || ''}
									onChange={(event) => handleChangeSelect(event, FindingFieldName.findingTheme)}
								>
									<MenuItem key="" value={''}>Geen specifiek thema</MenuItem>
									{findingThemes.map((findingTheme) => <MenuItem key={findingTheme.name} value={findingTheme.name}>{findingTheme.name}</MenuItem>)}
								</Select>
							</FormControl>
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
						>
							<Button variant="outlined" className={classes.button} color="primary" onClick={() => setShowNewTheme(true)}>
								Nieuw thema
							</Button>
						</Box>
					</Box>}
					{showNewTheme && <Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						pb={3}
					>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
							width={300}
						>
							<TextField
								label="Thema"
								value={newTheme?.name || ''}
								fullWidth
								multiline
								variant="outlined"
								onChange={onChangeNewTheme}
							/>
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
						>
							<Button variant="text" className={classes.button} color="default" onClick={() => setShowNewTheme(false)}>
								Annuleren
							</Button>
							<Button variant="contained" className={classes.button} color="primary" onClick={createNewTheme}>
								Aanmaken
							</Button>
						</Box>
					</Box>}
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						<TextField
							label="Verwachte uitkomst"
							value={finding?.expectedResult || ''}
							fullWidth
							multiline
							variant="outlined"
							helperText="Schrijf hier in stappen uit wat je getest hebt en met welke data"
						/>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						<TextField
							label="Daadwerkelijke uitkomst"
							value={finding?.actualResult || ''}
							fullWidth
							multiline
							variant="outlined"
							helperText="Schrijf hier in stappen uit wat de daadwerkelijke uitkomst was en waarom dit niet aan je verwachting voldoet"
						/>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						width="100%"
						pb={3}
					>
						<TextField
							label="Extra informatie"
							value={finding?.additionalInfo || ''}
							fullWidth
							multiline
							variant="outlined"
							onChange={(event) => handleChangeTextField(event, FindingFieldName.additionalInfo)}
							helperText="Testdata / specifieke rollen, rechten"
						/>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-start"
						width="100%"
						pb={3}
					>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
						>
							<FormControl className={classes.formControl}>
								<InputLabel id="browser">Browser</InputLabel>
								<Select
									labelId="browser"
									id="browser"
									value={finding?.browser || ''}
								>
									<MenuItem key="" value={''}>Kies de browser waarmee is getest</MenuItem>
									<MenuItem key={Browser.Chrome} value={Browser.Chrome}>{Browser.Chrome}</MenuItem>
									<MenuItem key={Browser.Edge} value={Browser.Edge}>{Browser.Edge}</MenuItem>
									<MenuItem key={Browser.Firefox} value={Browser.Firefox}>{Browser.Firefox}</MenuItem>
									<MenuItem key={Browser.InternetExplorer} value={Browser.InternetExplorer}>{Browser.InternetExplorer}</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</Box>
				</>
				}
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
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-start"
					width="100%"
					my={3}
				>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
					>
						<FormControl className={classes.formControl}>
							<InputLabel id="status">Status</InputLabel>
							<Select
								labelId="status"
								id="status"
								value={finding?.status || Status.Open}
								onChange={(event) => handleChangeSelect(event, FindingFieldName.status)}
							>
								<MenuItem key={Status.Open} value={Status.Open}>{Status.Open}</MenuItem>
								<MenuItem key={Status.Geverifieerd} value={Status.Geverifieerd}>{Status.Geverifieerd}</MenuItem>
								<MenuItem key={Status.Afgewezen} value={Status.Afgewezen}>{Status.Afgewezen}</MenuItem>
								<MenuItem key={Status.Hertest} value={Status.Hertest}>{Status.Hertest}</MenuItem>
								<MenuItem key={Status.Gesloten} value={Status.Gesloten}>{Status.Gesloten}</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					width="100%"
					my={3}
				>
					<TextField
						label="Terugkoppeling van de ontwikkelaar"
						value={finding?.feedbackDeveloper || ''}
						multiline
						fullWidth
						variant="outlined"
						onChange={(event) => handleChangeTextField(event, FindingFieldName.feedbackDeveloper)}
					/>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					width="100%"
					my={3}
				>
					<TextField
						label="Terugkoppeling van de testcoördinator"
						value={finding?.feedbackToGATUser || ''}
						multiline
						fullWidth
						variant="outlined"
						onChange={(event) => handleChangeTextField(event, FindingFieldName.feedbackToGATUser)}
						helperText="Terugkoppeling van de testcoördinator naar de GAT tester"
					/>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					width="100%"
					my={3}
				>
					<TextField
						label="Terugkoppeling van de product owner"
						value={finding?.feedbackProductOwner || ''}
						multiline
						fullWidth
						variant="outlined"
						onChange={(event) => handleChangeTextField(event, FindingFieldName.feedbackProductOwner)}
					/>
				</Box>
			</Paper>
		</Box>
	)
}

export default FindingDetailsAdmin
