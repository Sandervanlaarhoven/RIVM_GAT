import React, { useEffect } from 'react'

import { useRealmApp } from '../../App/RealmApp'
import { addFinding, deleteFinding, updateFinding } from '../../../redux/findings/findingsSlice'
import { useDispatch } from 'react-redux'


const CollectionWatches = () => {
	const app = useRealmApp()
	const mongo = app.currentUser.mongoClient("mongodb-atlas")
	const mongoFindingsCollection = mongo.db("RIVM_GAT").collection("findings")

	let dispatch = useDispatch()

	const watchChangesOnFindings = async () => {
		for await (const change of mongoFindingsCollection.watch()) {
			const { operationType, fullDocument } = change
			switch (operationType) {
				case 'insert': {
					dispatch(addFinding(fullDocument))
					break
				}

				case 'replace': {
					dispatch(updateFinding(fullDocument))
					break
				}

				case 'delete': {
					dispatch(deleteFinding(change.documentKey._id))
					break
				}

				default: {
					break
				}
			}

		}
	}

	useEffect(() => {
		watchChangesOnFindings()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])


	return <></>
}

export default CollectionWatches
