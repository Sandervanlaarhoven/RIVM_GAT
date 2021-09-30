import { BSON } from "realm-web";

export enum Role {
	test_coordinator = "test_coordinator",
}

export type UserData = {
	_id?: BSON.ObjectId,
	name?: string,
	roles: Array<Role>
}

export type User = {
	_id: BSON.ObjectId,
	email: string
}

export type FindingTheme = {
	_id?: BSON.ObjectId;
	name: string;
}

export enum FindingType {
	Bug = 'bug',
	Verbetering = 'verbetering',
}

export enum Status {
	Open = 'open',
	Geverifieerd = 'geverifieerd',
	Hertest = 'hertest',
	Gesloten = 'gesloten',
	Afgewezen = 'afgewezen',
}

export enum Browser {
	Chrome = 'Chrome',
	Edge = 'Edge',
	Firefox = 'Firefox',
	InternetExplorer = 'Internet Explorer',
}

export type Finding = {
	_id?: BSON.ObjectId;
	uid?: BSON.ObjectId;
	userEmail?: string;
	type: FindingType;
	description: string;
	expectedResult?: string;
	actualResult?: string;
	additionalInfo?: string;
	browser?: Browser[];
	theme?: string;
	status?: Status;
	feedbackDeveloper?: string;
	feedbackToGATUser?: string;
	testDate: Date;
}

export enum FindingFieldName {
	description = 'description',
	type = 'type',
	findingTheme = 'theme',
	userEmail = 'userEmail',
}

export type LinkType = {
	name: string;
	url: string;
}

export type Contact = {
	email: string;
	name: string;
	role: string;
	telephone_number: string;
}

export type Information = {
	_id?: BSON.ObjectId;
	text: string;
	links: LinkType[];
	contacts: Contact[]
}
