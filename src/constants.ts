/* vite only */
export const DEV = import.meta.env.DEV

export const availablePages = ['main', 'search'] as const
// true as AllValuesPresent<Page, typeof availablePages>

export const defaultQuestions: medchat.Question[] = [
	{
		created: Date.now(),
		value: 'C\'est quoi ou qui "%s" ?',
		weight: 58,
	},
	{
		created: Date.now() + 50,
		value:
			"Peux-tu analyser le contenu de %s et me faire un résumé s'il the plait ? Merci",
		weight: 6,
	},
	{
		created: Date.now() + 60,
		value: 'Explique "%s"',
		weight: 0,
	},
	{
		created: Date.now() + 20,
		value: '%s',
		weight: 0,
	},
	{
		created: Date.now() + 30,
		value:
			"Etymologie de \"%s\" ? Latin et/ou grec ? L'ideal c'est que tu découpes en particles/radicaux, et pour chaque particule tu montres d'autres mots d'exemple (e.g. a- -> atypique, amorphe, ...), de cette maniere je peux plus facilement mémoriser, mais pense bien a faire des sections pour chaque particule, et fait simple. Merci",
		weight: 146,
	},
	{
		created: Date.now() + 40,
		value: '%s ?',
		weight: 147,
	},
]
