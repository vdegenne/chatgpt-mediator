import {FormBuilder} from '@vdegenne/forms/FormBuilder.js'
import {html} from 'lit'
import toast from 'toastit'
import '../material/dialog-patch.js'
import {Question} from '../objects/Question.js'
import {store} from '../store.js'
import {confirmDialog} from './confirm.js'
import {Dialog} from './dialogs.js'

export function questionDialog(
	question?: medchat.QuestionInterface | Question,
) {
	return new Promise((resolve, reject) => {
		let type: 'Create' | 'Update'
		let objectId: number | undefined
		let ctrl: Question
		if (question) {
			type = 'Update'
			objectId = question.created
			ctrl = new Question(
				undefined,
				// removeObjectKeys(
				question instanceof Question
					? (question as Question).toJSON()
					: question,
				// ['created'],
				// ),
			)
		} else {
			type = 'Create'
			ctrl = new Question()
		}

		const F = new FormBuilder(ctrl)

		async function submit() {
			if (ctrl.value) {
				const jsoned = ctrl.toJSON()
				if (type === 'Create') {
					jsoned.created = Date.now()
					// await commentsManager.addObject(ctrl)
					store.addQuestion(jsoned)
				} else if (type === 'Update' && objectId) {
					// question!.fromObject(ctrl.toJSON())
					// await commentsManager.updateObject(objectId, ctrl.toJSON())
					try {
						await store.updateQuestion(jsoned)
					} catch (err: any) {
						toast(err.message)
						reject(err)
					}
				}
				resolve(jsoned)
				dialog.close()
			}
		}

		async function deleteQuestion() {
			if (type === 'Update' && objectId !== undefined) {
				try {
					await confirmDialog('This action is irreversible')
					await store.deleteQuestion(ctrl.toJSON())
					dialog.close()
					toast('Question was deleted')
				} catch (err: any) {
					if (err === undefined) {
						// canceled
						return
					}
					toast(err.message)
				}
			}
		}

		const dialog = new Dialog(
			'Comment',
			() =>
				html`<!-- -->
					<div class="flex flex-col">
						${F.TEXTAREA('content', 'value', {
							autofocus: true,
							rows: 10,
							supportingText: 'Use %s for as the input placeholder',
						})}
					</div>
					<!-- -->`,
			{
				ctrl,
				closeButton: undefined,
				actions: () =>
					html`<!-- -->
						<md-filled-tonal-button error @click=${deleteQuestion}>
							<md-icon slot="icon">delete</md-icon>
							Delete
						</md-filled-tonal-button>
						<md-text-button close>Close</md-text-button>
						<md-filled-tonal-button
							?disabled="${!ctrl.value}"
							@click="${submit}"
							>${type}</md-filled-tonal-button
						>
						<!-- -->`,
			},
		)
	})
}
