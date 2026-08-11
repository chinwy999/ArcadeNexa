import { buildGamePixUrl, getAspectRatio, aspectRatioMap } from './site'

export type GameProvider = 'gamepix'

export interface Game {
  id: string
  slug: string
  title: string
  name: string
  initials: string
  gradient: string
  genre: string[]
  genreFilter: string
  rating?: number
  platform: 'PC' | 'Multi'
  description: string
  longDescription: string
  instructions?: string
  tags: string[]
  officialUrl?: string
  iframeUrl: string
  thumbnail: string
  thumbnailLarge?: string
  thumbnailSizes?: { '512x384': string }
  releaseYear?: number
  provider: GameProvider
  providerGameId: string
  width: number
  height: number
  aspectRatio: string
  playable: boolean
  category?: string
}

type GameData = Omit<Game, 'id' | 'name' | 'iframeUrl' | 'aspectRatio' | 'provider' | 'playable' | 'thumbnail' | 'thumbnailLarge' | 'thumbnailSizes'> & {
  thumbnail: string
}

function createGamePixGame(data: GameData): Game {
  const aspectKey = `${data.width}x${data.height}`
  const aspectRatio = aspectRatioMap[aspectKey] || getAspectRatio(data.width, data.height)
  return {
    ...data,
    id: `gamepix-${data.slug}`,
    name: data.title,
    iframeUrl: buildGamePixUrl(data.slug),
    provider: 'gamepix',
    providerGameId: data.slug,
    aspectRatio,
    playable: true,
    thumbnailLarge: data.thumbnail,
    thumbnailSizes: { '512x384': data.thumbnail },
  }
}

