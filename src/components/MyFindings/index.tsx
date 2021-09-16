import React, { useEffect, useState } from 'react'
import {
	Typography,
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	Switch,
	TextField,
	Button,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Chip,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { useSnackbar } from 'notistack'

import { Finding, FindingTheme, FindingType, QuestionFieldName } from '../../types'
import { useRealmApp } from '../App/RealmApp'
import { useHistory } from 'react-router-dom'
import { BSON } from 'realm-web'

const useStyles: any = makeStyles(() => ({
	button: {
		marginLeft: 10
	},
	formControl: {
		minWidth: 200
	},
}))

interface IProps {
}

type PropsFilter = {
	theme?: string,
}

const ManageFindings: React.FC<IProps> = () => {
	const classes = useStyles()
	const [filteredFindings, setfilteredFindings] = useState<Finding[]>([])
	const [filterString, setFilterString] = useState<string>('')
	const [propsFilter, setPropsFilter] = useState<PropsFilter>({})
	const history = useHistory()
	const app = useRealmApp()
	const { enqueueSnackbar } = useSnackbar()
	const mongo = app.currentUser.mongoClient("mongodb-atlas")
	const mongoFindingsCollection = mongo.db("RIVM_GAT").collection("findings")
	const mongoSurveysCollection = mongo.db("RIVM_GAT").collection("surveys")
	const mongoFindingThemesCollection = mongo.db("RIVM_GAT").collection("finding_themes")
	const [findingThemes, setFindingThemes] = useState<FindingTheme[]>([])
	const [findings, setFindings] = useState<Finding[]>([])

	const getData = async () => {
		try {
			const findingsData = mongoFindingsCollection.find()
			let findingThemesData = mongoFindingThemesCollection.find()
			setFindings(await findingsData)
			setFindingThemes(await findingThemesData)
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

	useEffect(() => {
		const filterTimeout = setTimeout(() => {
			setfilteredFindings(findings.filter((finding) => {
				let passedPropsFilter = true
				if (propsFilter) {
					if (propsFilter.theme && finding.theme !== propsFilter.theme) {
						passedPropsFilter = false
					}
				}
				return passedPropsFilter && finding.description.toLowerCase().includes(filterString.toLowerCase())
			}))
		}, 500);
		return () => clearTimeout(filterTimeout)
	}, [filterString, propsFilter, findings])

	const VerbeteringFinding = (finding: Finding, index: number) => {
		const keyValue = finding._id ? finding._id.toString() : index
		return <><FormControl component="fieldset" key={keyValue} fullWidth>
			<Box
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent="space-between"
				width="100%"
			>
				<FormLabel>{finding.description}</FormLabel>
				{finding.theme && <Chip label={finding.theme} size="small" />}
			</Box>
			<FormControlLabel key={keyValue}
				control={
					<Switch
						checked={false}
						name={finding.description}
						color="primary"
					/>
				}
				label={finding.description}
			/></FormControl>
			<TextField
				label="Opmerkingen"
				InputLabelProps={{
					shrink: true,
				}}
				fullWidth
				multiline
				value={''}
			/>
		</>
	}

	const OpenFinding = (finding: Finding, index: number) => {
		const keyValue = finding._id ? finding._id.toString() : index
		return <Box
			display="flex"
			flexDirection="row"
			alignItems="top"
			justifyContent="space-between"
			width="100%"
		>
			<TextField
				key={keyValue}
				label={finding.description}
				value={''}
				fullWidth
				multiline
				rows={4}
				variant="outlined"
			/>
			{finding.theme && <Box ml={2}>
				<Chip label={finding.theme} size="small" />
			</Box>}
		</Box>
	}

	const FindingComponent = (finding: Finding, index: number) => {
		switch (finding.type) {

			case FindingType.Bug: {
				return OpenFinding(finding, index)
			}

			case FindingType.Verbetering: {
				return VerbeteringFinding(finding, index)
			}

			default:
				break
		}
	}

	const onCreateNewFindingClick = () => {
		history.push('/findings/new')
	}

	const onEditClick = (findingID: BSON.ObjectId | undefined) => {
		if (findingID) history.push(`/findings/${findingID}`)
	}

	const cleanupSurveysAfterDelete = async (findingID: BSON.ObjectId) => {
		try {
			return await mongoSurveysCollection.updateMany({
				findings: new BSON.ObjectId(findingID)
			}, {
				$pull: { findings: new BSON.ObjectId(findingID) }
			})
		} catch (error) {
			enqueueSnackbar('Er is helaas iets mis gegaan bij het verwijderen van de vraag uit de vragenlijsten waar deze gebruikt wordt.', {
				variant: 'error',
			})
		}
	}

	const onDeleteClick = async (findingID: BSON.ObjectId | undefined) => {
		if (findingID) {
			try {
				await cleanupSurveysAfterDelete(findingID)
				await mongoFindingsCollection.deleteOne({
					_id: new BSON.ObjectId(findingID)
				})
				getData()
			} catch (error) {
				enqueueSnackbar('Er is helaas iets mis gegaan bij het verwijderen.', {
					variant: 'error',
				})
			}
		}
	}

	const onChangeFilterString = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilterString(event.target.value)
	}

	type selectEventProps = {
		name?: string | undefined,
		value: unknown
	}

	const handleChangeSelect = (event: React.ChangeEvent<selectEventProps>, fieldName: QuestionFieldName) => {
		setPropsFilter({
			...propsFilter,
			[fieldName]: event.target.value
		})
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
					<Typography variant="h4">Mijn bevindingen</Typography>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
				>
					<Button variant="contained" className={classes.button} color="primary" onClick={onCreateNewFindingClick}>
						Nieuwe bevinding
					</Button>
				</Box>
			</Box>
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
					flexGrow={1}
					mr={3}
				>
					<TextField
						label="Zoeken op vraag"
						onChange={onChangeFilterString}
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
						value={filterString || ''}
						variant="outlined"
					/>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
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
								value={propsFilter.theme || ''}
								onChange={(event) => handleChangeSelect(event, QuestionFieldName.questionTheme)}
							>
								<MenuItem key="" value={''}>Geen specifiek thema</MenuItem>
								{findingThemes.map((findingTheme) => <MenuItem key={findingTheme.name} value={findingTheme.name}>{findingTheme.name}</MenuItem>)}
							</Select>
						</FormControl>
					</Box>
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
				{filteredFindings && filteredFindings.map((finding, index) => {
					return finding ? <Box
						display="flex"
						key={index}
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						width="100%"
						border="1px solid green"
						borderRadius={11}
						p={3}
						pb={3}
						mb={2}
					>
						{finding._id && <Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							justifyContent="flex-end"
							width="100%"
						>
							<IconButton aria-label="delete" className={classes.margin} color="primary" onClick={() => onEditClick(finding._id)}>
								<EditIcon />
							</IconButton>
							<IconButton aria-label="delete" className={classes.margin} color="secondary" onClick={() => onDeleteClick(finding._id)}>
								<DeleteIcon />
							</IconButton>
						</Box>}
						{FindingComponent(finding, index)}
					</Box> : null
				})}
			</Box>
		</Box>
	)
}

export default ManageFindings
