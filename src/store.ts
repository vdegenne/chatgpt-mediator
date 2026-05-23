import {PropertyValues, ReactiveController, state} from '@snar/lit'
import {FormBuilder} from '@vdegenne/forms/FormBuilder.js'
import {saveToLocalStorage} from 'snar-save-to-local-storage'
import toast from 'toastit'
import {availablePages, defaultQuestions} from './constants.js'
import {Page} from './pages/index.js'

@saveToLocalStorage('chatgpt-mediator:store')
export class AppStore extends ReactiveController {
	@state() page: Page = 'main'

	@state() query = ''
	@state() questions: medchat.QuestionInterface[] = [...defaultQuestions]

	F = new FormBuilder(this)

	protected firstUpdated(_changedProperties: PropertyValues): void {
		this.query = ''
	}

	protected updated(changed: PropertyValues<this>) {
		// const {hash, router} = await import('./router.js')
		if (changed.has('page')) {
			// import('./router.js').then(({router}) => {
			// 	router.hash.$('page', this.page)
			// })
			const page = availablePages.includes(this.page) ? this.page : '404'
			import(`./pages/page-${page}.ts`)
				.then(() => {
					console.log(`Page ${page} loaded.`)
				})
				.catch(() => {})
		}
	}

	addQuestion(question: medchat.QuestionInterface) {
		this.questions = [...this.questions, question]
	}

	updateQuestion(question: medchat.QuestionInterface) {
		return new Promise((res, rej) => {
			if (question.created) {
				const found = this.questions.find((q) => q.created === question.created)
				if (found) {
					Object.assign(found, question)
					this.questions = [...this.questions]
					res(found)
				} else {
					rej(new Error('Question not found'))
				}
			} else {
				rej(new Error('Question has no id (created)'))
			}
		})
	}

	deleteQuestion(question: medchat.QuestionInterface) {
		return new Promise<void>((res, rej) => {
			if (!question.created) {
				return rej(new Error('Question needs a valid `created` value'))
			}

			this.questions = this.questions.filter(
				(q) => q.created !== question.created,
			)
			res()
		})
	}

	incrementWeight(question: medchat.QuestionInterface) {
		question.weight++
		this.questions = [...this.questions]
	}
}

export const store = new AppStore()
