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
	List,
	IconButton,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import { useRealmApp } from '../App/RealmApp'
import { catitaliseFirstLetter } from '../utils'
import { Contact, FindingTheme, Information, LinkType } from '../../types/index';
import { BSON } from 'realm-web'
import { ListItem } from '@material-ui/core';

const useStyles: any = makeStyles(() => ({
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
}))


interface IProps {
}

const Settings: React.FC<IProps> = () => {
	const classes = useStyles()
	const app = useRealmApp()
	const mongo = app.currentUser.mongoClient("mongodb-atlas")
	const mongoFindingThemesCollection = mongo.db("RIVM_GAT").collection("finding_themes")
	const mongoInformationCollection = mongo.db("RIVM_GAT").collection("information")
	const [information, setInformation] = useState<Information>()
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
			let findingThemesDataRequest = mongoFindingThemesCollection.find()
			const informationDataRequest = await mongoInformationCollection.find()
			const info = informationDataRequest[0] || {}
			setFindingThemes(await findingThemesDataRequest)
			setInformation(info)
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

	const handleChangeInformationTextField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (information) {
			setInformation({
				...information,
				text: event.target.value
			})
		}
	}

	const handleChangeContactTextField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, fieldName: string) => {
		if (information) {
			const newInformation = {
				...information,
				contacts: [
					...information.contacts
				]
			}
			newInformation.contacts[index] = {
				...newInformation.contacts[index],
				[fieldName]: event.target.value
			}
			setInformation(newInformation)
		}
	}

	const handleDeleteContact = (index: number) => {
		if (information) {
			const newInformation = {
				...information,
				contacts: [
					...information.contacts
				]
			}
			delete newInformation.contacts[index]
			setInformation(newInformation)
		}
	}

	const addContact = () => {
		if (information) {
			const newInformation = {
				...information,
				contacts: [
					...information.contacts,
					{
						name: "",
						email: "",
						role: "",
						telephone_number: "",
					}
				]
			}
			setInformation(newInformation)
		}
	}

	const handleChangeLinkTextField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, fieldName: string) => {
		if (information) {
			const newInformation = {
				...information,
				links: [
					...information.links
				]
			}
			newInformation.links[index] = {
				...newInformation.links[index],
				[fieldName]: event.target.value
			}
			setInformation(newInformation)
		}
	}

	const handleDeleteLink = (index: number) => {
		if (information) {
			const newInformation = {
				...information,
				links: [
					...information.links
				]
			}
			delete newInformation.links[index]
			setInformation(newInformation)
		}
	}

	const addLink = () => {
		if (information) {
			const newInformation = {
				...information,
				links: [
					...information.links,
					{
						name: "",
						url: ""
					}
				]
			}
			setInformation(newInformation)
		}
	}

	const saveInformationPage = async () => {
		try {
			if (information) {
				const updatedInformation: Information = {
					...information
				}
				delete updatedInformation._id
				await mongoInformationCollection.updateOne({
					_id: new BSON.ObjectId(information._id)
				}, updatedInformation)
				enqueueSnackbar('De informatiepagina is aangepast.', {
					variant: 'success',
				})
			} else {
				enqueueSnackbar('Er is helaas iets mis gegaan bij het opslaan van de informatiepagina.', {
					variant: 'error',
				})
			}
		} catch (error) {
			enqueueSnackbar('Er is helaas iets mis gegaan bij het opslaan van de informatiepagina.', {
				variant: 'error',
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
					<Typography variant="h4">Instellingen en masterdata</Typography>
				</Box>
			</Box>
			<Paper className={classes.paperForForm}>
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
								value=""
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
						<Button startIcon={<AddIcon />} variant="outlined" className={classes.button} color="primary" onClick={() => setShowNewTheme(true)}>
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
			</Paper>
			<Paper className={classes.paperForForm}>
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
						<Typography variant="h5">Informatiepagina</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-end"
					>
						<Button variant="contained" className={classes.button} color="primary" onClick={saveInformationPage}>
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
						label="Algemene informatie"
						value={information?.text || ''}
						fullWidth
						multiline
						variant="outlined"
						helperText="Dit is het stukje algemene informatie op de informatiepagina."
						onChange={(event) => handleChangeInformationTextField(event)}
					/>
				</Box>
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
					>
						<Typography variant="h6">Belangrijke links</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-end"
					>
						<Button startIcon={<AddIcon />} variant="outlined" className={classes.button} color="primary" onClick={addLink}>
							Link toevoegen
						</Button>
					</Box>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-start"
					width="100%"
					pb={3}
				>
					<List>
						{information?.links?.map((link: LinkType, index: number) => <ListItem key={index}>
							<Box
								display="flex"
								flexDirection="row"
								alignItems="center"
								justifyContent="space-between"
								minWidth="1000px"
								border="1px solid rgba(0, 0, 0, 0.23)"
								borderRadius="8px"
								p={2}
							>
								<TextField
									label="Naam"
									value={link.name}
									onChange={(event) => handleChangeLinkTextField(event, index, 'name')}
								/>
								<TextField
									label="Rol"
									value={link.url}
									onChange={(event) => handleChangeLinkTextField(event, index, 'url')}
								/>
								<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteLink(index)}>
									<DeleteIcon />
								</IconButton>
							</Box>
						</ListItem>)}
					</List>
				</Box>
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
					>
						<Typography variant="h6">Contactpersonen</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-end"
					>
						<Button startIcon={<AddIcon />} variant="outlined" className={classes.button} color="primary" onClick={addContact}>
							Contactpersoon toevoegen
						</Button>
					</Box>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-start"
					width="100%"
					pb={3}
				>
					<List>
						{information?.contacts?.map((contact: Contact, index: number) => <ListItem key={index}>
							<Box
								display="flex"
								flexDirection="row"
								alignItems="center"
								justifyContent="space-between"
								minWidth="1000px"
								border="1px solid rgba(0, 0, 0, 0.23)"
								borderRadius="8px"
								p={2}
							>
								<TextField
									label="Naam"
									value={contact.name}
									onChange={(event) => handleChangeContactTextField(event, index, 'name')}
								/>
								<TextField
									label="Rol"
									value={contact.role}
									onChange={(event) => handleChangeContactTextField(event, index, 'role')}
								/>
								<TextField
									label="E-mailadres"
									value={contact.email}
									onChange={(event) => handleChangeContactTextField(event, index, 'email')}
								/>
								<TextField
									label="Telefoonnummer"
									value={contact.telephone_number}
									onChange={(event) => handleChangeContactTextField(event, index, 'telephone_number')}
								/>
								<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteContact(index)}>
									<DeleteIcon />
								</IconButton>
							</Box>
						</ListItem>)}
					</List>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					width="100%"
					my={6}
				>
					<Typography variant="caption">TODO invoeren contactpersonen en links</Typography>
				</Box>
			</Paper>
		</Box>
	)
}

export default Settings
