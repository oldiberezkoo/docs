import { defineConfig } from '@lunariajs/core/config';

export default defineConfig({
	repository: {
		name: 'oldiberezkoo/docs',
	},
	sourceLocale: {
		label: 'Russian ',
		lang: 'ru',
		parameters: {
			tag: 'ru',
		},
	},
	files: [
		{
			include: ['src/content/i18n/ru.yml'],
			pattern: 'src/content/i18n/@tag.yml',
			type: 'dictionary',
		},
		{
			include: ['src/content/nav/ru.ts'],
			pattern: 'src/content/nav/@tag.ts',
			type: 'dictionary',
		},
		{
			include: ['src/content/docs/ru/**/*.(md|mdx)'],
			pattern: 'src/content/docs/@lang/@path',
			type: 'universal',
		},
	],
	tracking: {
		localizableProperty: 'i18nReady',
		ignoredKeywords: [
			'lunaria-ignore',
			'typo',
			'en-only',
			'broken link',
			'i18nReady',
			'i18nIgnore',
		],
	},
});
