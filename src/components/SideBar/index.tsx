import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, Box, ListItemIcon } from "@material-ui/core"
import ListIcon from "@material-ui/icons/List"
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer"
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import logo from "../../images/logo.jpg"
import { toggle } from '../../redux/menu/menuSlice'
import { RootState } from '../../redux/store'
import { set } from '../../redux/user/userSlice'
import { useRealmApp } from '../App/RealmApp'
import { Role } from '../../types'

interface IProps { }

const SideBar: React.FC<IProps> = () => {
	let history = useHistory()
	const app = useRealmApp()
	const user = app.currentUser
	const dispatch = useDispatch()
	const userDataState = useSelector((state: RootState) => state.userData)
	const { userData, loading } = userDataState
	const hasTestCoordinatorRole = !loading && userData && userData.roles?.find((el) => el === Role.test_coordinator)

	const navigate = (target: string) => {
		history.push(target)
		dispatch(toggle())
	}

	const checkRoles = async () => {
		const customUserData = await user.refreshCustomData()
		if (customUserData?.roles) {
			await dispatch(set(customUserData))
		}
	}

	useEffect(() => {
		checkRoles()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="flex-start"
			justifyContent="center"
		>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="flex-start"
				ml={2}
				mb={2}
			>
				<img width="200px" src={logo} alt="Logo" />
			</Box>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				justifyContent="flex-start"
				minWidth={350}
			>
				<List dense>
					<ListItem
						button
						onClick={() => navigate('/')}
					>
						<ListItemIcon><ListIcon /></ListItemIcon>
						<ListItemText
							primary='Mijn bevindingen'
						/>
					</ListItem>
					{hasTestCoordinatorRole && <ListItem
						button
						onClick={() => navigate('/')}
					>
						<ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
						<ListItemText
							primary='Beheren bevindingen'
						/>
					</ListItem>}
				</List>
			</Box>
		</Box>
	)
}

export default SideBar
