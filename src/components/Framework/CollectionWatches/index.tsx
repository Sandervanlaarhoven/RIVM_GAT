import React, { useEffect } from 'react'

import { useRealmApp } from '../../App/RealmApp'
import { addQuestion, deleteQuestion } from '../../../redux/questions/questionsSlice'
import { useDispatch } from 'react-redux'


const CollectionWatches = () => {
	const app = useRealmApp()
	const mongo = app.currentUser.mongoClient("mongodb-atlas")
	const mongoQuestionsCollection = mongo.db("RIVM_GAT").collection("questions")

	let dispatch = useDispatch()

	const watchChangesOnQuestions = async () => {
		for await (const change of mongoQuestionsCollection.watch()) {
			const { operationType, fullDocument } = change
			switch (operationType) {
				case 'insert': {
					dispatch(addQuestion(fullDocument))
					break
				}

				case 'delete': {
					dispatch(deleteQuestion(change.documentKey._id))
					break
				}

				default: {
					break
				}
			}

		}
	}

	useEffect(() => {
		watchChangesOnQuestions()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])


	return <></>
}

export default CollectionWatches
