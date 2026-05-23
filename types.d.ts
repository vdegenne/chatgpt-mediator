declare global {
	namespace medchat {
		interface QuestionInterface {
			/**
			 * You can use this as an id because it's unique
			 */
			created: number
			value: string
			weight: number
		}
	}
}

export {}
