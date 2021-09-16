import { createSlice } from "@reduxjs/toolkit";
import { BSON } from "realm-web";
import { Question } from '../../types/index';

type questionsDataState = {
	questions: Question[],
	loading: boolean
}

const initialState = {
	questions: [],
	loading: true,
} as questionsDataState

const questionsData = createSlice({
	name: 'questionsData',
	initialState,
	reducers: {
		set: (state, action: {
			type: string,
			payload: Question[]
		}) => {
			state.questions = action.payload
			state.loading = false
		},
		addQuestion: (state, action: {
			type: string,
			payload: Question
		}) => {
			if (!state.questions.find((question) => question._id?.toString() !== action.payload._id?.toString())) {
				state.questions.push(action.payload)
				state.loading = false
			}
		},
		deleteQuestion: (state, action: {
			type: string,
			payload: BSON.ObjectId
		}) => {
			const id = action.payload
			state.questions = state.questions.filter((question) => question._id?.toString() !== id.toString())
			state.loading = false
		},
	}
})

export const {
	set,
	addQuestion,
	deleteQuestion,
} = questionsData.actions

export default questionsData.reducer
