import { createSlice } from "@reduxjs/toolkit";
import { BSON } from "realm-web";
import { Finding } from '../../types/index';

type findingsDataState = {
	findings: Finding[],
	loading: boolean
}

const initialState = {
	findings: [],
	loading: true,
} as findingsDataState

const findingsData = createSlice({
	name: 'findingsData',
	initialState,
	reducers: {
		set: (state, action: {
			type: string,
			payload: Finding[]
		}) => {
			state.findings = action.payload
			state.loading = false
		},
		addFinding: (state, action: {
			type: string,
			payload: Finding
		}) => {
			if (!state.findings.find((finding) => finding._id?.toString() !== action.payload._id?.toString())) {
				state.findings.push(action.payload)
				state.loading = false
			}
		},
		deleteFinding: (state, action: {
			type: string,
			payload: BSON.ObjectId
		}) => {
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
