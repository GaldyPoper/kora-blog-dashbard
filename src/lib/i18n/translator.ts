import type { Locale } from '$lib/schemas';
import enJson from '../../../mocks/i18n.en.json';
import deJson from '../../../mocks/i18n.de.json';

// English defines the full key set;
export type TranslationKey = keyof typeof enJson;
export type Dictionary = Record<TranslationKey, string>;
export type TranslationParams = Record<string, string | number>;
export type Translate = (key: TranslationKey, params?: TranslationParams) => string;

export interface Translator {
	t: Translate;
}

const sources: Record<Locale, Partial<Dictionary>> = { en: enJson, de: deJson };

const PLACEHOLDER = /\{(\w+)\}/g;
function interpolate(template: string, params?: TranslationParams): string {
	if (!params) return template;
	return template.replace(PLACEHOLDER, (token, name) =>
		name in params ? String(params[name]) : token
	);
}

/**
 * Builds a translator bound to a locale.
 * If the requested key is not found for the locale, the key itself is returned.
 *
 * @example
 * const { t } = createTranslator('de');
 * t('blog.readingTime', { minutes: 5 }); // "5 Min. Lesezeit"
 */
export function createTranslator(locale: Locale): Translator {
	const t: Translate = (key, params) => {
		const value = sources[locale][key];
		if (value) {
			return interpolate(value, params);
		}
		console.error('[i18n] Key not found: ', key);
		return key;
	};
	return { t };
}