// Initial GamePix catalog. The embeds use the user's verified GamePix property.
// Covers are lightweight local SVGs so the listing does not depend on third-party image URLs.
export const games: Game[] = [
  createGamePixGame({
    slug: 'penalty-kick-wiz', title: 'Penalty Kick Wiz', width: 800, height: 600,
    description: 'A fast 3D penalty-shootout game. Aim, shoot and defend your goal against a sequence of opponents.',
    longDescription: 'Penalty Kick Wiz is a browser football game built for quick sessions on desktop and mobile.',
    instructions: 'Use the mouse or touch controls to aim and take shots; react quickly when defending.',
    genre: ['Sports', 'Soccer', 'Skill'], genreFilter: 'Sports', tags: ['soccer', 'football', 'penalty', 'sports', 'skill'],
    rating: 9, platform: 'Multi', releaseYear: 2022, category: 'Sports', initials: 'PKW',
    gradient: 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/30',
    thumbnail: 'https://img.gamepix.com/games/penalty-kick-wiz/cover/penalty-kick-wiz.png?w=500&ar=16:10', providerGameId: 'penalty-kick-wiz', officialUrl: 'https://play.gamepix.com/penalty-kick-wiz/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'war-the-knights', title: 'War the Knights', width: 800, height: 600,
    description: 'Medieval team combat with swords, bows, shields and tactical battlefield action.',
    longDescription: 'Lead your side through intense browser battles and master movement, attacks and defensive timing.',
    instructions: 'WASD to move, Shift to sprint, Space to jump, left mouse to attack, right mouse to block/aim.',
    genre: ['Action', 'Battle', 'War'], genreFilter: 'Action', tags: ['war', 'knights', 'battle', 'medieval', 'action'],
    rating: 9.2, platform: 'Multi', releaseYear: 2026, category: 'Action', initials: 'WTK',
    gradient: 'bg-gradient-to-br from-amber-500/30 to-red-500/30',
    thumbnail: 'https://img.gamepix.com/games/war-the-knights/cover/war-the-knights.png?w=500&ar=16:10', providerGameId: 'war-the-knights', officialUrl: 'https://play.gamepix.com/war-the-knights/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'moto-maniac-2', title: 'Moto Maniac 2', width: 800, height: 600,
    description: 'Ride a dangerous construction bridge at night while balancing your bike and avoiding obstacles.',
    longDescription: 'A quick off-road bike challenge where precision and balance are the keys to reaching the finish.',
    instructions: 'Use the arrow keys: Up to accelerate, Down to stop, Left/Right to control balance.',
    genre: ['Sports', 'Racing', 'Offroad'], genreFilter: 'Racing', tags: ['bike', 'racing', 'offroad', 'motorcycle', 'sports'],
    rating: 8.4, platform: 'Multi', releaseYear: 2021, category: 'Racing', initials: 'MM2',
    gradient: 'bg-gradient-to-br from-orange-500/30 to-yellow-500/30',
    thumbnail: 'https://img.gamepix.com/games/moto-maniac-2/cover/moto-maniac-2.png?w=500&ar=16:10', providerGameId: 'moto-maniac-2', officialUrl: 'https://www.gamepix.com/play/moto-maniac-2'
  }),
  createGamePixGame({
    slug: 'getting-over-it', title: 'Getting Over It', width: 800, height: 600,
    description: 'Climb through a chaotic obstacle course using a hammer and test your patience and precision.',
    longDescription: 'A challenging browser platformer where every movement matters and one mistake can send you back.',
    instructions: 'Move the mouse to control the hammer around the character and use surfaces to climb.',
    genre: ['Strategy', 'Arcade', 'Casual'], genreFilter: 'Arcade', tags: ['arcade', 'platform', 'skill', 'challenge', 'cats'],
    rating: 7.8, platform: 'Multi', releaseYear: 2024, category: 'Arcade', initials: 'GOI',
    gradient: 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30',
    thumbnail: 'https://img.gamepix.com/games/getting-over-it/cover/getting-over-it.png?w=500&ar=16:10', providerGameId: 'getting-over-it', officialUrl: 'https://www.gamepix.com/play/getting-over-it'
  }),
  createGamePixGame({
    slug: 'connect-the-bubbles', title: 'Connect the Bubbles', width: 600, height: 800,
    description: 'Connect matching bubbles, create powerful chains and clear the board before your moves run out.',
    longDescription: 'A colorful matching puzzle designed for mouse and touch play with flexible connection patterns.',
    instructions: 'Hold and drag from one bubble to adjacent bubbles of the same color, then release.',
    genre: ['Puzzle', 'Brain', 'Casual'], genreFilter: 'Puzzle', tags: ['puzzle', 'matching', 'bubbles', 'brain', 'casual'],
    rating: 6, platform: 'Multi', releaseYear: 2022, category: 'Puzzle', initials: 'CTB',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30',
    thumbnail: 'https://img.gamepix.com/games/connect-the-bubbles/cover/connect-the-bubbles.png?w=500&ar=16:10', providerGameId: 'connect-the-bubbles', officialUrl: 'https://www.gamepix.com/play/connect-the-bubbles'
  }),
  createGamePixGame({
    slug: 'gemcrafter', title: 'Gemcrafter', width: 600, height: 800,
    description: 'Match and combine sparkling gems, unlock worlds and collect enough magic to open treasure chests.',
    longDescription: 'A relaxing match-style puzzle with level progression, power-ups and collectible gems.',
    instructions: 'Drag gems to create matches and complete the level objectives with as few moves as possible.',
    genre: ['Puzzle', 'Match 3', 'Casual'], genreFilter: 'Puzzle', tags: ['gems', 'match3', 'puzzle', 'casual', 'mobile'],
    rating: 7.4, platform: 'Multi', releaseYear: 2017, category: 'Puzzle', initials: 'GEM',
    gradient: 'bg-gradient-to-br from-pink-500/30 to-purple-500/30',
    thumbnail: 'https://img.gamepix.com/games/gemcrafter/cover/gemcrafter.png?w=500&ar=16:10', providerGameId: 'gemcrafter', officialUrl: 'https://www.gamepix.com/play/gemcrafter'
  }),
  createGamePixGame({
    slug: 'solitaire-gpx', title: 'Solitaire Blue', width: 800, height: 600,
    description: 'Classic solitaire with a clean browser interface. Build descending alternating-color stacks and complete the suits.',
    longDescription: 'A timeless card game optimized for mouse and touch controls across modern browsers.',
    instructions: 'Drag cards to build descending alternating-color piles and click the deck to draw.',
    genre: ['Cards', 'Solitaire'], genreFilter: 'Cards', tags: ['solitaire', 'cards', 'klondike', 'classic'],
    rating: 6, platform: 'Multi', releaseYear: 2015, category: 'Cards', initials: 'SB',
    gradient: 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30',
    thumbnail: 'https://img.gamepix.com/games/solitaire-gpx/cover/solitaire-gpx.png?w=500&ar=16:10', providerGameId: 'solitaire-gpx', officialUrl: 'https://www.gamepix.com/play/solitaire-gpx'
  }),
  createGamePixGame({
    slug: 'minesweeper', title: 'Minesweeper', width: 600, height: 800,
    description: 'Reveal safe tiles, use the numbers as clues and avoid the hidden mines in this classic logic puzzle.',
    longDescription: 'A compact brain game that works well on both desktop and mobile browsers.',
    instructions: 'Click a tile to reveal it. Use the surrounding numbers to deduce where mines are hidden.',
    genre: ['Puzzle', 'Brain', 'Classics'], genreFilter: 'Puzzle', tags: ['minesweeper', 'logic', 'brain', 'classic'],
    rating: 6, platform: 'Multi', releaseYear: 2023, category: 'Puzzle', initials: 'MS',
    gradient: 'bg-gradient-to-br from-slate-500/30 to-zinc-500/30',
    thumbnail: 'https://img.gamepix.com/games/minesweeper/cover/minesweeper.png?w=500&ar=16:10', providerGameId: 'minesweeper', officialUrl: 'https://www.gamepix.com/play/minesweeper'
  }),
  createGamePixGame({
    slug: '2048', title: '2048', width: 600, height: 800,
    description: 'Slide matching number tiles together and build your way to the 2048 tile.',
    longDescription: 'A classic 4x4 number puzzle where planning every move is essential to keeping the board open.',
    instructions: 'Use W/A/S/D or the arrow keys to slide tiles. Matching values merge into one larger tile.',
    genre: ['Puzzle', 'Math', 'Brain'], genreFilter: 'Puzzle', tags: ['2048', 'math', 'numbers', 'brain', 'puzzle'],
    rating: 8.6, platform: 'Multi', releaseYear: 2014, category: 'Puzzle', initials: '2048',
    gradient: 'bg-gradient-to-br from-amber-500/30 to-orange-500/30',
    thumbnail: 'https://img.gamepix.com/games/2048/cover/2048.png?w=500&ar=16:10', providerGameId: '2048', officialUrl: 'https://www.gamepix.com/play/2048'
  }),
  createGamePixGame({
    slug: 'daily-solitaire-blue', title: 'Daily Solitaire Blue', width: 800, height: 600,
    description: 'A daily solitaire challenge with new card puzzles and a smooth, relaxing pace.',
    longDescription: 'Complete daily card challenges using classic descending and alternating-color solitaire rules.',
    instructions: 'Drag cards to build descending alternating-color piles and complete the four suit stacks.',
    genre: ['Cards', 'Solitaire', 'Casual'], genreFilter: 'Cards', tags: ['solitaire', 'daily', 'cards', 'klondike'],
    rating: 8.2, platform: 'Multi', releaseYear: 2022, category: 'Cards', initials: 'DSB',
    gradient: 'bg-gradient-to-br from-emerald-500/30 to-teal-500/30',
    thumbnail: 'https://img.gamepix.com/games/daily-solitaire-blue/cover/daily-solitaire-blue.png?w=500&ar=16:10', providerGameId: 'daily-solitaire-blue', officialUrl: 'https://www.gamepix.com/play/daily-solitaire-blue'
  }),

  createGamePixGame({
    slug: 'battle-shot-elite', title: 'Battle Shot Elite', width: 800, height: 600,
    description: 'An action-packed browser shooter with fast battles, rewards and tactical combat.',
    longDescription: 'Jump into an intense 3D shooter experience with missions, weapons and battlefield action.',
    instructions: 'Use WASD to move, mouse to aim and shoot, SPACE to jump and R to reload.',
    genre: ['Action', 'Shooter', 'FPS'], genreFilter: 'Action', tags: ['shooter', 'fps', '3d', 'battle'],
    rating: 8.8, platform: 'Multi', releaseYear: 2026, category: 'Action', initials: 'BSE',
    gradient: 'bg-gradient-to-br from-red-500/30 to-orange-500/30',
    thumbnail: 'https://img.gamepix.com/941884f64e32420fb9791859d7d3fba3-512x384.jpg',
    providerGameId: 'battle-shot-elite', officialUrl: 'https://www.gamepix.com/play/battle-shot-elite'
  }),
  createGamePixGame({
    slug: 'commando-force-2', title: 'Commando Force 2', width: 800, height: 600,
    description: 'Enter intense combat missions, aim carefully and defeat enemies across challenging battlefields.',
    longDescription: 'Take on enemy forces in a browser FPS designed for quick action sessions.',
    instructions: 'Use WASD to move, mouse buttons to aim and shoot, R to reload and SPACE to jump.',
    genre: ['Action', 'Shooter', 'War'], genreFilter: 'Action', tags: ['commando', 'shooter', 'war', 'fps'],
    rating: 8.6, platform: 'Multi', releaseYear: 2026, category: 'Action', initials: 'CF2',
    gradient: 'bg-gradient-to-br from-slate-500/30 to-red-500/30',
    thumbnail: 'https://img.gamepix.com/games/commando-force-2/cover/commando-force-2.png?w=500&ar=16:10',
    providerGameId: 'commando-force-2', officialUrl: 'https://play.gamepix.com/commando-force-2/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'nitro-speed-2-underground', title: 'Nitro Speed 2 Underground', width: 800, height: 600,
    description: 'High-speed underground racing with nitro boosts, city driving and challenging races.',
    longDescription: 'Drive powerful sports cars through a neon city and master multiple racing modes.',
    instructions: 'Use WASD or arrow keys to drive, Space for handbrake and R to repair.',
    genre: ['Racing', 'Driving', '3D'], genreFilter: 'Racing', tags: ['car', 'racing', 'speed', 'nitro'],
    rating: 8.9, platform: 'Multi', releaseYear: 2026, category: 'Racing', initials: 'NS2',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-purple-500/30',
    thumbnail: 'https://img.gamepix.com/7fd4526a87eb46b9844e0bedd1735772-512x384.jpg',
    providerGameId: 'nitro-speed-2-underground', officialUrl: 'https://www.gamepix.com/play/nitro-speed-2-underground'
  }),
  createGamePixGame({
    slug: 'racing-in-city', title: 'Racing in City', width: 800, height: 600,
    description: 'Dodge traffic, complete challenges and build your driving career through a busy city.',
    longDescription: 'A city driving game with multiple tracks, cars, upgrades and traffic challenges.',
    instructions: 'Use WASD or arrow keys to control the car. Use Shift for slow motion.',
    genre: ['Racing', 'Driving', 'Cars'], genreFilter: 'Racing', tags: ['car', 'city', 'drift', 'parking'],
    rating: 8.5, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'RIC',
    gradient: 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30',
    thumbnail: 'https://img.gamepix.com/670fce13db0d4edbb396fa155db80f11-512x384.jpg',
    providerGameId: 'racing-in-city', officialUrl: 'https://www.gamepix.com/play/racing-in-city'
  }),
  createGamePixGame({
    slug: 'boat-game-racing-simulator-3d', title: 'Boat Game: Racing Simulator 3D', width: 960, height: 600,
    description: 'Race powerful boats and jet skis through waterways, ramps and extreme stunt courses.',
    longDescription: 'A 3D water racing simulator featuring speed, jumps, opponents and challenging courses.',
    instructions: 'Use W, A, S and D to control your boat and navigate the course.',
    genre: ['Racing', 'Simulation', 'Sports'], genreFilter: 'Racing', tags: ['boat', 'water', 'racing', '3d'],
    rating: 8.1, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'BRS',
    gradient: 'bg-gradient-to-br from-sky-500/30 to-cyan-500/30',
    thumbnail: 'https://img.gamepix.com/f4b1cfeb63274fcd9e11df58a55c72ee-512x384.jpg',
    providerGameId: 'boat-game-racing-simulator-3d', officialUrl: 'https://www.gamepix.com/play/boat-game-racing-simulator-3d'
  }),
  createGamePixGame({
    slug: 'siege-break', title: 'Siege Break', width: 800, height: 600,
    description: 'Defend your fortress, deploy heroes and survive waves of attacking enemies.',
    longDescription: 'A fantasy defense game where you manage heroes and stop enemies before your base falls.',
    instructions: 'Drag heroes onto defense slots, refresh your choices and start each wave with Fight.',
    genre: ['Strategy', 'Defense', 'Battle'], genreFilter: 'Strategy', tags: ['defense', 'tower-defense', 'heroes', 'battle'],
    rating: 8.4, platform: 'Multi', releaseYear: 2026, category: 'Strategy', initials: 'SB',
    gradient: 'bg-gradient-to-br from-emerald-500/30 to-amber-500/30',
    thumbnail: 'https://img.gamepix.com/23b2fe26392247f49fb73598a5797e16-512x384.jpg',
    providerGameId: 'siege-break', officialUrl: 'https://www.gamepix.com/play/siege-break'
  }),
  createGamePixGame({
    slug: 'gun-shooting-games-sniper-3d', title: 'Gun Shooting Games Sniper 3D', width: 1280, height: 720,
    description: 'Test your precision in an immersive 3D sniper challenge with missions and targets.',
    longDescription: 'A first-person sniper experience with challenging missions and precision shooting.',
    instructions: 'Use the mouse or tap to aim and shoot targets.',
    genre: ['Action', 'Shooter', 'Sniper'], genreFilter: 'Action', tags: ['sniper', 'fps', 'shooting', 'battlefield'],
    rating: 8.7, platform: 'Multi', releaseYear: 2026, category: 'Action', initials: 'S3D',
    gradient: 'bg-gradient-to-br from-zinc-500/30 to-blue-500/30',
    thumbnail: 'https://img.gamepix.com/c8a93a1e1e964e11b3d9803cad9e9c2c-512x384.jpg',
    providerGameId: 'gun-shooting-games-sniper-3d', officialUrl: 'https://www.gamepix.com/play/gun-shooting-games-sniper-3d'
  }),
  createGamePixGame({
    slug: 'world-cup-soccer-caps', title: 'World Cup Soccer Caps', width: 1120, height: 630,
    description: 'Flick your team, pass the ball and score goals in a fast tabletop-style soccer game.',
    longDescription: 'A skill-based football game with strategic flick shots, passing and competitive matches.',
    instructions: 'Tap or click a player, drag to set direction and power, then release to shoot.',
    genre: ['Sports', 'Football', 'Skill'], genreFilter: 'Sports', tags: ['soccer', 'football', 'sport', '2players'],
    rating: 8.3, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'WCS',
    gradient: 'bg-gradient-to-br from-green-500/30 to-blue-500/30',
    thumbnail: 'https://img.gamepix.com/040ff13a2a9f44b98009750960a523ae-512x384.jpg',
    providerGameId: 'world-cup-soccer-caps', officialUrl: 'https://www.gamepix.com/play/world-cup-soccer-caps'
  }),
  createGamePixGame({
    slug: 'meme-myth-wukong', title: 'Meme Myth: Wukong', width: 800, height: 600,
    description: 'A colorful meme-themed puzzle adventure inspired by the legendary Wukong.',
    longDescription: 'Solve entertaining puzzles and progress through a playful myth-inspired browser adventure.',
    instructions: 'Use mouse or touch controls to interact with the puzzle elements.',
    genre: ['Puzzle', 'Casual', 'Adventure'], genreFilter: 'Puzzle', tags: ['puzzle', 'meme', 'wukong', 'casual'],
    rating: 7.9, platform: 'Multi', releaseYear: 2026, category: 'Puzzle', initials: 'MMW',
    gradient: 'bg-gradient-to-br from-yellow-500/30 to-pink-500/30',
    thumbnail: 'https://img.gamepix.com/e4af90c070cf499da371b44232a6aaca-512x384.jpg',
    providerGameId: 'meme-myth-wukong', officialUrl: 'https://www.gamepix.com/play/meme-myth-wukong'
  }),
  createGamePixGame({
    slug: 'hill-climb-pixel-car', title: 'Hill Climb Pixel Car', width: 900, height: 600,
    description: 'Drive a pixel car across tricky hills, balance your vehicle and reach the finish.',
    longDescription: 'A physics-based hill climbing game focused on acceleration, balance and careful driving.',
    instructions: 'Use the arrow keys or WASD to accelerate, brake and balance the car.',
    genre: ['Racing', 'Arcade', 'Driving'], genreFilter: 'Racing', tags: ['car', 'hill-climb', 'pixel', 'arcade'],
    rating: 8.2, platform: 'Multi', releaseYear: 2026, category: 'Racing', initials: 'HPC',
    gradient: 'bg-gradient-to-br from-lime-500/30 to-orange-500/30',
    thumbnail: 'https://img.gamepix.com/6d493125b300434fad9be4cf8c858bbd-512x384.jpg',
    providerGameId: 'hill-climb-pixel-car', officialUrl: 'https://www.gamepix.com/play/hill-climb-pixel-car'
  }),

  createGamePixGame({
    slug: 'tentrix', title: 'TenTrix', width: 600, height: 800,
    description: 'Place falling blocks strategically and clear rows and columns in this addictive puzzle challenge.',
    longDescription: 'TenTrix is a block puzzle where careful placement and planning help you create complete lines and keep the board open.',
    instructions: 'Drag the blocks onto the board and complete full rows or columns to clear them.',
    genre: ['Puzzle', 'Brain', 'Casual'], genreFilter: 'Puzzle', tags: ['tetris', 'blocks', 'puzzle', 'brain'], rating: 8.5, platform: 'Multi', releaseYear: 2016, category: 'Puzzle', initials: 'TTX',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/tentrix/cover/tentrix.png?w=500&ar=16:10', providerGameId: 'tentrix', officialUrl: 'https://www.gamepix.com/play/tentrix'
  }),
  createGamePixGame({
    slug: '10x10', title: '10x10!', width: 600, height: 800,
    description: 'Fit colorful blocks into a 10x10 grid and clear complete lines without running out of space.',
    longDescription: 'A simple but strategic block puzzle that rewards planning several moves ahead.',
    instructions: 'Drag each piece onto the grid. Complete rows or columns to clear them.',
    genre: ['Puzzle', 'Brain', 'Casual'], genreFilter: 'Puzzle', tags: ['10x10', 'blocks', 'logic', 'casual'], rating: 8.4, platform: 'Multi', releaseYear: 2015, category: 'Puzzle', initials: '10X',
    gradient: 'bg-gradient-to-br from-blue-500/30 to-pink-500/30', thumbnail: 'https://img.gamepix.com/games/10x10/cover/10x10.png?w=500&ar=16:10', providerGameId: '10x10', officialUrl: 'https://www.gamepix.com/play/10x10'
  }),
  createGamePixGame({
    slug: 'kobadoo-flags', title: 'Kobadoo Flags', width: 600, height: 800,
    description: 'Train your memory by remembering and reproducing sequences of colorful flags.',
    longDescription: 'Kobadoo Flags combines quick visual memory challenges with increasing difficulty.',
    instructions: 'Watch the flag sequence carefully, then reproduce it in the correct order.',
    genre: ['Puzzle', 'Brain', 'Memory'], genreFilter: 'Puzzle', tags: ['memory', 'flags', 'brain', 'logic'], rating: 7.8, platform: 'Multi', releaseYear: 2024, category: 'Puzzle', initials: 'KF',
    gradient: 'bg-gradient-to-br from-red-500/30 to-blue-500/30', thumbnail: 'https://img.gamepix.com/games/kobadoo-flags/cover/kobadoo-flags.png?w=500&ar=16:10', providerGameId: 'kobadoo-flags', officialUrl: 'https://www.gamepix.com/play/kobadoo-flags'
  }),
  createGamePixGame({
    slug: 'my-parking-lot', title: 'My Parking Lot', width: 800, height: 600,
    description: 'Untangle crowded parking lots by moving cars in the right order and opening the exit.',
    longDescription: 'A clever parking puzzle where every move matters and traffic becomes increasingly difficult.',
    instructions: 'Move cars and clear a path to the exit without blocking other vehicles.',
    genre: ['Puzzle', 'Car', 'Brain'], genreFilter: 'Puzzle', tags: ['parking', 'cars', 'logic', 'traffic'], rating: 8.3, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'MPL',
    gradient: 'bg-gradient-to-br from-orange-500/30 to-yellow-500/30', thumbnail: 'https://img.gamepix.com/games/my-parking-lot/cover/my-parking-lot.png?w=500&ar=16:10', providerGameId: 'my-parking-lot', officialUrl: 'https://www.gamepix.com/play/my-parking-lot'
  }),
  createGamePixGame({
    slug: 'ballistic', title: 'Ballistic', width: 800, height: 600,
    description: 'Aim and launch balls to break numbered blocks before they reach the bottom.',
    longDescription: 'Ballistic mixes aiming, physics and number strategy into a fast arcade puzzle.',
    instructions: 'Aim with the mouse or touch, then release to launch the balls.',
    genre: ['Puzzle', 'Arcade', 'Skill'], genreFilter: 'Puzzle', tags: ['ball', 'blocks', 'arcade', 'aim'], rating: 8.1, platform: 'Multi', releaseYear: 2019, category: 'Puzzle', initials: 'BAL',
    gradient: 'bg-gradient-to-br from-red-500/30 to-purple-500/30', thumbnail: 'https://img.gamepix.com/games/ballistic/cover/ballistic.png?w=500&ar=16:10', providerGameId: 'ballistic', officialUrl: 'https://www.gamepix.com/play/ballistic'
  }),
  createGamePixGame({
    slug: '100-doors-escape-from-prison', title: '100 Doors - Escape from Prison', width: 600, height: 800,
    description: 'Solve clever escape puzzles and unlock a hundred challenging prison doors.',
    longDescription: 'Search rooms, find clues and solve logic puzzles to progress through increasingly tricky escapes.',
    instructions: 'Tap objects, inspect clues and solve each room puzzle to unlock the next door.',
    genre: ['Puzzle', 'Adventure', 'Escape'], genreFilter: 'Puzzle', tags: ['escape', 'doors', 'logic', 'adventure'], rating: 8.0, platform: 'Multi', releaseYear: 2024, category: 'Puzzle', initials: '100D',
    gradient: 'bg-gradient-to-br from-slate-500/30 to-amber-500/30', thumbnail: 'https://img.gamepix.com/games/100-doors-escape-from-prison/cover/100-doors-escape-from-prison.png?w=500&ar=16:10', providerGameId: '100-doors-escape-from-prison', officialUrl: 'https://www.gamepix.com/play/100-doors-escape-from-prison'
  }),
  createGamePixGame({
    slug: 'prism-match-3d', title: 'Prism Match 3D', width: 800, height: 600,
    description: 'Match colorful 3D objects and clear targets in a satisfying visual puzzle.',
    longDescription: 'Rotate and inspect groups of objects to find matching pairs and complete each level.',
    instructions: 'Tap matching objects and clear the required combinations before time runs out.',
    genre: ['Puzzle', 'Match 3', '3D'], genreFilter: 'Puzzle', tags: ['match3', '3d', 'colors', 'casual'], rating: 8.2, platform: 'Multi', releaseYear: 2023, category: 'Puzzle', initials: 'PM3',
    gradient: 'bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/30', thumbnail: 'https://img.gamepix.com/games/prism-match-3d/cover/prism-match-3d.png?w=500&ar=16:10', providerGameId: 'prism-match-3d', officialUrl: 'https://www.gamepix.com/play/prism-match-3d'
  }),
  createGamePixGame({
    slug: 'art-puzzle', title: 'Art Puzzle', width: 600, height: 800,
    description: 'Rotate and arrange beautiful puzzle pieces to complete colorful artworks.',
    longDescription: 'Art Puzzle offers multiple difficulty levels and relaxing picture-completion challenges.',
    instructions: 'Tap to rotate pieces and drag them into the correct positions on the grid.',
    genre: ['Puzzle', 'Brain', 'Junior'], genreFilter: 'Puzzle', tags: ['art', 'jigsaw', 'brain', 'casual'], rating: 6, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'ART',
    gradient: 'bg-gradient-to-br from-pink-500/30 to-amber-500/30', thumbnail: 'https://img.gamepix.com/games/art-puzzle/cover/art-puzzle.png?w=500&ar=16:10', providerGameId: 'art-puzzle', officialUrl: 'https://www.gamepix.com/play/art-puzzle'
  }),
  createGamePixGame({
    slug: 'path-puzzle', title: 'Path - Puzzle', width: 600, height: 800,
    description: 'Rotate and place tiles to build a path that guides the rolling ball to its destination.',
    longDescription: 'A strategic path-building puzzle that becomes more challenging with every level.',
    instructions: 'Drag and rotate tiles to create a continuous route from the ball to the goal.',
    genre: ['Puzzle', 'Brain', 'Hyper Casual'], genreFilter: 'Puzzle', tags: ['path', 'ball', 'logic', 'tiles'], rating: 7.8, platform: 'Multi', releaseYear: 2024, category: 'Puzzle', initials: 'PATH',
    gradient: 'bg-gradient-to-br from-emerald-500/30 to-blue-500/30', thumbnail: 'https://img.gamepix.com/games/path-puzzle/cover/path-puzzle.png?w=500&ar=16:10', providerGameId: 'path-puzzle', officialUrl: 'https://www.gamepix.com/play/path-puzzle'
  }),
  createGamePixGame({
    slug: 'puzzle-drive', title: 'Puzzle Drive', width: 800, height: 600,
    description: 'Solve puzzles to move your car forward, collect coins and unlock new environments.',
    longDescription: 'Puzzle Drive combines directional puzzles with car progression and increasingly tricky stages.',
    instructions: 'Swipe or use directional controls to solve each puzzle and advance the car.',
    genre: ['Puzzle', 'Car', 'Brain'], genreFilter: 'Puzzle', tags: ['car', 'puzzle', 'driving', 'levels'], rating: 8.8, platform: 'Multi', releaseYear: 2026, category: 'Puzzle', initials: 'PD',
    gradient: 'bg-gradient-to-br from-blue-500/30 to-orange-500/30', thumbnail: 'https://img.gamepix.com/games/puzzle-drive/cover/puzzle-drive.png?w=500&ar=16:10', providerGameId: 'puzzle-drive', officialUrl: 'https://www.gamepix.com/play/puzzle-drive'
  }),
  createGamePixGame({
    slug: 'screw-puzzle', title: 'Screw Puzzle: Nuts & Bolts', width: 600, height: 800,
    description: 'Remove screws, nuts and bolts in the correct order to dismantle intricate structures.',
    longDescription: 'A mechanical brain teaser where planning and gravity are essential to solving each level.',
    instructions: 'Tap screws to remove them and plan the order so pieces can fall away safely.',
    genre: ['Puzzle', 'Brain', 'Skill'], genreFilter: 'Puzzle', tags: ['screw', 'nuts', 'bolts', 'mechanical'], rating: 6, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'SP',
    gradient: 'bg-gradient-to-br from-zinc-500/30 to-cyan-500/30', thumbnail: 'https://img.gamepix.com/games/screw-puzzle/cover/screw-puzzle.png?w=500&ar=16:10', providerGameId: 'screw-puzzle', officialUrl: 'https://www.gamepix.com/play/screw-puzzle'
  }),
  createGamePixGame({
    slug: 'goods-sort-puzzle', title: 'Goods Sort Puzzle', width: 600, height: 800,
    description: 'Sort colorful products into matching groups and bring order to a chaotic market.',
    longDescription: 'A visual sorting game that tests recognition, planning and speed across many levels.',
    instructions: 'Click products and place them into the correct matching storage groups.',
    genre: ['Puzzle', 'Sorting', 'Casual'], genreFilter: 'Puzzle', tags: ['sorting', 'goods', 'match', 'casual'], rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'GSP',
    gradient: 'bg-gradient-to-br from-lime-500/30 to-pink-500/30', thumbnail: 'https://img.gamepix.com/games/goods-sort-puzzle/cover/goods-sort-puzzle.png?w=500&ar=16:10', providerGameId: 'goods-sort-puzzle', officialUrl: 'https://www.gamepix.com/play/goods-sort-puzzle'
  }),
  createGamePixGame({
    slug: 'puzzlebot', title: 'Puzzlebot', width: 600, height: 800,
    description: 'Complete jigsaw-style pictures across several difficulty levels with helpful hints.',
    longDescription: 'Puzzlebot offers seven picture puzzles with multiple difficulty settings for casual and expert players.',
    instructions: 'Drag and drop pieces into their correct positions. Use hints when you get stuck.',
    genre: ['Puzzle', 'Brain', 'Jigsaw'], genreFilter: 'Puzzle', tags: ['jigsaw', 'robot', 'brain', 'pictures'], rating: 8.6, platform: 'Multi', releaseYear: 2023, category: 'Puzzle', initials: 'PB',
    gradient: 'bg-gradient-to-br from-sky-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/puzzlebot/cover/puzzlebot.png?w=500&ar=16:10', providerGameId: 'puzzlebot', officialUrl: 'https://www.gamepix.com/play/puzzlebot'
  }),
  createGamePixGame({
    slug: 'slime-adventure', title: 'Slime Adventure', width: 800, height: 600,
    description: 'Guide a green slime through dangerous levels, avoid hazards and defeat enemies.',
    longDescription: 'A colorful action platformer featuring jumping, shooting and increasingly difficult stages.',
    instructions: 'Use A/D or arrow keys to move, Space to jump and the mouse to shoot.',
    genre: ['Action', 'Platformer', 'Shooter'], genreFilter: 'Action', tags: ['slime', 'platformer', 'shooter', 'adventure'], rating: 6, platform: 'Multi', releaseYear: 2026, category: 'Action', initials: 'SA',
    gradient: 'bg-gradient-to-br from-green-500/30 to-blue-500/30', thumbnail: 'https://img.gamepix.com/games/slime-adventure/cover/slime-adventure.png?w=500&ar=16:10', providerGameId: 'slime-adventure', officialUrl: 'https://www.gamepix.com/play/slime-adventure'
  }),
  createGamePixGame({
    slug: 'platforms', title: 'Platforms', width: 800, height: 600,
    description: 'Jump across dangerous platforms, dodge obstacles and battle enemies with your sword.',
    longDescription: 'A 3D platform action game with parkour movement, sword combat and challenging obstacles.',
    instructions: 'WASD to move, Space to jump, C to crouch, 1/2 to equip or unequip the sword, and mouse buttons to attack or block.',
    genre: ['Action', 'Battle', 'Platformer'], genreFilter: 'Action', tags: ['platformer', 'sword', 'parkour', '3d'], rating: 6, platform: 'PC', releaseYear: 2026, category: 'Action', initials: 'PLT',
    gradient: 'bg-gradient-to-br from-indigo-500/30 to-amber-500/30', thumbnail: 'https://img.gamepix.com/games/platforms/cover/platforms.png?w=500&ar=16:10', providerGameId: 'platforms', officialUrl: 'https://www.gamepix.com/play/platforms'
  }),
  createGamePixGame({
    slug: 'f1-racing-game', title: 'F1 Racing Game', width: 800, height: 600,
    description: 'Race across 30 dynamic tracks, outsmart AI rivals and improve your car as you progress.',
    longDescription: 'A fast racing game with multiple tracks, car customization and strategic use of speed boosts.',
    instructions: 'Use the arrow keys to drive, Space to slow down and Shift for extra speed.',
    genre: ['Racing', 'Car', 'Driving'], genreFilter: 'Racing', tags: ['f1', 'racing', 'cars', 'speed'], rating: 8.6, platform: 'Multi', releaseYear: 2021, category: 'Racing', initials: 'F1',
    gradient: 'bg-gradient-to-br from-red-500/30 to-slate-500/30', thumbnail: 'https://img.gamepix.com/games/f1-racing-game/cover/f1-racing-game.png?w=500&ar=16:10', providerGameId: 'f1-racing-game', officialUrl: 'https://www.gamepix.com/play/f1-racing-game'
  }),
  createGamePixGame({
    slug: 'racing-cars-game', title: 'Racing Cars Game', width: 800, height: 600,
    description: 'Win fast races, earn rewards and upgrade your cars as you climb the leaderboard.',
    longDescription: 'A classic browser racing game focused on speed, track control and vehicle progression.',
    instructions: 'Use the arrow keys to steer, accelerate and brake. Time your braking carefully at corners.',
    genre: ['Racing', 'Car', 'Driving'], genreFilter: 'Racing', tags: ['racing', 'cars', 'speed', 'leaderboard'], rating: 8.2, platform: 'Multi', releaseYear: 2021, category: 'Racing', initials: 'RCG',
    gradient: 'bg-gradient-to-br from-orange-500/30 to-blue-500/30', thumbnail: 'https://img.gamepix.com/games/racing-cars-game/cover/racing-cars-game.png?w=500&ar=16:10', providerGameId: 'racing-cars-game', officialUrl: 'https://www.gamepix.com/play/racing-cars-game'
  }),
  createGamePixGame({
    slug: 'street-racing', title: 'Street Racing', width: 800, height: 600,
    description: 'Race through classic 2D tracks, collect fuel and speed boosts and beat rival drivers.',
    longDescription: 'A retro-style street racer with varied tracks, fuel management and strategic boost timing.',
    instructions: 'Use the arrow keys to steer and control speed. Collect fuel and save boosts for overtaking.',
    genre: ['Racing', 'Driving', 'Car'], genreFilter: 'Racing', tags: ['street', 'racing', 'retro', 'cars'], rating: 8.4, platform: 'PC', releaseYear: 2019, category: 'Racing', initials: 'STR',
    gradient: 'bg-gradient-to-br from-purple-500/30 to-yellow-500/30', thumbnail: 'https://img.gamepix.com/games/street-racing/cover/street-racing.png?w=500&ar=16:10', providerGameId: 'street-racing', officialUrl: 'https://www.gamepix.com/play/street-racing'
  }),
  createGamePixGame({
    slug: 'goals', title: 'Goals', width: 800, height: 600,
    description: 'Outsmart an AI opponent in a fast arcade soccer battle and score your way to victory.',
    longDescription: 'Goals combines quick action with tactical ball control and progressively harder opponents.',
    instructions: 'Use keyboard or touch controls to move, attack and score. Watch the opponent for openings.',
    genre: ['Sports', 'Soccer', 'Arcade'], genreFilter: 'Sports', tags: ['soccer', 'football', 'arcade', 'goal'], rating: 6, platform: 'Multi', releaseYear: 2022, category: 'Sports', initials: 'GLS',
    gradient: 'bg-gradient-to-br from-green-500/30 to-cyan-500/30', thumbnail: 'https://img.gamepix.com/games/goals/cover/goals.png?w=500&ar=16:10', providerGameId: 'goals', officialUrl: 'https://www.gamepix.com/play/goals'
  }),
  createGamePixGame({
    slug: 'smash-karts', title: 'Smash Karts', width: 960, height: 540,
    description: 'Drive colorful karts around arenas, collect weapons and smash your rivals in chaotic battles.',
    longDescription: 'Smash Karts is a fast multiplayer kart battle with power-ups, multiple modes and arena combat.',
    instructions: 'W/Up to accelerate, A/Left and D/Right to turn, S/Down to brake, Space to use your weapon.',
    genre: ['Racing', 'Action', 'Multiplayer'], genreFilter: 'Racing', tags: ['kart', 'multiplayer', 'racing', 'io'], rating: 9.2, platform: 'Multi', releaseYear: 2020, category: 'Racing', initials: 'SK',
    gradient: 'bg-gradient-to-br from-red-500/30 to-yellow-500/30', thumbnail: 'https://img.gamepix.com/games/smash-karts/cover/smash-karts.png?w=500&ar=16:10', providerGameId: 'smash-karts', officialUrl: 'https://www.gamepix.com/play/smash-karts'
  }),
  createGamePixGame({
    slug: 'madalin-stunt-cars-2', title: 'Madalin Stunt Cars 2', width: 960, height: 540,
    description: 'Explore open stunt maps, drive supercars, use nitro and perform spectacular jumps.',
    longDescription: 'An open-world stunt driving game with ramps, multiple cars, maps and multiplayer-style driving.',
    instructions: 'W/Up accelerate, S/Down brake, A/D steer, Space brake, Shift nitro, R reset the car.',
    genre: ['Racing', 'Driving', 'Drifting'], genreFilter: 'Racing', tags: ['stunts', 'cars', 'drifting', '3d'], rating: 8.8, platform: 'PC', releaseYear: 2019, category: 'Racing', initials: 'MSC2',
    gradient: 'bg-gradient-to-br from-blue-500/30 to-orange-500/30', thumbnail: 'https://img.gamepix.com/games/madalin-stunt-cars-2/cover/madalin-stunt-cars-2.png?w=500&ar=16:10', providerGameId: 'agame-stunt-car', officialUrl: 'https://www.gamepix.com/play/agame-stunt-car'
  }),
  createGamePixGame({
    slug: 'dynamons', title: 'Dynamons', width: 600, height: 800,
    description: 'Build a monster team, master special abilities and win strategic turn-based battles.',
    longDescription: 'Dynamons is an RPG adventure focused on collecting creatures, training them and choosing the right skills in combat.',
    instructions: 'Use point-and-click or touch controls to move, battle and manage your Dynamon team.',
    genre: ['RPG', 'Battle', 'Monster'], genreFilter: 'Adventure', tags: ['rpg', 'monster', 'battle', 'dynamons'], rating: 9, platform: 'Multi', releaseYear: 2021, category: 'Adventure', initials: 'DYN',
    gradient: 'bg-gradient-to-br from-violet-500/30 to-emerald-500/30', thumbnail: 'https://img.gamepix.com/games/dynamons/cover/dynamons.png?w=500&ar=16:10', providerGameId: 'dynamons', officialUrl: 'https://www.gamepix.com/play/dynamons'
  }),
  createGamePixGame({
    slug: 'bomber-friends', title: 'Bomber Friends', width: 800, height: 600,
    description: 'Blast through maze-like levels, destroy blocks, defeat enemies and collect powerful upgrades.',
    longDescription: 'A colorful action puzzle with bomb placement, destructible blocks, upgrades and strategic movement.',
    instructions: 'Use arrow keys to move and A to place a bomb. Keep your escape route clear.',
    genre: ['Action', 'Arcade', 'Two Player'], genreFilter: 'Action', tags: ['bomber', 'bomb', 'arcade', 'action'], rating: 8.6, platform: 'Multi', releaseYear: 2017, category: 'Action', initials: 'BF',
    gradient: 'bg-gradient-to-br from-yellow-500/30 to-red-500/30', thumbnail: 'https://img.gamepix.com/games/bomber-friends/cover/bomber-friends.png?w=500&ar=16:10', providerGameId: 'bomber-friends', officialUrl: 'https://www.gamepix.com/play/bomber-friends'
  }),
  createGamePixGame({
    slug: 'body-drop-3d', title: 'Body Drop 3D', width: 800, height: 600,
    description: 'A physics-based ragdoll challenge where you aim for spectacular crashes and high scores.',
    longDescription: 'Body Drop 3D combines ragdoll physics and precision aiming across a series of creative obstacle-filled stages.',
    instructions: 'Move the cursor to aim and use the mouse to interact with the crash dummy.',
    genre: ["Simulation", "Skill", "Physics"], genreFilter: 'Simulation', tags: ["ragdoll", "physics", "simulation", "skill"], rating: 9.2, platform: 'PC', releaseYear: 2022, category: 'Simulation', initials: 'BD',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/body-drop-3d/cover/body-drop-3d.png?w=500&ar=16:10', providerGameId: 'body-drop-3d', officialUrl: 'https://www.gamepix.com/play/body-drop-3d'
  }),
  createGamePixGame({
    slug: 'bloxd-io', title: 'Bloxd.io', width: 960, height: 600,
    description: 'Explore a blocky multiplayer sandbox packed with building, parkour, survival and competitive modes.',
    longDescription: 'Bloxd.io is a browser voxel sandbox with multiple game modes, from building and survival to parkour and Bed Wars.',
    instructions: 'Use WASD or arrow keys to move and follow the controls shown by the selected game mode.',
    genre: ["Adventure", "Multiplayer", "Building"], genreFilter: 'Adventure', tags: ["io", "sandbox", "minecraft", "building", "multiplayer"], rating: 8.8, platform: 'PC', releaseYear: 2023, category: 'Adventure', initials: 'BIO',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/bloxd-io/cover/bloxd-io.png?w=500&ar=16:10', providerGameId: 'bloxd-io', officialUrl: 'https://www.gamepix.com/play/bloxd-io'
  }),
  createGamePixGame({
    slug: 'slope-racing-3d', title: 'Slope Racing 3D', width: 800, height: 600,
    description: 'Steer a rolling ball down an endless neon slope while avoiding obstacles and chasing a high score.',
    longDescription: 'A fast reflex runner where the track becomes narrower and more challenging as you descend.',
    instructions: 'Use A/D or the left and right arrow keys to steer. Stay on the track and avoid red obstacles.',
    genre: ["Arcade", "Racing", "Skill"], genreFilter: 'Arcade', tags: ["ball", "slope", "arcade", "runner", "reflex"], rating: 9.0, platform: 'Multi', releaseYear: 2020, category: 'Arcade', initials: 'SR3',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/slope-racing-3d/cover/slope-racing-3d.png?w=500&ar=16:10', providerGameId: 'slope-racing-3d', officialUrl: 'https://www.gamepix.com/play/slope-racing-3d'
  }),
  createGamePixGame({
    slug: 'yummy-tales', title: 'Yummy Tales', width: 800, height: 600,
    description: 'Match colorful fruits and vegetables to complete fun farm challenges and feed hungry animals.',
    longDescription: 'Yummy Tales is a cheerful match-3 adventure with hundreds of levels, missions and progressively harder boards.',
    instructions: 'Swap adjacent tiles to make matches of three or more identical items.',
    genre: ["Puzzle", "Match 3", "Kids"], genreFilter: 'Puzzle', tags: ["match3", "farm", "animals", "casual", "puzzle"], rating: 9.0, platform: 'Multi', releaseYear: 2021, category: 'Puzzle', initials: 'YT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/yummy-tales/cover/yummy-tales.png?w=500&ar=16:10', providerGameId: 'yummy-tales', officialUrl: 'https://www.gamepix.com/play/yummy-tales'
  }),
  createGamePixGame({
    slug: 'dragon-simulator-3d', title: 'Dragon Simulator 3D', width: 960, height: 600,
    description: 'Take flight as a powerful dragon, explore a fantasy world and battle enemies from the skies.',
    longDescription: 'Explore a fantasy realm as a dragon, complete objectives, survive encounters and grow stronger.',
    instructions: 'Use WASD or arrow keys to move, mouse to look, left click for fireballs and right click for melee.',
    genre: ["Adventure", "Simulation", "Battle"], genreFilter: 'Adventure', tags: ["dragon", "fantasy", "simulator", "action", "flight"], rating: 8.8, platform: 'Multi', releaseYear: 2025, category: 'Adventure', initials: 'DS3',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/dragon-simulator-3d/cover/dragon-simulator-3d.png?w=500&ar=16:10', providerGameId: 'dragon-simulator-3d', officialUrl: 'https://www.gamepix.com/play/dragon-simulator-3d'
  }),
  createGamePixGame({
    slug: 'rovercraft', title: 'Rovercraft', width: 800, height: 600,
    description: 'Build and drive a customizable rover across challenging alien terrain while managing energy and balance.',
    longDescription: 'Drive an engineered rover across space surfaces, improve its design and complete missions without running out of energy.',
    instructions: 'Use the left and right arrow keys to control the rover and keep the vehicle balanced.',
    genre: ["Racing", "Driving", "Physics"], genreFilter: 'Racing', tags: ["rover", "space", "driving", "physics", "upgrade"], rating: 8.8, platform: 'Multi', releaseYear: 2024, category: 'Racing', initials: 'RC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/rovercraft/cover/rovercraft.png?w=500&ar=16:10', providerGameId: 'rovercraft', officialUrl: 'https://www.gamepix.com/play/rovercraft'
  }),
  createGamePixGame({
    slug: 'mr-racer-car-racing-game', title: 'MR RACER - Car Racing', width: 960, height: 600,
    description: 'Race through fast 3D events, overtake rivals and climb the rankings as a rising street racer.',
    longDescription: 'Compete in a progression of racing events, improve your performance and work toward the top of the leaderboard.',
    instructions: 'Use WASD or arrow keys to steer and accelerate. Follow the on-screen controls for additional actions.',
    genre: ["Racing", "Driving", "Drifting"], genreFilter: 'Racing', tags: ["racing", "cars", "drift", "3d", "speed"], rating: 8.6, platform: 'Multi', releaseYear: 2024, category: 'Racing', initials: 'MR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/mr-racer-car-racing-game/cover/mr-racer-car-racing-game.png?w=500&ar=16:10', providerGameId: 'mr-racer-car-racing-game', officialUrl: 'https://www.gamepix.com/play/mr-racer-car-racing-game'
  }),
  createGamePixGame({
    slug: 'demolition-derby-life', title: 'Demolition Derby Life', width: 960, height: 600,
    description: 'Survive chaotic car crashes, smash rival vehicles and upgrade your ride between derby matches.',
    longDescription: 'Enter demolition arenas, manage your vehicle armor and use smart positioning to outlast the competition.',
    instructions: 'W/Up accelerates, S/Down reverses, A/D steer and Space activates nitro.',
    genre: ["Racing", "Driving", "Action"], genreFilter: 'Racing', tags: ["demolition", "cars", "crash", "derby", "driving"], rating: 9.0, platform: 'Multi', releaseYear: 2024, category: 'Racing', initials: 'DDL',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/demolition-derby-life/cover/demolition-derby-life.png?w=500&ar=16:10', providerGameId: 'demolition-derby-life', officialUrl: 'https://www.gamepix.com/play/demolition-derby-life'
  }),
  createGamePixGame({
    slug: 'ultimate-offroad-cars-2', title: 'Ultimate OffRoad Cars 2', width: 960, height: 600,
    description: 'Take powerful 4x4 vehicles across steep mountains and rugged terrain in a demanding driving simulator.',
    longDescription: 'Master difficult off-road routes, manage traction and use your vehicle systems to navigate extreme terrain.',
    instructions: 'Use W/Up to accelerate and S/Down to brake or reverse. Use the mouse to control the camera.',
    genre: ["Racing", "Driving", "Simulation"], genreFilter: 'Racing', tags: ["offroad", "4x4", "cars", "mountain", "simulator"], rating: 8.8, platform: 'Multi', releaseYear: 2022, category: 'Racing', initials: 'UOC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/ultimate-offroad-cars-2/cover/ultimate-offroad-cars-2.png?w=500&ar=16:10', providerGameId: 'ultimate-offroad-cars-2', officialUrl: 'https://www.gamepix.com/play/ultimate-offroad-cars-2'
  }),
  createGamePixGame({
    slug: 'dynamons-6', title: 'Dynamons 6', width: 600, height: 800,
    description: 'Build a team of powerful creatures, capture new Dynamons and win strategic turn-based battles.',
    longDescription: 'Explore new areas, collect creatures and build a balanced team using different attacks and abilities.',
    instructions: 'Click or tap to move, select attacks during battles and capture creatures as you progress.',
    genre: ["RPG", "Battle", "Monster"], genreFilter: 'Adventure', tags: ["dynamons", "rpg", "monster", "battle", "adventure"], rating: 9.0, platform: 'Multi', releaseYear: 2023, category: 'Adventure', initials: 'D6',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30', thumbnail: 'https://img.gamepix.com/games/dynamons-6/cover/dynamons-6.png?w=500&ar=16:10', providerGameId: 'dynamons-6', officialUrl: 'https://www.gamepix.com/play/dynamons-6'
  }),
  createGamePixGame({
    slug: 'basketball-stars', title: 'Basketball Stars', width: 800, height: 600,
    description: 'Compete in fast basketball matches, score spectacular shots and challenge AI or a local opponent.',
    longDescription: 'A polished arcade basketball experience with quick matches and competitive two-player action.',
    instructions: 'Use the keyboard or touch controls shown in-game to move, defend and shoot.',
    genre: ["Sports", "Basketball", "Two Player"], genreFilter: 'Sports', tags: ["basketball", "sports", "2player", "skill"],
    rating: 9.0, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'BS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/basketball-stars/cover/basketball-stars.png?w=500&ar=16:10', providerGameId: 'basketball-stars', officialUrl: 'https://www.gamepix.com/play/basketball-stars'
  }),
  createGamePixGame({
    slug: 'hoop-world', title: 'Hoop World', width: 800, height: 600,
    description: 'Perform spectacular basketball flips, jumps and dunks while mastering timing and precision.',
    longDescription: 'A 3D basketball arcade challenge focused on aerial tricks, accurate landings and stylish dunks.',
    instructions: 'Use the mouse or touch controls to start jumps, control flips and release at the right moment for a dunk.',
    genre: ["Sports", "Basketball", "Arcade"], genreFilter: 'Sports', tags: ["basketball", "dunk", "arcade", "sports"],
    rating: 9.0, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'HW',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/hoop-world/cover/hoop-world.png?w=500&ar=16:10', providerGameId: 'hoop-world', officialUrl: 'https://play.gamepix.com/hoop-world/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'ultimate-flying-car', title: 'Ultimate Flying Car', width: 960, height: 600,
    description: 'Race powerful cars on roads and in the sky while mastering high-speed driving and flight.',
    longDescription: 'A hybrid driving and flying game with racing, free-roam and two-player features.',
    instructions: 'Player 1 uses WASD; Player 2 uses arrow keys. Follow the on-screen controls for boost and flight.',
    genre: ["Racing", "Driving", "Flight"], genreFilter: 'Racing', tags: ["racing", "cars", "flying", "2player"],
    rating: 8.8, platform: 'PC', releaseYear: 2025, category: 'Racing', initials: 'UFC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/ultimate-flying-car/cover/ultimate-flying-car.png?w=500&ar=16:10', providerGameId: 'ultimate-flying-car', officialUrl: 'https://play.gamepix.com/ultimate-flying-car/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'copa-toon', title: 'Toon Cup', width: 960, height: 600,
    description: 'Choose a cartoon team and compete in energetic football matches for cup glory.',
    longDescription: 'A fast 2D football game with tournament and quick-match modes and simple keyboard controls.',
    instructions: 'Use WASD or arrow keys to move and Space to kick, pass or tackle.',
    genre: ["Sports", "Soccer", "World Cup"], genreFilter: 'Sports', tags: ["soccer", "football", "cartoon", "sports"],
    rating: 9.0, platform: 'PC', releaseYear: 2025, category: 'Sports', initials: 'TC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/copa-toon/cover/copa-toon.png?w=500&ar=16:10', providerGameId: 'copa-toon', officialUrl: 'https://www.gamepix.com/play/copa-toon'
  }),
  createGamePixGame({
    slug: 'flip-trickster-parkour-simulator', title: 'Flip Trickster - Parkour Simulator', width: 960, height: 600,
    description: 'Perform backflips, spins and precision landings across challenging parkour stages.',
    longDescription: 'A physics-focused parkour simulator where timing and controlled landings are essential.',
    instructions: 'Use touchscreen or arrow-key controls and trigger flips at the right moment.',
    genre: ["Sports", "Simulation", "Parkour"], genreFilter: 'Sports', tags: ["parkour", "flips", "stunts", "skill"],
    rating: 8.6, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'FT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/flip-trickster-parkour-simulator/cover/flip-trickster-parkour-simulator.png?w=500&ar=16:10', providerGameId: 'flip-trickster-parkour-simulator', officialUrl: 'https://www.gamepix.com/play/flip-trickster-parkour-simulator'
  }),
  createGamePixGame({
    slug: '3d-bowling', title: '3D Bowling', width: 800, height: 600,
    description: 'Aim, curve and launch the bowling ball to knock down all ten pins and chase high scores.',
    longDescription: 'A classic bowling experience with precision aiming, spin and multiple frames.',
    instructions: 'Aim with the mouse or touch controls, adjust power and release the ball.',
    genre: ["Sports", "Bowling", "Skill"], genreFilter: 'Sports', tags: ["bowling", "sports", "ball", "precision"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: '3DB',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/3d-bowling/cover/3d-bowling.png?w=500&ar=16:10', providerGameId: '3d-bowling', officialUrl: 'https://www.gamepix.com/play/3d-bowling'
  }),
  createGamePixGame({
    slug: '8-ball-billiards-classic', title: '8 Ball Billiards Classic', width: 800, height: 600,
    description: 'Play classic eight-ball pool with realistic aiming and shot power.',
    longDescription: 'A browser billiards game where precision, positioning and strategy decide each frame.',
    instructions: 'Aim with the mouse, set shot power and drag/release to strike the cue ball.',
    genre: ["Sports", "Pool", "Skill"], genreFilter: 'Sports', tags: ["pool", "billiards", "8ball", "sports"],
    rating: 8.2, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: '8B',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/8-ball-billiards-classic/cover/8-ball-billiards-classic.png?w=500&ar=16:10', providerGameId: '8-ball-billiards-classic', officialUrl: 'https://www.gamepix.com/play/8-ball-billiards-classic'
  }),
  createGamePixGame({
    slug: 'boxing-stars', title: 'Boxing Stars', width: 800, height: 600,
    description: 'Enter the ring, punch, block and dodge opponents as you work toward championship glory.',
    longDescription: 'An arcade boxing game featuring progressive fights, upgrades and increasingly tough opponents.',
    instructions: 'Tap or use the on-screen controls to punch, block and dodge.',
    genre: ["Sports", "Boxing", "Fighting"], genreFilter: 'Sports', tags: ["boxing", "sports", "fighting", "skill"],
    rating: 8.2, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'BX',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/boxing-stars/cover/boxing-stars.png?w=500&ar=16:10', providerGameId: 'boxing-stars', officialUrl: 'https://www.gamepix.com/play/boxing-stars'
  }),
  createGamePixGame({
    slug: 'classic-bowling', title: 'Classic Bowling', width: 800, height: 600,
    description: 'Roll for strikes in a simple classic bowling challenge with responsive controls.',
    longDescription: 'A casual bowling game focused on timing, angle and consistent throws.',
    instructions: 'Use mouse or touch controls to aim, set power and release the ball.',
    genre: ["Sports", "Bowling", "Casual"], genreFilter: 'Sports', tags: ["bowling", "classic", "sports", "casual"],
    rating: 6.8, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'CB',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/classic-bowling/cover/classic-bowling.png?w=500&ar=16:10', providerGameId: 'classic-bowling', officialUrl: 'https://www.gamepix.com/play/classic-bowling'
  }),
  createGamePixGame({
    slug: 'race', title: 'Race', width: 960, height: 600,
    description: 'Choose a car, master varied tracks and race through challenging obstacles and weather.',
    longDescription: 'A browser racing game with multiple tracks, car abilities and competitive events.',
    instructions: 'Use the keyboard or controller controls shown in-game to steer and accelerate.',
    genre: ["Racing", "Arcade", "Driving"], genreFilter: 'Racing', tags: ["racing", "cars", "arcade", "speed"],
    rating: 6.0, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'R',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/race/cover/race.png?w=500&ar=16:10', providerGameId: 'race', officialUrl: 'https://www.gamepix.com/play/race'
  }),
  createGamePixGame({
    slug: 'racing-project-kit', title: 'Racing Project Kit', width: 960, height: 600,
    description: 'Race customizable cars, design tracks and compete in challenging driving events.',
    longDescription: 'A racing sandbox that mixes competitive laps with track creation and vehicle customization.',
    instructions: 'Use arrow keys to steer and Space to brake; follow the in-game controls for the editor.',
    genre: ["Racing", "Driving", "Sports"], genreFilter: 'Racing', tags: ["racing", "cars", "track", "multiplayer"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'RPK',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/racing-project-kit/cover/racing-project-kit.png?w=500&ar=16:10', providerGameId: 'racing-project-kit', officialUrl: 'https://www.gamepix.com/play/racing-project-kit'
  }),
  createGamePixGame({
    slug: 'boat-drive', title: 'Boat Drive', width: 960, height: 600,
    description: 'Take control of a speedboat and navigate fast water courses while chasing the best time.',
    longDescription: 'A browser boat-racing challenge built around speed, steering and obstacle avoidance.',
    instructions: 'Use the on-screen or keyboard controls to steer and accelerate.',
    genre: ["Racing", "Driving", "Water"], genreFilter: 'Racing', tags: ["boat", "racing", "water", "driving"],
    rating: 7.5, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'BD',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/boat-drive/cover/boat-drive.png?w=500&ar=16:10', providerGameId: 'boat-drive', officialUrl: 'https://www.gamepix.com/play/boat-drive'
  }),
  createGamePixGame({
    slug: 'moto-x3m-spooky-land', title: 'Moto X3M: Spooky Land', width: 960, height: 600,
    description: 'Blast through spooky stunt tracks on a motorcycle while flipping over obstacles and traps.',
    longDescription: 'A high-speed motorcycle stunt game with explosive courses and precise timing.',
    instructions: 'Use the arrow keys or touch controls to accelerate, brake and balance the bike.',
    genre: ["Racing", "Motorcycle", "Stunts"], genreFilter: 'Racing', tags: ["moto", "bike", "stunts", "halloween"],
    rating: 8.8, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'MXS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/moto-x3m-spooky-land/cover/moto-x3m-spooky-land.png?w=500&ar=16:10', providerGameId: 'moto-x3m-spooky-land', officialUrl: 'https://www.gamepix.com/play/moto-x3m-spooky-land'
  }),
  createGamePixGame({
    slug: 'moon-city-stunt', title: 'Moon City Stunt', width: 960, height: 600,
    description: 'Perform wild car stunts across a futuristic moon-city environment and master huge ramps.',
    longDescription: 'A 3D stunt-driving playground with ramps, jumps and challenging routes.',
    instructions: 'Use WASD or arrow keys to drive and follow the in-game camera controls.',
    genre: ["Racing", "Driving", "Stunts"], genreFilter: 'Racing', tags: ["cars", "stunts", "racing", "3d"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'MCS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/moon-city-stunt/cover/moon-city-stunt.png?w=500&ar=16:10', providerGameId: 'moon-city-stunt', officialUrl: 'https://www.gamepix.com/play/moon-city-stunt'
  }),
  createGamePixGame({
    slug: 'traffic-car-racing-game', title: 'Traffic Car Racing Game', width: 960, height: 600,
    description: 'Weave through traffic, maintain speed and survive increasingly demanding road conditions.',
    longDescription: 'A reflex-heavy traffic racer where smart lane changes and speed control are key.',
    instructions: 'Use arrow keys or the touch controls to steer and accelerate.',
    genre: ["Racing", "Driving", "Traffic"], genreFilter: 'Racing', tags: ["traffic", "cars", "racing", "speed"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'TCR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/traffic-car-racing-game/cover/traffic-car-racing-game.png?w=500&ar=16:10', providerGameId: 'traffic-car-racing-game', officialUrl: 'https://www.gamepix.com/play/traffic-car-racing-game'
  }),
  createGamePixGame({
    slug: 'vex-x3m', title: 'Vex X3M', width: 960, height: 600,
    description: 'Ride through dangerous obstacle courses, clear traps and reach the finish with perfect timing.',
    longDescription: 'A fast motorcycle platform racer combining stunts, hazards and precise movement.',
    instructions: 'Use arrow keys or touch controls to accelerate, brake and balance.',
    genre: ["Racing", "Motorcycle", "Platform"], genreFilter: 'Racing', tags: ["bike", "stunts", "platform", "racing"],
    rating: 8.2, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'VX',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/vex-x3m/cover/vex-x3m.png?w=500&ar=16:10', providerGameId: 'vex-x3m', officialUrl: 'https://www.gamepix.com/play/vex-x3m'
  }),
  createGamePixGame({
    slug: 'agent-action', title: 'Agent Action', width: 800, height: 600,
    description: 'Run, jump and blast monsters while surviving an endless action challenge.',
    longDescription: 'A fast endless runner where quick reactions, shooting and obstacle avoidance keep the agent alive.',
    instructions: 'Desktop: Z to jump and X to shoot. Mobile: use the on-screen buttons.',
    genre: ["Arcade", "Action", "Runner"], genreFilter: 'Arcade', tags: ["agent", "runner", "shooter", "arcade"],
    rating: 6.0, platform: 'Multi', releaseYear: 2025, category: 'Arcade', initials: 'AA',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/agent-action/cover/agent-action.png?w=500&ar=16:10', providerGameId: 'agent-action', officialUrl: 'https://www.gamepix.com/play/agent-action'
  }),
  createGamePixGame({
    slug: 'ghost-sniper', title: 'Ghost Sniper', width: 800, height: 600,
    description: 'Complete precision sniper missions and eliminate targets while staying hidden.',
    longDescription: 'A mission-based sniper game focused on patience, accuracy and careful observation.',
    instructions: 'Use the mouse or touch controls to aim and fire.',
    genre: ["Action", "Shooter", "Sniper"], genreFilter: 'Action', tags: ["sniper", "action", "shooter", "skill"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'GS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/ghost-sniper/cover/ghost-sniper.png?w=500&ar=16:10', providerGameId: 'ghost-sniper', officialUrl: 'https://www.gamepix.com/play/ghost-sniper'
  }),
  createGamePixGame({
    slug: '1942-pacific-front', title: '1942 Pacific Front', width: 800, height: 600,
    description: 'Command military units in strategic World War II battles across the Pacific front.',
    longDescription: 'A tactical strategy game combining unit placement, movement and battlefield decisions.',
    instructions: 'Use mouse or touch controls to select units and issue commands.',
    genre: ["Action", "Strategy", "War"], genreFilter: 'Action', tags: ["war", "strategy", "ww2", "battle"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: '1942',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/1942-pacific-front/cover/1942-pacific-front.png?w=500&ar=16:10', providerGameId: '1942-pacific-front', officialUrl: 'https://www.gamepix.com/play/1942-pacific-front'
  }),
  createGamePixGame({
    slug: 'mountain-tank', title: 'Mountain Tank', width: 800, height: 600,
    description: 'Drive a tank across rugged terrain, aim carefully and overcome battlefield obstacles.',
    longDescription: 'A compact tank action game mixing vehicle control, aiming and terrain management.',
    instructions: 'Use the keyboard and mouse or touch controls shown in-game to drive and fire.',
    genre: ["Action", "Tank", "Driving"], genreFilter: 'Action', tags: ["tank", "battle", "mountain", "action"],
    rating: 7.4, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'MT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/mountain-tank/cover/mountain-tank.png?w=500&ar=16:10', providerGameId: 'mountain-tank', officialUrl: 'https://www.gamepix.com/play/mountain-tank'
  }),
  createGamePixGame({
    slug: 'grand-zombie-swarm-2', title: 'Grand Zombie Swarm 2', width: 800, height: 600,
    description: 'Survive huge zombie waves, move constantly and use your weapons to clear dangerous areas.',
    longDescription: 'An arcade zombie shooter built around movement, aiming and surviving increasingly intense waves.',
    instructions: 'Use WASD to move and mouse controls to aim and fire; follow the on-screen controls.',
    genre: ["Action", "Shooter", "Zombie"], genreFilter: 'Action', tags: ["zombie", "shooter", "survival", "action"],
    rating: 8.2, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'GZS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/grand-zombie-swarm-2/cover/grand-zombie-swarm-2.png?w=500&ar=16:10', providerGameId: 'grand-zombie-swarm-2', officialUrl: 'https://www.gamepix.com/play/grand-zombie-swarm-2'
  }),
  createGamePixGame({
    slug: 'endless-siege', title: 'Endless Siege', width: 800, height: 600,
    description: 'Build defenses, stop enemy waves and improve your strategy as the siege becomes harder.',
    longDescription: 'A replayable tower-defense challenge where placement, upgrades and resource management determine survival.',
    instructions: 'Use mouse or touch controls to place and upgrade defensive towers.',
    genre: ["Strategy", "Tower Defense", "Action"], genreFilter: 'Strategy', tags: ["tower-defense", "strategy", "defense", "waves"],
    rating: 8.4, platform: 'Multi', releaseYear: 2025, category: 'Strategy', initials: 'ES',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/endless-siege/cover/endless-siege.png?w=500&ar=16:10', providerGameId: 'endless-siege', officialUrl: 'https://www.gamepix.com/play/endless-siege'
  }),
  createGamePixGame({
    slug: 'creative-puzzle', title: 'Creative Puzzle', width: 600, height: 800,
    description: 'Color creative scenes and solve picture puzzles across a collection of playful challenges.',
    longDescription: 'A family-friendly combination of coloring and puzzle solving with many illustrated scenes.',
    instructions: 'Select an image, color it with mouse or touch, then complete the puzzle pieces.',
    genre: ["Puzzle", "Kids", "Coloring"], genreFilter: 'Puzzle', tags: ["puzzle", "kids", "coloring", "creative"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'CP',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/creative-puzzle/cover/creative-puzzle.png?w=500&ar=16:10', providerGameId: 'creative-puzzle', officialUrl: 'https://www.gamepix.com/play/creative-puzzle'
  }),
  createGamePixGame({
    slug: 'image-puzzle', title: 'Image Puzzle', width: 600, height: 800,
    description: 'Swap puzzle pieces to reconstruct beautiful images while racing the clock.',
    longDescription: 'A visual jigsaw challenge with multiple grid sizes and progressively harder pictures.',
    instructions: 'Drag or swap pieces with mouse or touch controls; start with corners and edges.',
    genre: ["Puzzle", "Brain", "Jigsaw"], genreFilter: 'Puzzle', tags: ["jigsaw", "puzzle", "brain", "images"],
    rating: 6.0, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'IP',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/image-puzzle/cover/image-puzzle.png?w=500&ar=16:10', providerGameId: 'image-puzzle', officialUrl: 'https://www.gamepix.com/play/image-puzzle'
  }),
  createGamePixGame({
    slug: 'super-onion-boy', title: 'Super Onion Boy', width: 800, height: 600,
    description: 'Play Super Onion Boy, a fast arcade game with responsive controls and replayable challenges.',
    longDescription: 'Super Onion Boy brings a polished arcade experience with platformer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Arcade", "Platformer"], genreFilter: 'Arcade', tags: ["arcade", "platformer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Arcade', initials: 'SOB',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/super-onion-boy/cover/super-onion-boy.png?w=500&ar=16:10', providerGameId: 'super-onion-boy', officialUrl: 'https://www.gamepix.com/play/super-onion-boy'
  }),
  createGamePixGame({
    slug: 'fireboy-and-watergirl-forest-temple', title: 'Fireboy and Watergirl Forest Temple', width: 960, height: 600,
    description: 'Play Fireboy and Watergirl Forest Temple, a fast adventure game with responsive controls and replayable challenges.',
    longDescription: 'Fireboy and Watergirl Forest Temple brings a polished adventure experience with co-op gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Adventure", "Co-op"], genreFilter: 'Adventure', tags: ["adventure", "co-op", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Adventure', initials: 'FAW',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/fireboy-and-watergirl-forest-temple/cover/fireboy-and-watergirl-forest-temple.png?w=500&ar=16:10', providerGameId: 'fireboy-and-watergirl-forest-temple', officialUrl: 'https://www.gamepix.com/play/fireboy-and-watergirl-forest-temple'
  }),
  createGamePixGame({
    slug: 'stickman-hook', title: 'Stickman Hook', width: 800, height: 600,
    description: 'Play Stickman Hook, a fast arcade game with responsive controls and replayable challenges.',
    longDescription: 'Stickman Hook brings a polished arcade experience with skill gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Arcade", "Skill"], genreFilter: 'Arcade', tags: ["arcade", "skill", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Arcade', initials: 'SH',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/stickman-hook/cover/stickman-hook.png?w=500&ar=16:10', providerGameId: 'stickman-hook', officialUrl: 'https://www.gamepix.com/play/stickman-hook'
  }),
  createGamePixGame({
    slug: 'getaway-shootout', title: 'Getaway Shootout', width: 800, height: 600,
    description: 'Play Getaway Shootout, a fast action game with responsive controls and replayable challenges.',
    longDescription: 'Getaway Shootout brings a polished action experience with multiplayer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Action", "Multiplayer"], genreFilter: 'Action', tags: ["action", "multiplayer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'GS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/getaway-shootout/cover/getaway-shootout.png?w=500&ar=16:10', providerGameId: 'getaway-shootout', officialUrl: 'https://www.gamepix.com/play/getaway-shootout'
  }),
  createGamePixGame({
    slug: 'zombs-royale-io', title: 'Zombs Royale', width: 800, height: 600,
    description: 'Play Zombs Royale, a fast action game with responsive controls and replayable challenges.',
    longDescription: 'Zombs Royale brings a polished action experience with battle royale gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Action", "Battle Royale"], genreFilter: 'Action', tags: ["action", "battle royale", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'ZR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/zombs-royale-io/cover/zombs-royale-io.png?w=500&ar=16:10', providerGameId: 'zombs-royale-io', officialUrl: 'https://www.gamepix.com/play/zombs-royale-io'
  }),
  createGamePixGame({
    slug: 'gold-strike-icy-cave', title: 'Gold Strike Icy Cave', width: 800, height: 600,
    description: 'Play Gold Strike Icy Cave, a fast puzzle game with responsive controls and replayable challenges.',
    longDescription: 'Gold Strike Icy Cave brings a polished puzzle experience with match gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Puzzle", "Match"], genreFilter: 'Puzzle', tags: ["puzzle", "match", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'GSI',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/gold-strike-icy-cave/cover/gold-strike-icy-cave.png?w=500&ar=16:10', providerGameId: 'gold-strike-icy-cave', officialUrl: 'https://www.gamepix.com/play/gold-strike-icy-cave'
  }),
  createGamePixGame({
    slug: 'cut-the-rope', title: 'Cut the Rope', width: 800, height: 600,
    description: 'Play Cut the Rope, a fast puzzle game with responsive controls and replayable challenges.',
    longDescription: 'Cut the Rope brings a polished puzzle experience with physics gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Puzzle", "Physics"], genreFilter: 'Puzzle', tags: ["puzzle", "physics", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'CTR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/cut-the-rope/cover/cut-the-rope.png?w=500&ar=16:10', providerGameId: 'cut-the-rope', officialUrl: 'https://www.gamepix.com/play/cut-the-rope'
  }),
  createGamePixGame({
    slug: 'snail-bob-8', title: 'Snail Bob 8', width: 960, height: 600,
    description: 'Play Snail Bob 8, a fast adventure game with responsive controls and replayable challenges.',
    longDescription: 'Snail Bob 8 brings a polished adventure experience with platformer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Adventure", "Platformer"], genreFilter: 'Adventure', tags: ["adventure", "platformer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Adventure', initials: 'SB8',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/snail-bob-8/cover/snail-bob-8.png?w=500&ar=16:10', providerGameId: 'snail-bob-8', officialUrl: 'https://www.gamepix.com/play/snail-bob-8'
  }),
  createGamePixGame({
    slug: 'color-road', title: 'Color Road', width: 800, height: 600,
    description: 'Play Color Road, a fast arcade game with responsive controls and replayable challenges.',
    longDescription: 'Color Road brings a polished arcade experience with runner gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Arcade", "Runner"], genreFilter: 'Arcade', tags: ["arcade", "runner", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Arcade', initials: 'CR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/color-road/cover/color-road.png?w=500&ar=16:10', providerGameId: 'color-road', officialUrl: 'https://www.gamepix.com/play/color-road'
  }),
  createGamePixGame({
    slug: 'highway-rider-motorbike-racing', title: 'Highway Rider', width: 800, height: 600,
    description: 'Play Highway Rider, a fast racing game with responsive controls and replayable challenges.',
    longDescription: 'Highway Rider brings a polished racing experience with motorcycle gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Racing", "Motorcycle"], genreFilter: 'Racing', tags: ["racing", "motorcycle", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'HR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/highway-rider-motorbike-racing/cover/highway-rider-motorbike-racing.png?w=500&ar=16:10', providerGameId: 'highway-rider-motorbike-racing', officialUrl: 'https://www.gamepix.com/play/highway-rider-motorbike-racing'
  }),
  createGamePixGame({
    slug: 'drift-dudes', title: 'Drift Dudes', width: 800, height: 600,
    description: 'Play Drift Dudes, a fast racing game with responsive controls and replayable challenges.',
    longDescription: 'Drift Dudes brings a polished racing experience with drifting gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Racing", "Drifting"], genreFilter: 'Racing', tags: ["racing", "drifting", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'DD',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/drift-dudes/cover/drift-dudes.png?w=500&ar=16:10', providerGameId: 'drift-dudes', officialUrl: 'https://www.gamepix.com/play/drift-dudes'
  }),
  createGamePixGame({
    slug: 'super-bike-the-champion', title: 'Super Bike the Champion', width: 800, height: 600,
    description: 'Play Super Bike the Champion, a fast racing game with responsive controls and replayable challenges.',
    longDescription: 'Super Bike the Champion brings a polished racing experience with motorcycle gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Racing", "Motorcycle"], genreFilter: 'Racing', tags: ["racing", "motorcycle", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'SBT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/super-bike-the-champion/cover/super-bike-the-champion.png?w=500&ar=16:10', providerGameId: 'super-bike-the-champion', officialUrl: 'https://www.gamepix.com/play/super-bike-the-champion'
  }),
  createGamePixGame({
    slug: 'super-liquid-soccer', title: 'Super Liquid Soccer', width: 800, height: 600,
    description: 'Play Super Liquid Soccer, a fast sports game with responsive controls and replayable challenges.',
    longDescription: 'Super Liquid Soccer brings a polished sports experience with soccer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Sports", "Soccer"], genreFilter: 'Sports', tags: ["sports", "soccer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'SLS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/super-liquid-soccer/cover/super-liquid-soccer.png?w=500&ar=16:10', providerGameId: 'super-liquid-soccer', officialUrl: 'https://www.gamepix.com/play/super-liquid-soccer'
  }),
  createGamePixGame({
    slug: 'football-superstars-2024', title: 'Football Superstars', width: 800, height: 600,
    description: 'Play Football Superstars, a fast sports game with responsive controls and replayable challenges.',
    longDescription: 'Football Superstars brings a polished sports experience with soccer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Sports", "Soccer"], genreFilter: 'Sports', tags: ["sports", "soccer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'FS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/football-superstars-2024/cover/football-superstars-2024.png?w=500&ar=16:10', providerGameId: 'football-superstars-2024', officialUrl: 'https://www.gamepix.com/play/football-superstars-2024'
  }),
  createGamePixGame({
    slug: 'penalty-shooters-2', title: 'Penalty Shooters 2', width: 800, height: 600,
    description: 'Play Penalty Shooters 2, a fast sports game with responsive controls and replayable challenges.',
    longDescription: 'Penalty Shooters 2 brings a polished sports experience with soccer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Sports", "Soccer"], genreFilter: 'Sports', tags: ["sports", "soccer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'PS2',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/penalty-shooters-2/cover/penalty-shooters-2.png?w=500&ar=16:10', providerGameId: 'penalty-shooters-2', officialUrl: 'https://www.gamepix.com/play/penalty-shooters-2'
  }),
  createGamePixGame({
    slug: 'soccer-free-kick', title: 'Soccer Free Kick', width: 800, height: 600,
    description: 'Play Soccer Free Kick, a fast sports game with responsive controls and replayable challenges.',
    longDescription: 'Soccer Free Kick brings a polished sports experience with soccer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Sports", "Soccer"], genreFilter: 'Sports', tags: ["sports", "soccer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Sports', initials: 'SFK',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/soccer-free-kick/cover/soccer-free-kick.png?w=500&ar=16:10', providerGameId: 'soccer-free-kick', officialUrl: 'https://www.gamepix.com/play/soccer-free-kick'
  }),
  createGamePixGame({
    slug: 'fireboy-and-watergirl-ice-temple', title: 'Fireboy and Watergirl Ice Temple', width: 960, height: 600,
    description: 'Play Fireboy and Watergirl Ice Temple, a fast adventure game with responsive controls and replayable challenges.',
    longDescription: 'Fireboy and Watergirl Ice Temple brings a polished adventure experience with co-op gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Adventure", "Co-op"], genreFilter: 'Adventure', tags: ["adventure", "co-op", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Adventure', initials: 'FAW',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/fireboy-and-watergirl-ice-temple/cover/fireboy-and-watergirl-ice-temple.png?w=500&ar=16:10', providerGameId: 'fireboy-and-watergirl-ice-temple', officialUrl: 'https://www.gamepix.com/play/fireboy-and-watergirl-ice-temple'
  }),
  createGamePixGame({
    slug: 'money-movers-3', title: 'Money Movers 3', width: 960, height: 600,
    description: 'Play Money Movers 3, a fast adventure game with responsive controls and replayable challenges.',
    longDescription: 'Money Movers 3 brings a polished adventure experience with platformer gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Adventure", "Platformer"], genreFilter: 'Adventure', tags: ["adventure", "platformer", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Adventure', initials: 'MM3',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/money-movers-3/cover/money-movers-3.png?w=500&ar=16:10', providerGameId: 'money-movers-3', officialUrl: 'https://www.gamepix.com/play/money-movers-3'
  }),
  createGamePixGame({
    slug: 'stealth-master', title: 'Stealth Master', width: 800, height: 600,
    description: 'Play Stealth Master, a fast action game with responsive controls and replayable challenges.',
    longDescription: 'Stealth Master brings a polished action experience with stealth gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Action", "Stealth"], genreFilter: 'Action', tags: ["action", "stealth", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'SM',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/stealth-master/cover/stealth-master.png?w=500&ar=16:10', providerGameId: 'stealth-master', officialUrl: 'https://www.gamepix.com/play/stealth-master'
  }),
  createGamePixGame({
    slug: 'stickman-army-team-battle', title: 'Stickman Army Team Battle', width: 800, height: 600,
    description: 'Play Stickman Army Team Battle, a fast strategy game with responsive controls and replayable challenges.',
    longDescription: 'Stickman Army Team Battle brings a polished strategy experience with defense gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Strategy", "Defense"], genreFilter: 'Strategy', tags: ["strategy", "defense", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Strategy', initials: 'SAT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/stickman-army-team-battle/cover/stickman-army-team-battle.png?w=500&ar=16:10', providerGameId: 'stickman-army-team-battle', officialUrl: 'https://www.gamepix.com/play/stickman-army-team-battle'
  }),
  createGamePixGame({
    slug: 'tower-defense-clash', title: 'Tower Defense Clash', width: 800, height: 600,
    description: 'Play Tower Defense Clash, a fast strategy game with responsive controls and replayable challenges.',
    longDescription: 'Tower Defense Clash brings a polished strategy experience with tower defense gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Strategy", "Tower Defense"], genreFilter: 'Strategy', tags: ["strategy", "tower defense", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Strategy', initials: 'TDC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/tower-defense-clash/cover/tower-defense-clash.png?w=500&ar=16:10', providerGameId: 'tower-defense-clash', officialUrl: 'https://www.gamepix.com/play/tower-defense-clash'
  }),
  createGamePixGame({
    slug: 'mahjong-connect', title: 'Mahjong Connect', width: 800, height: 600,
    description: 'Play Mahjong Connect, a fast puzzle game with responsive controls and replayable challenges.',
    longDescription: 'Mahjong Connect brings a polished puzzle experience with mahjong gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Puzzle", "Mahjong"], genreFilter: 'Puzzle', tags: ["puzzle", "mahjong", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'MC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/mahjong-connect/cover/mahjong-connect.png?w=500&ar=16:10', providerGameId: 'mahjong-connect', officialUrl: 'https://www.gamepix.com/play/mahjong-connect'
  }),
  createGamePixGame({
    slug: 'solitaire-garden', title: 'Solitaire Garden', width: 800, height: 600,
    description: 'Play Solitaire Garden, a fast cards game with responsive controls and replayable challenges.',
    longDescription: 'Solitaire Garden brings a polished cards experience with solitaire gameplay, progressive challenges and quick sessions designed for desktop and mobile.',
    instructions: 'Use the mouse, keyboard or touch controls shown in-game. Follow the on-screen prompts to master movement and actions.',
    genre: ["Cards", "Solitaire"], genreFilter: 'Cards', tags: ["cards", "solitaire", "gamepix", "arcade", "html5"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Cards', initials: 'SG',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/solitaire-garden/cover/solitaire-garden.png?w=500&ar=16:10', providerGameId: 'solitaire-garden', officialUrl: 'https://www.gamepix.com/play/solitaire-garden'
  }),
  createGamePixGame({
    slug: 'merge-royal', title: 'Merge Royal', width: 480, height: 320,
    description: 'Merge matching cards in a relaxing Solitaire-meets-2048 challenge and build higher numbers.',
    longDescription: 'Dive into Merge Royal, where Solitaire strategy meets 2048-style merging. Combine matching cards, unlock higher numbers and enjoy a colorful logic challenge.',
    instructions: 'Match and merge cards strategically to create higher values. Use mouse or touch controls.',
    genre: ["Cards", "Puzzle"], genreFilter: 'Cards', tags: ["cards", "puzzle", "gamepix", "html5", "arcadenexa"],
    rating: 8.2, platform: 'Multi', releaseYear: 2025, category: 'Cards', initials: 'MR',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/merge-royal/cover/merge-royal.png?w=500&ar=16:10', providerGameId: 'merge-royal', officialUrl: 'https://play.gamepix.com/merge-royal/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'bus-driver-simulator-3d', title: 'Bus Driver Simulator 3D', width: 480, height: 320,
    description: 'Drive buses through cities, traffic and varied terrain in racing or relaxed free mode.',
    longDescription: 'Experience the thrill of Bus Driver Simulator 3D by navigating cities, conquering diverse terrains and mastering bus driving with dynamic traffic and weather.',
    instructions: 'Use the on-screen controls or keyboard controls shown in-game to steer, accelerate and brake.',
    genre: ["Simulation", "Driving"], genreFilter: 'Simulation', tags: ["simulation", "driving", "gamepix", "html5", "arcadenexa"],
    rating: 8.4, platform: 'Multi', releaseYear: 2025, category: 'Simulation', initials: 'BDS',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/bus-driver-simulator-3d/cover/bus-driver-simulator-3d.png?w=500&ar=16:10', providerGameId: 'bus-driver-simulator-3d', officialUrl: 'https://play.gamepix.com/bus-driver-simulator-3d/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'yenemy-io', title: 'Yenemy.io', width: 480, height: 320,
    description: 'Enter a fast multiplayer arena and compete against other players in an intense online battle.',
    longDescription: 'Yenemy.io is a fast-paced multiplayer arena experience focused on quick reactions, movement and competitive survival.',
    instructions: 'Use the controls shown in-game to move, attack and survive against opponents.',
    genre: ["Action", "Multiplayer"], genreFilter: 'Action', tags: ["action", "multiplayer", "gamepix", "html5", "arcadenexa"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'YI',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/yenemy-io/cover/yenemy-io.png?w=500&ar=16:10', providerGameId: 'yenemy-io', officialUrl: 'https://play.gamepix.com/yenemy-io/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'kobadoo-arithmetic', title: 'Kobadoo Arithmetic', width: 480, height: 320,
    description: 'Train your arithmetic skills by solving quick number challenges and building your score.',
    longDescription: 'Kobadoo Arithmetic is a brain-training puzzle game focused on mental calculation, speed and accuracy.',
    instructions: 'Use mouse or touch controls to select the correct answers and complete each arithmetic challenge.',
    genre: ["Puzzle", "Math"], genreFilter: 'Puzzle', tags: ["puzzle", "math", "gamepix", "html5", "arcadenexa"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Puzzle', initials: 'KA',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/kobadoo-arithmetic/cover/kobadoo-arithmetic.png?w=500&ar=16:10', providerGameId: 'kobadoo-arithmetic', officialUrl: 'https://play.gamepix.com/kobadoo-arithmetic/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'car-crash-test', title: 'Car Crash Test', width: 480, height: 320,
    description: 'Test powerful cars in spectacular crash scenarios, jumps and destructive driving challenges.',
    longDescription: 'Car Crash Test combines driving and stunt gameplay with crash simulations, ramps and vehicle experiments.',
    instructions: 'Use keyboard or touch controls to drive, accelerate, brake and perform stunts.',
    genre: ["Racing", "Stunts"], genreFilter: 'Racing', tags: ["racing", "stunts", "gamepix", "html5", "arcadenexa"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'CCT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/car-crash-test/cover/car-crash-test.png?w=500&ar=16:10', providerGameId: 'car-crash-test', officialUrl: 'https://play.gamepix.com/car-crash-test/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'endless-car-chase', title: 'Endless Car Chase', width: 480, height: 320,
    description: 'Escape relentless traffic and pursue a high score in an endless high-speed car chase.',
    longDescription: 'Endless Car Chase is a fast arcade driving game where sharp steering and quick reactions help you survive longer.',
    instructions: 'Use the keyboard or touch controls to steer, accelerate and avoid obstacles.',
    genre: ["Racing", "Driving"], genreFilter: 'Racing', tags: ["racing", "driving", "gamepix", "html5", "arcadenexa"],
    rating: 8.1, platform: 'Multi', releaseYear: 2025, category: 'Racing', initials: 'ECC',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/endless-car-chase/cover/endless-car-chase.png?w=500&ar=16:10', providerGameId: 'endless-car-chase', officialUrl: 'https://play.gamepix.com/endless-car-chase/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'dodge-the-bull', title: 'Dodge The Bull', width: 480, height: 320,
    description: 'Dodge the charging bull, react quickly and survive as long as possible.',
    longDescription: 'Dodge The Bull is a fast reflex challenge where timing, movement and quick decisions are essential to avoid the charging bull.',
    instructions: 'Use mouse, touch or the controls shown in-game to move and dodge the bull.',
    genre: ["Action", "Skill"], genreFilter: 'Action', tags: ["action", "skill", "gamepix", "html5", "arcadenexa"],
    rating: 8.0, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'DTB',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/dodge-the-bull/cover/dodge-the-bull.png?w=500&ar=16:10', providerGameId: 'dodge-the-bull', officialUrl: 'https://play.gamepix.com/dodge-the-bull/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'war-of-tanks-3d', title: 'War of Tanks 3D', width: 480, height: 320,
    description: 'Enter 3D tank battles, aim carefully and destroy enemy vehicles across the battlefield.',
    longDescription: 'War of Tanks 3D combines vehicle combat, aiming and tactical movement in an intense tank battle environment.',
    instructions: 'Use the keyboard and mouse or the on-screen controls to drive, aim and fire.',
    genre: ["Action", "Tank"], genreFilter: 'Action', tags: ["action", "tank", "gamepix", "html5", "arcadenexa"],
    rating: 8.2, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'WOT',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/war-of-tanks-3d/cover/war-of-tanks-3d.png?w=500&ar=16:10', providerGameId: 'war-of-tanks-3d', officialUrl: 'https://play.gamepix.com/war-of-tanks-3d/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'boost-balloon', title: 'Boost Balloon', width: 480, height: 320,
    description: 'Control a rising balloon, avoid hazards and use precise boosts to reach the highest possible score.',
    longDescription: 'Boost Balloon is a quick arcade skill game focused on timing, obstacle avoidance and controlled movement.',
    instructions: 'Use mouse, touch or the displayed controls to boost and guide the balloon around obstacles.',
    genre: ["Arcade", "Skill"], genreFilter: 'Arcade', tags: ["arcade", "skill", "gamepix", "html5", "arcadenexa"],
    rating: 7.8, platform: 'Multi', releaseYear: 2025, category: 'Arcade', initials: 'BB',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/boost-balloon/cover/boost-balloon.png?w=500&ar=16:10', providerGameId: 'boost-balloon', officialUrl: 'https://play.gamepix.com/boost-balloon/embed?sid=DXXR1'
  }),
  createGamePixGame({
    slug: 'combat-landing', title: 'Combat Landing', width: 480, height: 320,
    description: 'Control a combat aircraft during a dangerous landing challenge and navigate safely to the runway.',
    longDescription: 'Combat Landing is an action flight challenge that tests precision, control and reaction speed during demanding landings.',
    instructions: 'Use the keyboard or touch controls shown in-game to control the aircraft and complete the landing.',
    genre: ["Action", "Military"], genreFilter: 'Action', tags: ["action", "military", "gamepix", "html5", "arcadenexa"],
    rating: 7.9, platform: 'Multi', releaseYear: 2025, category: 'Action', initials: 'CL',
    gradient: 'bg-gradient-to-br from-cyan-500/30 to-violet-500/30',
    thumbnail: 'https://img.gamepix.com/games/combat-landing/cover/combat-landing.png?w=500&ar=16:10', providerGameId: 'combat-landing', officialUrl: 'https://play.gamepix.com/combat-landing/embed?sid=DXXR1'
  }),
]

export function getGameBySlug(slug: string): Game | undefined { return games.find(g => g.slug === slug) }

export function getRelatedGames(currentSlug: string, genreFilter: string, limit = 4): Game[] {
  const current = getGameBySlug(currentSlug)
  if (!current) return []
  let related = games.filter(g => g.slug !== currentSlug && g.genreFilter === genreFilter)
  if (related.length < limit && current.category) {
    related = [...related, ...games.filter(g => g.slug !== currentSlug && !related.some(r => r.slug === g.slug) && g.category === current.category)]
  }
  if (related.length < limit) {
    related = [...related, ...games.filter(g => g.slug !== currentSlug && !related.some(r => r.slug === g.slug) && g.tags.some(tag => current.tags.includes(tag)))]
  }
  return related.slice(0, limit)
}

export function getGamesByGenre(genre: string): Game[] {
  return genre === 'All' ? games : games.filter(g => g.genreFilter === genre)
}

export function getAllGenreFilters(): string[] {
  const filters = Array.from(new Set(games.map(g => g.genreFilter))).sort()
  return ['All', ...filters]
}

export function isGamePixGame(game: Game): boolean { return game.provider === 'gamepix' }
