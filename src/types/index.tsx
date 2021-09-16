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

export enum QuestionType {
	Radio = 'radio',
	Boolean = 'boolean',
	Open = 'open',
}

export type QuestionTheme = {
	_id?: BSON.ObjectId;
	name: string;
}

export type Question = {
	_id?: BSON.ObjectId;
	description: string;
	options?: Array<string>;
	type: QuestionType;
	theme?: string;
}

export type FindingTheme = {
	_id?: BSON.ObjectId;
	name: string;
}

export enum FindingType {
	Bug = 'bug',
	Verbetering = 'verbetering',
}

export type Finding = {
	_id?: BSON.ObjectId;
	type: FindingType;
	description: string;
	theme?: string;
}

export type EnrichedOption = {
	description: string;
	count: number;
}

export type AnswerForEnrichedQuestion = {
	answer?: string;
	remark?: string;
	entryID?: BSON.ObjectId;
}

export type EnrichedQuestion = {
	_id?: BSON.ObjectId;
	description: string;
	options?: Array<EnrichedOption>;
	trueCount?: number;
	falseCount?: number;
	type: QuestionType;
	answers: AnswerForEnrichedQuestion[];
}

export type Survey = {
	_id?: BSON.ObjectId;
	active: boolean;
	anonymous?: boolean;
	description: string;
	name: string;
	questions: Array<BSON.ObjectId>;
}

export type Answer = {
	answer?: string;
	remark?: string;
	question: Question;
};

export type Entry = {
	_id?: BSON.ObjectId;
	answers: Array<Answer>;
	survey: Survey;
	user?: User;
	datetime: number;
}

export enum QuestionFieldName {
	description = 'description',
	type = 'type',
	questionTheme = 'theme',
}
