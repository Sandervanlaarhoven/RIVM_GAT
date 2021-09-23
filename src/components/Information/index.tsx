import React, { useEffect, useState } from 'react'
import {
	Typography,
	Box,
	Paper,
	List,
	ListItem,
	ListItemText,
	Link,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'


import { useRealmApp } from '../App/RealmApp'
import { Information } from '../../types/index';

const useStyles: any = makeStyles(() => ({
	optionListItem: {
		width: '100%',
	},
	paperForForm: {
		width: '100%',
		padding: 20,
		marginBottom: 20,
	},
}))


interface IProps {
}

const InformationPage: React.FC<IProps> = () => {
	const classes = useStyles()
	const app = useRealmApp()
	const mongo = app.currentUser.mongoClient("mongodb-atlas")
	const mongoInformationCollection = mongo.db("RIVM_GAT").collection("information")
	const [information, setInformation] = useState<Information>()
	const { enqueueSnackbar } = useSnackbar()

	const getData = async () => {
		try {
			const informationDataRequest = await mongoInformationCollection.find()
			const info = informationDataRequest[0] || {}
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
					<Typography variant="h4">Informatie</Typography>
				</Box>
			</Box>
			<Paper className={classes.paperForForm}>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="flex-start"
					justifyContent="center"
					width="100%"
					pb={3}
				>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="flex-start"
						justifyContent="center"
						mb={2}
					>
						<Typography variant="h6">Algemene informatie</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="center"
						mb={3}
					>
						<Typography variant="body2">{information?.text}</Typography>
					</Box>
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
						justifyContent="center"
						mb={3}
					>
						<List>
							{information?.links?.map((link) => <ListItem><ListItemText><Link href={link.url} target="_blank">{link.name}</Link></ListItemText></ListItem>)}
						</List>
					</Box>
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
						justifyContent="center"
					>
						<List>
							{information?.contacts?.map((contact) => <ListItem><ListItemText primary={`${contact.name} (${contact.role}) - ${contact.telephone_number}`} secondary={<Link href={`mailto:${contact.email}`} target="_top">{contact.email}</Link>} /></ListItem>)}
						</List>
					</Box>
				</Box>
			</Paper>
		</Box>
	)
}

export default InformationPage
