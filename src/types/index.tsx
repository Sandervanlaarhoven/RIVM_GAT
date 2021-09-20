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
}

export enum FindingFieldName {
	description = 'description',
	type = 'type',
	findingTheme = 'theme',
}
