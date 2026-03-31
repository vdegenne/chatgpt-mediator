import {ReactiveController} from '@snar/lit'
import {MGamepad, MiniGamepad, Mode} from '@vdegenne/mini-gamepad'
import {Repeater} from '@vdegenne/mini-gamepad/repeater.js'
import {state} from 'lit/decorators.js'
import {getMainPage} from './pages/index.js'

const upRepeater = new Repeater({
	action(mode) {
		switch (mode) {
			case Mode.NORMAL:
				getMainPage()?.previous()
				break
		}
	},
})
const downRepeater = new Repeater({
	action(mode) {
		switch (mode) {
			case Mode.NORMAL:
				getMainPage()?.next()
				break
		}
	},
})

class GamepadController extends ReactiveController {
	@state() gamepad: MGamepad | undefined

	constructor() {
		super()
		const minigp = new MiniGamepad({
			// pollSleepMs: 900,
			focusDeadTimeMs: 200,
		})
		minigp.onConnect((gamepad) => {
			document.body.requestPointerLock()
			this.gamepad = gamepad
			const map = gamepad.mapping

			gamepad.for(map.LEFT_STICK_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
					case Mode.PRIMARY:
						break
					case Mode.SECONDARY:
						break
					case Mode.TERTIARY:
						break
				}
			})
			gamepad.for(map.LEFT_STICK_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
					case Mode.TERTIARY:
						break
				}
			})

			gamepad
				.for(map.LEFT_STICK_UP)
				.before(({mode}) => {
					switch (mode) {
						case Mode.NORMAL:
							upRepeater.start(mode)
							break
					}
				})
				.after(() => upRepeater.stop())
			gamepad
				.for(map.LEFT_STICK_DOWN)
				.before(({mode}) => {
					switch (mode) {
						case Mode.NORMAL:
							downRepeater.start(mode)
							break
					}
				})
				.after(() => downRepeater.stop())

			gamepad.for(map.RIGHT_BUTTONS_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
				}
			})

			gamepad.for(map.RIGHT_STICK_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
				}
			})
			gamepad.for(map.RIGHT_STICK_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
				}
			})

			gamepad.for(map.RIGHT_BUTTONS_BOTTOM).before(async ({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
					case Mode.TERTIARY:
						break
				}
			})
			gamepad.for(map.RIGHT_BUTTONS_RIGHT).before(({mode}) => {
				if (mode === Mode.NORMAL) {
					getMainPage()?.clickSelectedItemElement()
				}
			})

			gamepad.for(map.L1).before(({mode}) => {
				if (mode === Mode.NORMAL) {
				}
			})
			gamepad.for(map.R1).before(({mode}) => {
				if (mode === Mode.NORMAL) {
				}
			})

			gamepad.for(map.LEFT_BUTTONS_RIGHT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
				}
			})

			gamepad
				.for(map.LEFT_BUTTONS_TOP)
				.before(({mode}) => {
					switch (mode) {
						case Mode.NORMAL:
							upRepeater.start(mode)
							break
						case Mode.PRIMARY:
							break
					}
				})
				.after(() => {
					upRepeater.stop()
				})

			gamepad
				.for(map.LEFT_BUTTONS_BOTTOM)
				.before(({mode}) => {
					switch (mode) {
						case Mode.NORMAL:
							downRepeater.start(mode)
							break
						case Mode.PRIMARY:
							break
					}
				})
				.after(() => {
					downRepeater.stop()
				})

			gamepad.for(map.LEFT_BUTTONS_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
					case Mode.PRIMARY:
						break
					case Mode.TERTIARY:
						break
				}
			})

			gamepad.for(map.RIGHT_BUTTONS_TOP).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
					case Mode.PRIMARY:
						break
					case Mode.SECONDARY:
					case Mode.TERTIARY:
				}
			})

			gamepad.for(map.MIDDLE_LEFT).before(({mode}) => {
				switch (mode) {
					case Mode.NORMAL:
						break
				}
			})
		})
	}
}

export const gamepadCtrl = new GamepadController()
