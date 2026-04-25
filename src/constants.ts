/* vite only */
export const DEV = import.meta.env.DEV

export const availablePages = ['main', 'search'] as const
// true as AllValuesPresent<Page, typeof availablePages>

export const defaultQuestions: medchat.Question[] = [
	{
		created: Date.now(),
		value: 'C\'est quoi "%s" ?',
		weight: 55,
	},
	{
		created: Date.now() + 10,
		value: 'C\'est qui "%s" ?',
		weight: 7,
	},
	{
		created: Date.now() + 50,
		value:
			"Peux-tu analyser le contenu de %s et me faire un résumé s'il the plait ? Merci",
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
			'Etymologie de "%s" ? Latin et/ou grec ? (Décompose quand tu peux pour expliquer les parties, et pour chaque partie donne d\'autres mots l\'utilisant pour mieux mémoriser. Ne fais pas trop long. Merci',
		weight: 140,
	},
	{
		created: Date.now() + 40,
		value: '%s ?',
		weight: 141,
	},
]
