import type { Article } from '@/lib/articles'
import type { Locale } from '@/lib/i18n/config'
import { arArticleTranslations } from './ar'

export function getLocalizedArticle(
  article: Article,
  locale: Locale
): Article {
  if (locale === 'en') {
    return article
  }

  const translation = arArticleTranslations[article.slug]

  if (!translation) {
    return article
  }

  return {
    ...article,
    ...translation,
    sections: translation.sections ?? article.sections,
    faq: translation.faq ?? article.faq,
  }
}
