import React, { useEffect, useState } from 'react'
import {
	Typography,
	Box,
	FormControl,
	FormControlLabel,
	Switch,
	TextField,
	Button,
	InputLabel,
	MenuItem,
	Select,
	FormGroup,
	Chip,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'

import { useParams, useHistory } from 'react-router-dom'
import { BSON } from 'realm-web'

import { useRealmApp } from '../../App/RealmApp'
import { Finding, FindingType } from '../../../types'
import { catitaliseFirstLetter } from '../../utils'
import { FindingTheme } from '../../../types/index';

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
}))

interface params {
	id: string
}

const FindingDetails = () => {
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
	const [anotherNewFinding, setAnotherNewFinding] = useState<boolean>(false)

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
				type: FindingType.Bug,
			}
			let findingThemesDataRequest = mongoFindingThemesCollection.find()
			if (id) {
				findingData = await mongoFindingsCollection.findOne({
					_id: new BSON.ObjectId(id)
				})
			}
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
			if (!anotherNewFinding) {
				history.push("/findings")
			} else {
				const newFinding: Finding = {
					description: '',
					type: FindingType.Bug
				}
				if (finding?.theme) newFinding.theme = finding.theme
				setFinding(newFinding)
			}
		} catch (error) {
			enqueueSnackbar('Er is helaas iets mis gegaan bij het opslaan van de bevinding.', {
				variant: 'error',
			})
		}
	}



	const VerbeteringFinding = (finding: Finding) => {
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
			{finding.theme && <Box ml={2}>
				<Chip label={finding.theme} size="small" />
			</Box>}
		</Box>
	}

	const OpenFinding = (finding: Finding) => {
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
			{finding.theme && <Box ml={2}>
				<Chip label={finding.theme} size="small" />
			</Box>}
		</Box>
	}

	const FindingComponent = (finding: Finding) => {
		switch (finding.type) {

			case FindingType.Bug: {
				return OpenFinding(finding)
			}

			case FindingType.Verbetering: {
				return VerbeteringFinding(finding)
			}

			default:
				break
		}
	}

	enum FindingFieldName {
		description = 'description',
		type = 'type',
		findingTheme = 'theme',
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
			setFinding({
				...finding,
				[fieldName]: event.target.value
			})
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
			<Box
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				width="100%"
				pb={3}
			>
				<TextField
					label="Bevinding"
					value={finding?.description || ''}
					fullWidth
					variant="outlined"
					onChange={(event) => handleChangeTextField(event, FindingFieldName.description)}
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
				flexDirection="column"
				justifyContent="center"
				alignItems="flex-start"
				width="100%"
				mt={3}
			>
				<FormGroup row>
					<FormControlLabel
						control={
							<Switch
								checked={anotherNewFinding}
								onChange={() => setAnotherNewFinding(!anotherNewFinding)}
								name="anotherNewFinding"
								color="primary"
							/>
						}
						label="Hierna nog een bevinding toevoegen"
					/>
				</FormGroup>
			</Box>
			<Box
				display="flex"
				flexDirection="row"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
				pb={5}
				pt={5}
			>
				<Box
					display="flex"
					flexDirection="row"
					justifyContent="flex-start"
					alignItems="center"
				>
					<Typography variant="h6">Preview</Typography>
				</Box>
			</Box>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="flex-start"
				width="100%"
				mt={2}
			>
				{finding ? <Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						pb={5}
					>
						{FindingComponent(finding)}
					</Box> : null}
			</Box>
		</Box>
	)
}

export default FindingDetails
