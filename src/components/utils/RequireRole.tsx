import React from 'react';

import Loader from './Loader';
import MessageScreen from './MessageScreen';
import { Role } from '../../types/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface IProps {
	role: Role
}

const RequireRole: React.FC<IProps> = ({ role, children }) => {
	const userDataState = useSelector((state: RootState) => state.userData)
	const { userData, loading } = userDataState

	if (loading) {
		return <Loader />
	}

	const hasRole = userData && userData.roles?.find((el) => el === role)

	return hasRole ? <>{children}</> : <MessageScreen message="Je hebt helaas niet de juiste rechten om deze functionaliteit te kunnen gebruiken." />
}

export default RequireRole
