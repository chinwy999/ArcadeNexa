import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Gamepad2 } from 'lucide-react'
import { getGameBySlug, getRelatedGames, games } from '@/lib/games'
import InstantPlaySection from './InstantPlaySection'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return games.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getGameBySlug(params.slug)
  if (!game) return { title: 'Game Not Found' }
  const canonicalUrl = `https://arcade-nexa-3gxg.vercel.app/games/${game.slug}`
  return {
    title: `${game.name} - Play Instantly`,
    description: game.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${game.name} | ArcadeNexa`,
      description: game.description,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: game.thumbnailLarge || game.thumbnail, alt: game.name }],
    },
    keywords: [...game.tags, game.name, 'HTML5', 'GamePix', 'instant play', 'ArcadeNexa'],
  }
}

export default function GameDetailPage({ params }: Props) {
  const game = getGameBySlug(params.slug)
  if (!game) return notFound()

  const related = getRelatedGames(game.slug, game.genreFilter, 4)
  const canonical = `https://arcade-nexa-3gxg.vercel.app/games/${game.slug}`

  return (
    <div className="animate-fade-in py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <Link href="/games" className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Info */}
        <div className="lg:col-span-1">
          <div className="h-64 rounded-2xl relative overflow-hidden border border-white/10 group">
            <Image src={game.thumbnail} alt={game.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 bg-blue-500/20 backdrop-blur text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-500/30">GamePix</span>
            <span className="absolute bottom-4 right-4 bg-space-black/70 backdrop-blur px-3 py-1 rounded-full text-xs text-white border border-white/10">{game.width}x{game.height} • {game.aspectRatio}</span>
            <span className="absolute bottom-4 left-4 text-4xl font-black text-white/40">{game.initials}</span>
          </div>

          <div className="mt-6 space-y-4">
            <h1 className="text-4xl font-black text-white">{game.name}</h1>
            <div className="flex flex-wrap gap-2">
              {game.genre.map(g => <span key={g} className="text-xs bg-white/5 text-text-secondary px-3 py-1 rounded-full border border-white/5">{g}</span>)}
            </div>
            <p className="text-text-secondary leading-relaxed">{game.description}</p>
            <p className="text-text-secondary text-sm leading-relaxed">{game.longDescription}</p>

            <div className="bg-elevated border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-blue-400 font-bold text-sm mb-1 flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> Instant Play</h4>
              <p className="text-text-secondary text-xs">This GamePix game plays instantly in this page - no download, no leaving site, fullscreen supported. Official embed with correct referrer.</p>
            </div>

            <div className="pt-2 space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {game.tags.map(t => <span key={t} className="text-xs bg-elevated border border-white/10 text-text-secondary px-2.5 py-1 rounded-full">#{t}</span>)}
              </div>
            </div>

            <div className="bg-elevated border border-white/5 rounded-xl p-4 mt-4 space-y-2">
              <h4 className="text-white font-bold text-sm">Game Details</h4>
              <div className="text-xs text-text-secondary space-y-1">
                <div>Provider: <span className="text-white">{game.provider}</span></div>
                <div>Platform: <span className="text-white">{game.platform}</span></div>
                <div>Dimensions: <span className="text-white">{game.width}x{game.height} ({game.aspectRatio})</span></div>
                <div>Category: <span className="text-white">{game.category}</span></div>
                {game.releaseYear && <div>Year: <span className="text-white">{game.releaseYear}</span></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Instant Play iFrame - Stays in same page */}
        <div className="lg:col-span-2">
          <InstantPlaySection game={game} />

          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-black text-white mb-6">Related {game.genreFilter} Games</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {related.map(g => (
                  <Link key={g.slug} href={`/games/${g.slug}`} className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-electric-violet/30 transition p-0 block">
                    <div className="h-36 relative overflow-hidden">
                      <Image src={g.thumbnail} alt={g.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, 50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-2 left-3 text-white font-bold text-sm">{g.name}</span>
                      <span className="absolute top-2 right-2 text-[9px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/20">GPX</span>
                    </div>
                    <div className="p-4">
                      <p className="text-text-secondary text-xs mt-1 line-clamp-2">{g.description}</p>
                      <span className="mt-3 inline-block text-electric-violet text-sm font-bold group-hover:underline">PLAY NOW - Same Page</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"VideoGame",
        "name": game.name,
        "description": game.description,
        "genre": game.genre,
        "image": game.thumbnail,
        "gamePlatform": game.platform,
        "isAccessibleForFree": true,
        "inLanguage": "en",
        "url": canonical,
        "author": {"@type":"Organization","name":"ArcadeNexa"},
        "provider": {"@type":"Organization","name":"GamePix"}
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"BreadcrumbList",
        "itemListElement": [
          {"@type":"ListItem","position":1,"name":"Home","item":"https://arcade-nexa-3gxg.vercel.app/"},
          {"@type":"ListItem","position":2,"name":"Games","item":"https://arcade-nexa-3gxg.vercel.app/games"},
          {"@type":"ListItem","position":3,"name":game.name,"item":canonical}
        ]
      })}} />
    </div>
  )
}
