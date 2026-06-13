import {MdListItem} from '@material/web/list/list-item.js'
import {withController} from '@snar/lit'
import {chatGptUrl} from '@vdegenne/links'
import {css, html} from 'lit'
import {withStyles} from 'lit-with-styles'
import {
	customElement,
	property,
	query,
	queryAll,
	state,
} from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js'
import {store} from '../store.js'
import {formatQuestionValue} from '../utils.js'
import {PageElement} from './PageElement.js'
import {questionDialog} from '../dialogs/question-dialog.js'
import toast from 'toastit'

declare global {
	interface HTMLElementTagNameMap {
		'page-main': PageMain
	}
}

@customElement('page-main')
@withController(store)
@withStyles(css`
	:host {
	}
	:host([gamepad]) md-list-item {
		--md-ripple-hover-color: transparent;
	}
	md-list-item[selected] {
		background-color: var(--md-sys-color-surface-container-highest);
	}
	md-list-item[inert] {
		opacity: 0.4;
	}
`)
export class PageMain extends PageElement {
	@state() selectedQuestionId = -1

	@property({type: Boolean, reflect: true}) gamepad = false

	@queryAll('md-list-item') itemElements!: MdListItem[]
	@query('md-list-item[selected]') selectedItemElement!: MdListItem

	render() {
		return html`<!---->
			<md-list class="p-0">
				${repeat(
					store.questions,
					(q) => q.created,
					(question, i) => {
						const query =
							store.query.length > 20
								? store.query.slice(0, 20) + '...'
								: store.query
						return html`<!-- -->
							<md-divider></md-divider>
							<md-list-item
								?inert="${!store.query}"
								data-id="${question.created}"
								?selected="${this.selectedQuestionId === question.created}"
								href="${chatGptUrl(
									question.value.replaceAll('%s', `${store.query}`),
								)}"
								@pointerup="${async (event: PointerEvent) => {
									if (event.button === 2) {
										event.preventDefault()
										try {
											await questionDialog(question)
										} catch {
											// canceled
										}
									} else if (event.button === 0) {
										store.incrementWeight(question)
									}
								}}"
							>
								<div
									slot="start"
									class="text-xs text-(--md-sys-color-outline-variant)"
								>
									${i}
								</div>
								<div slot="headline">
									<!-- ${formatQuestionValue(question.value, '●')} -->
									${formatQuestionValue(
										question.value,
										`<span class="border border-(--md-sys-color-primary) rounded-sm px-1 text-(--md-sys-color-primary)">${query}</span>`,
										// `<md-assist-chip class="" inert>${query}</md-assist-chip>`,
									)}
								</div>

								<div slot="end">${question.weight}</div>
							</md-list-item>
							<!-- -->`
					},
				)}
				<md-divider></md-divider>
			</md-list>

			<md-fab
				class="fixed bottom-5 right-5"
				@click=${async () => {
					try {
						await questionDialog()
					} catch (err) {}
				}}
			>
				<md-icon slot="icon">add</md-icon>
			</md-fab>
			<!----> `
	}

	previous() {
		if (!store.query) return
		const elements = this.itemElements
		const current = this.selectedItemElement
		let previousIndex = elements.length - 1
		if (current) {
			const currIndex = [...elements].indexOf(current)
			previousIndex = (currIndex - 1 + elements.length) % elements.length
		}
		this.selectedQuestionId = Number(
			elements[previousIndex]?.dataset?.id ?? '-1',
		)
	}
	next() {
		if (!store.query) return
		const elements = this.itemElements
		const current = this.selectedItemElement
		let nextIndex = 0
		if (current) {
			const currIndex = [...elements].indexOf(current)
			nextIndex = (currIndex + 1) % elements.length
		}
		this.selectedQuestionId = Number(elements[nextIndex]?.dataset?.id ?? '-1')
	}

	clickSelectedItemElement() {
		if (!store.query) return
		this.selectedItemElement?.dispatchEvent(new PointerEvent('pointerup'))
		this.selectedItemElement?.click()
	}
}

// export const pageMain = new PageMain();
