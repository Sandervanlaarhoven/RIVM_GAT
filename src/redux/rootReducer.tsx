import { combineReducers } from 'redux'

import menu from "./menu/menuSlice";
import userData from "./user/userSlice";
import findingsData from "./findings/findingsSlice";
import currentTabPosition from './currentTabPosition/currentTabPositionSlice';

export default combineReducers({
	menu,
	userData,
	findingsData,
	currentTabPosition,
})
