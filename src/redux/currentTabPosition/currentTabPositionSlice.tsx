import { createSlice } from "@reduxjs/toolkit";

const currentTabPosition = createSlice({
	name: 'currentTabPosition',
	initialState: {
		myFindings: 0,
		productOwnerOverview: 0,
		findingsOverview: 0,
		supplierOverview: 0,
		informationRequestOverview: 0,
	},
	reducers: {
		set: (state, action) => {
			state = action.payload
		},
		setMyFindings: (state, action) => {
			state.myFindings = action.payload
		},
		setProductOwnerOverview: (state, action) => {
			state.productOwnerOverview = action.payload
		},
		setFindingsOverview: (state, action) => {
			state.findingsOverview = action.payload
		},
		setSupplierOverview: (state, action) => {
			state.supplierOverview = action.payload
		},
		setInformationRequestOverview: (state, action) => {
			state.informationRequestOverview = action.payload
		},
	}
})

export const {
	set,
	setMyFindings,
	setProductOwnerOverview,
	setFindingsOverview,
	setSupplierOverview,
	setInformationRequestOverview,
} = currentTabPosition.actions

export default currentTabPosition.reducer
