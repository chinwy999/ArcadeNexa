import { permanentRedirect } from 'next/navigation'

export default function NewsArticleRedirectPage({
  params,
}: {
  params: { slug: string }
}) {
  permanentRedirect(`/blog/${params.slug}`)
}
