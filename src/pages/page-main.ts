import {MdListItem} from '@material/web/list/list-item.js'
import {withController} from '@snar/lit'
import {chatGptUrl} from '@vdegenne/links'
import {css, html} from 'lit'
import {withStyles} from 'lit-with-styles'
import {customElement, query, queryAll, state} from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js'
import {store} from '../store.js'
import {formatQuestionValue} from '../utils.js'
import {PageElement} from './PageElement.js'

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
	md-list-item[selected] {
		background-color: var(--md-sys-color-surface-container-highest);
	}
	md-list-item[inert] {
		opacity: 0.4;
	}
`)
export class PageMain extends PageElement {
	@state() selectedQuestionId = -1

	@queryAll('md-list-item') itemElements!: MdListItem[]
	@query('md-list-item[selected]') selectedItemElement!: MdListItem

	render() {
		return html`<!---->
			<md-list>
				${repeat(
					store.questions,
					(q) => q.created,
					(question) => {
						return html`<!-- -->
							<md-list-item
								?inert="${!store.query}"
								?selected="${this.selectedQuestionId === question.created}"
								href="${chatGptUrl(
									question.value.replaceAll('%s', `"${store.query}"`),
								)}"
								@click=${() => store.incrementWeight(question)}
								data-id=${question.created}
							>
								<div slot="headline">
									${formatQuestionValue(question.value, '●')}
								</div>

								<div slot="end">${question.weight}</div>
							</md-list-item>
							<!-- -->`
					},
				)}
			</md-list>
			<!----> `
	}

	previous() {
		if (!store.query) return
		const elements = this.itemElements
		const current = this.selectedItemElement
		let previousIndex = 0
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
		this.selectedItemElement?.click()
	}
}

// export const pageMain = new PageMain();
