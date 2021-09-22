import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BSON } from "realm-web";
import { Finding } from '../../types/index';

export interface findingsDataState {
	findings: Finding[],
	loading: boolean
}

const initialState: findingsDataState = {
	findings: [],
	loading: true,
}

const findingsData = createSlice({
	name: 'findingsData',
	initialState,
	reducers: {
		set: (state, action: PayloadAction<Finding[]>) => {
			state.findings = action.payload
			state.loading = false
		},
		addFinding: (state, action: PayloadAction<Finding>) => {
			state.findings.push(action.payload)
			state.loading = false
		},
		deleteFinding: (state, action: PayloadAction<BSON.ObjectId>) => {
			const id = action.payload
			state.findings = state.findings.filter((finding) => finding._id?.toString() !== id.toString())
			state.loading = false
		},
	}
})

export const {
	set,
	addFinding,
	deleteFinding,
} = findingsData.actions

export default findingsData.reducer
