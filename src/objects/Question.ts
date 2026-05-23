import {ReactiveController, state} from '@snar/lit'

export class Question
	extends ReactiveController<medchat.QuestionInterface>
	implements medchat.QuestionInterface
{
	@state() created = -1
	@state() value = ''
	@state() weight = 1
}
