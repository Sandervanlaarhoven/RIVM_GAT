import { createSlice } from "@reduxjs/toolkit";
import { UserData } from '../../types/index';

type userDataState = {
	userData: UserData | null,
	loading: boolean
}

const initialState = {
	userData: null,
	loading: true,
} as userDataState

const userData = createSlice({
	name: 'userData',
	initialState,
	reducers: {
		set: (state, action) => {
			state.userData = action.payload
			state.loading = false
		},
	}
})

export const {
	set,
} = userData.actions

export default userData.reducer
