import { createSlice } from "@reduxjs/toolkit";

const menu = createSlice({
	name: 'menu',
	initialState: {
		open: false
	},
	reducers: {
		setOpen: (state) => {
			state.open = true
		},
		setClosed: (state) => {
			state.open = false
		},
		toggle: (state) => {
			state.open = !state.open
		},
		set: (state, action) => {
			state.open = action.payload
		},
	}
})

export const {
	setOpen,
	setClosed,
	toggle,
	set,
} = menu.actions

export default menu.reducer
