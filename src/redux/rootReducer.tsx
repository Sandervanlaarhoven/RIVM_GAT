import { combineReducers } from 'redux'

import menu from "./menu/menuSlice";
import userData from "./user/userSlice";
import questionsData from "./questions/questionsSlice";

export default combineReducers({
	menu,
	userData,
	questionsData,
})
