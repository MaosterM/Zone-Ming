/**
 * Every piece of personal content on the site lives in this file.
 *
 * Nothing here has been invented: each value comes from you, your LinkedIn headline or your
 * public GitHub repos.
 */

export type ProjectLink = {
  label: string
  url: string
}

export type Project = {
  /** Used in the URL: /work/<slug>. Lowercase letters, digits and hyphens. */
  slug: string
  title: string
  year: string
  /** One line, shown on the Work list. */
  description: string
  role: string
  stack: string[]
  /** What you built. Each string renders as its own paragraph. */
  built: string[]
  links: ProjectLink[]
  /** Image in public/projects/, for example 'projects/my-app.jpg'. */
  image: string
  imageAlt: string
  /** Languages used, shown in the matrix on Work. */
  languages: Language[]
  /** Headline figures. Use only numbers the project's own README or code supports. */
  stats: Stat[]
  /** The stages of how it works, in order. */
  steps: Note[]
  /** Key decisions and details, in any order. */
  notes: Note[]
  /** What is simulated, unfinished or untested, stated plainly. */
  limits: string[]
  gallery: GalleryImage[]
}

export type Language = 'Python' | 'TypeScript' | 'JavaScript' | 'Solidity' | 'PHP'

export type Stat = {
  label: string
  value: string
}

export type Note = {
  title: string
  text: string
}

export type GalleryImage = {
  image: string
  alt: string
  /** Says where the image comes from, such as a demo frame or a generated chart. */
  caption: string
  portrait?: boolean
}

export type SkillGroup = {
  name: 'Build' | 'Motion' | 'Tools'
  items: string[]
}

export const profile = {
  name: 'Cheah Yi Ming',
  linkedin: 'https://www.linkedin.com/in/cheah-yi-ming-549165364/',
  github: 'https://github.com/MaosterM',

  // From your LinkedIn headline.
  role: 'Final-year Computer Science student specialising in Data Science, with a minor in Finance',

  // Each string renders as its own paragraph on About.
  bio: [
    "I'm a final-year Bachelor of Computer Science student at Taylor's University in Greater Kuala Lumpur, specialising in Data Science with a minor in Finance.",
    'I build across data, finance and the web: a multilingual model that detects prompt attacks, an agent that protects token holders on BNB Smart Chain, and a family vault that no single person can open.',
  ],

  // Shows in the terminal panel on About.
  status: "Final-year student, Taylor's University",

  // Powers the large link and the form on Contact.
  email: 'romeocheah22@gmail.com',

  // Optional. Paste a Formspree endpoint here, such as 'https://formspree.io/f/abc123', to have
  // the contact form send messages directly. While it is empty, the form opens the visitor's
  // email app addressed to the email above.
  formspreeEndpoint: '',
}

// Taken from what your public repos actually use. LinkedIn lists no skills yet.
export const skills: SkillGroup[] = [
  {
    name: 'Build',
    items: ['TypeScript and JavaScript', 'React and Next.js', 'Python, PyTorch and Transformers', 'scikit-learn and pandas', 'Solidity', 'PHP and MySQL', 'Tailwind CSS'],
  },
  {
    name: 'Motion',
    items: ['GSAP timelines', 'Framer Motion', 'three.js', 'Canvas animation', 'D3 data visuals', 'Lenis smooth scrolling', 'Page transitions'],
  },
  {
    name: 'Tools',
    items: ['Git and GitHub Actions', 'Foundry', 'Jupyter and Kaggle', 'Docker', 'Vite', 'GitHub Pages'],
  },
]

// Copy this shape to add another project. Its image goes in public/projects/.
export const projects: Project[] = [
  {
    slug: 'ejector-seat',
    title: 'Ejector Seat',
    year: '2026',
    description: 'A non-custodial agent that sells your risky token the moment its team starts to rug.',
    role: 'Co-developer on a team project',
    stack: ['Solidity', 'TypeScript', 'Foundry', 'PancakeSwap V2', 'BNB Smart Chain testnet'],
    built: [
      "Ejector Seat watches a token team's wallets and liquidity pool. When the team starts dumping, by selling into the pool, moving a big share of its holdings, pulling liquidity or minting new supply, plain deterministic code sells the holder's tokens for BNB.",
      'The agent\'s only power over funds is to sell a token and send the proceeds back to the owner. The SafeExit contract is about 30 lines and has no recipient parameter. An LLM writes the risk brief and the explanation afterwards, but it is never in the path from trigger to sale and never touches a key.',
      'In the testnet demo the price crashed 89.8%. The guarded position kept 83.6% of its value and the unguarded one kept 0.1%, with the sale broadcast 185 to 213 ms after the agent saw the triggering block. It runs on testnet only, and every script refuses to run on mainnet.',
    ],
    links: [{ label: 'See the code', url: 'https://github.com/MaosterM/BNB-Shuijiao' }],
    image: 'projects/ejector-seat.jpg',
    imageAlt: 'Cover graphic with the testnet demo results: guarded position kept 83.6%, unguarded kept 0.1%, sale broadcast in 185 to 213 milliseconds.',
    languages: ['Solidity', 'TypeScript'],
    stats: [
      { label: 'Value kept, guarded', value: '83.6%' },
      { label: 'Value kept, unguarded', value: '0.1%' },
      { label: 'Trigger to sale', value: '185-213 ms' },
      { label: 'Contract tests passed', value: '6 of 6' },
      { label: 'Demo runs passed', value: '3 of 3' },
    ],
    steps: [
      { title: 'Watch', text: 'A WebSocket feed of new blocks plus a 1 second poll and a 3-block re-scan, with duplicates removed.' },
      { title: 'Decide', text: 'Four pure, unit-tested triggers check each batch of logs. The first one to fire starts the exit.' },
      { title: 'Eject', text: 'A minimum output is set at 15% under the quote, then one transaction is signed locally and sent once.' },
      { title: 'Return', text: 'The token is sold through PancakeSwap and the BNB goes back to the owner, always.' },
    ],
    notes: [
      { title: 'Four triggers', text: 'A team wallet selling at least 1% of its holdings into the pool, a team wallet moving over 20% elsewhere, liquidity pulled by over 10%, or new tokens minted.' },
      { title: 'One permission', text: 'The guardian can call exactly one function, eject. Only the owner can withdraw or change the guardian. Tests confirm the guardian cannot withdraw, re-point funds or transfer tokens.' },
      { title: 'No LLM in the hot path', text: 'Logs go to a pure function, then a pre-built transaction. Nonce, gas and the protected amount are read once when the guard arms, so nothing slow sits between the trigger and the sale.' },
      { title: 'Session key mode', text: "In Altana mode the agent uses a session key limited on-chain to one SafeExit function, capped at 0.002 tBNB a day for fees and expiring in 24 hours. A test shows it being refused for anything else." },
    ],
    limits: [
      'BNB Smart Chain testnet only. Every script refuses to run on mainnet.',
      'The results come from a scripted demo scenario against a test token, not a real market.',
    ],
    gallery: [
      { image: 'projects/ejector-seat-timeline.jpg', alt: 'Five stages in order: team sells 5%, agent ejects in 185 to 213 milliseconds, an 8 second wait, team dumps the rest, liquidity removed.', caption: "Generated from the README's demo sequence" },
      { image: 'projects/ejector-seat-curve.jpg', alt: 'A curve of token amount against BNB in a pool, with one point before a sale and another after a big sale, far along the curve.', caption: 'Illustration of the pool formula, not measured data' },
    ],
  },
  {
    slug: 'zenithium',
    title: 'Zenithium',
    year: '2026',
    description: "A vault for a family's estate papers that opens only when the heirs agree together.",
    role: "Team ShuijiaoT07, Taylor's University Malaysia",
    stack: ['Next.js', 'TideCloak', 'WebCrypto', 'AES-GCM', 'Shamir secret sharing'],
    built: [
      'Built for RMIT Hackathon 2026, in the challenge to make a working app with no unilateral control over protected data. After someone passes away, papers like a will or land titles often sit with one person or firm, and the family simply has to trust them.',
      'Zenithium encrypts wills, IC numbers, asset lists and documents in the browser before they are saved, so the database only ever holds ciphertext. The vault key is split between the heirs, and in the demo it takes 2 of 2 to open it.',
      'Some parts are simulated, including the quorum approval workflow and death verification, and the team documented exactly which. Without TideCloak set up, the app runs in a clearly labelled offline demo mode.',
    ],
    links: [{ label: 'See the code', url: 'https://github.com/MaosterM/Taylors_MY_Shuijiao_C2' }],
    image: 'projects/zenithium.jpg',
    imageAlt: "Frame from the Zenithium demo video: the Database View page, showing the sealed vault's fields stored as ciphertext.",
    languages: ['JavaScript'],
    stats: [
      { label: 'Approvals to open', value: '2 of 2' },
      { label: 'File encryption', value: 'AES-256' },
      { label: 'Built in', value: '1 afternoon' },
      { label: 'Demo video', value: '2 min' },
    ],
    steps: [
      { title: 'Name the heirs', text: 'The planner chooses who holds the keys and how many approvals are needed to open the vault.' },
      { title: 'Check the keys', text: 'Each heir sets up a family key and the planner compares its code with them, so nobody can swap a key.' },
      { title: 'Seal', text: 'The will summary, IC number, assets and documents are encrypted in the browser before anything is saved.' },
      { title: 'Open together', text: 'One heir alone is blocked. When both approve, the vault opens for the family only.' },
    ],
    notes: [
      { title: 'Admin cannot read', text: "The server and its database file hold only ciphertext and non-sensitive metadata. The app's Database View shows that raw file, so anyone can check." },
      { title: 'A real threshold', text: 'The vault key is split with Shamir secret sharing. With too few shares it cannot be rebuilt mathematically, so the limit is not just a check in the interface.' },
      { title: 'Envelope encryption', text: "Each file gets a random AES-256-GCM key through WebCrypto. That key is sealed once for the planner and once with the vault key for the heirs." },
      { title: 'Why it matters', text: 'The team mapped it to UN goals 16, 1 and 5: fairer estate processes, heirs claiming what is theirs, and an equal say for widows and elderly spouses.' },
    ],
    limits: [
      'The quorum approval workflow is run by the app, and death verification is simulated.',
      "The demo video was recorded in offline demo mode, where login and TideCloak encryption are simulated. On 22 Oct 2026 Tide's network could not activate the team's licence.",
      'Because of that outage, the online TideCloak mode was never tested end to end.',
    ],
    gallery: [
      { image: 'projects/zenithium-intro.jpg', alt: 'Title card reading: their will, MyKad and land titles end up with one person, or one company.', caption: 'Frame from the team demo video' },
      { image: 'projects/zenithium-keys.jpg', alt: 'The Seal the Vault page, where the planner checks a code for each heir and ticks that the codes match.', caption: 'Frame from the demo video, offline mode, with fictional names' },
      { image: 'projects/zenithium-unlock.jpg', alt: 'The Family Vault page marked unlocked and simulated quorum, with a full unlock progress bar.', caption: 'Frame from the demo video, offline mode, with fictional names' },
    ],
  },
  {
    slug: 'prompt-attack-classifier',
    title: 'Prompt attack classifier',
    year: '2026',
    description: 'A multilingual model that spots jailbreaks and prompt injections in four languages.',
    role: "Team ShuijiaoT07, Taylor's University Malaysia",
    stack: ['Python', 'PyTorch', 'Transformers', 'XLM-RoBERTa', 'scikit-learn', 'Kaggle'],
    built: [
      'Built for RMIT Hackathon 2026. The model classifies prompts written in Portuguese, French, Italian and English as benign, a jailbreak or a prompt injection, trained on 14,000 rows.',
      'Scoring used macro-F1, so the rare prompt injection class, only 7% of the data, counts for a third of the score. The notebook handles that with class weights and by tuning the decision boundary on validation data, rather than taking the most likely class.',
      'Long prompts are cut from both the start and the end, because an injected instruction often sits at the end of the text, where normal truncation would drop it.',
    ],
    links: [{ label: 'See the code', url: 'https://github.com/MaosterM/RMIT-Shuijiao' }],
    image: 'projects/prompt-attack-classifier.jpg',
    imageAlt: 'Cover graphic with the training data shares: 62% benign, 31% jailbreak, 7% prompt injection, and prompts in Portuguese, French, Italian and English.',
    languages: ['Python'],
    stats: [
      { label: 'Validation macro-F1', value: '0.9397' },
      { label: 'Rare class F1', value: '0.938' },
      { label: 'Training rows', value: '14,000' },
      { label: 'Languages', value: '4' },
      { label: 'Run time', value: '19 min' },
    ],
    steps: [
      { title: 'Explore', text: 'Check class and language balance. The label mix turned out identical across all four languages.' },
      { title: 'Prepare', text: 'Tokenise with head and tail truncation, then split so every label and language pair stays in proportion.' },
      { title: 'Train', text: 'Fine-tune XLM-RoBERTa with class-weighted loss for 3 epochs, keeping the checkpoint with the best macro-F1.' },
      { title: 'Tune and check', text: 'Shift the decision boundary on validation data, write the predictions, then re-read the file to confirm it is valid.' },
    ],
    notes: [
      { title: 'Why macro-F1 changes everything', text: 'Every class counts equally, so the 7% class is a third of the score. Predicting benign every time scores only about 0.26, despite being right 62% of the time.' },
      { title: 'One model, four languages', text: 'XLM-RoBERTa was pre-trained on 100 languages, so Portuguese, French, Italian and English share one model with no translation step.' },
      { title: 'Results by language', text: 'Tuned validation macro-F1 was 0.968 for Italian, 0.957 for French, 0.947 for English and 0.916 for Portuguese, the weakest of the four.' },
      { title: 'Where the errors are', text: '64 of the 76 validation errors were benign and jailbreak being confused, which makes it the main target for future runs.' },
    ],
    limits: [
      'These scores are from one validation run. No public leaderboard score is recorded in the repo.',
      'The current version uses the smaller xlm-roberta-base model. A larger model and k-fold training are listed as future work.',
      'The gain from bias tuning was small and came from a handful of English rows, so the team treated it as low confidence.',
    ],
    gallery: [
      { image: 'projects/prompt-attack-classifier-weights.jpg', alt: 'Class weights: benign 0.56, jailbreak 0.79, prompt injection 1.66.', caption: "Generated from the notebook's README" },
      { image: 'projects/prompt-attack-classifier-truncation.jpg', alt: 'Two rows of blocks: right truncation keeps only the start of a text, while head and tail keeps both ends.', caption: 'Diagram of the method, not to scale' },
    ],
  },
  {
    slug: 'quant-terminal',
    title: 'Quant Terminal',
    year: '2026',
    description: 'A markets dashboard interface with an order book, treemap and risk display.',
    role: 'Personal project',
    stack: ['Next.js', 'TypeScript', 'D3', 'Framer Motion', 'Tailwind CSS'],
    built: [
      'A multi-page market terminal with Command, Alpha, Sentiment, Risk and Profile views.',
      'The Command view combines an order book, a market treemap and a risk display, with animated panels throughout. Prices currently come from a seeded simulator rather than a live market feed.',
    ],
    links: [{ label: 'See the code', url: 'https://github.com/MaosterM/financial-datascience-dashboard' }],
    image: 'projects/quant-terminal.jpg',
    imageAlt: "Cover graphic with price lines drawn by the project's own seeded simulator, and the names of its five views.",
    languages: ['TypeScript'],
    stats: [
      { label: 'Views', value: '5' },
      { label: 'Monte Carlo paths', value: '300' },
      { label: 'Forecast horizon', value: '40 steps' },
      { label: 'Price data', value: 'Simulated' },
    ],
    steps: [
      { title: 'Command', text: 'An order book, a global market heatmap and a portfolio risk display.' },
      { title: 'Alpha and risk', text: 'A forecast band, correlation matrix and backtest sandbox, then Monte Carlo paths, a volatility surface and a drawdown chart.' },
      { title: 'Sentiment', text: 'An entity sentiment network sized by mentions, and a macro event timeline.' },
      { title: 'Profile', text: 'A simulated account with trades, holdings and transaction history, stored only in the browser.' },
    ],
    notes: [
      { title: 'Repeatable markets', text: 'Prices come from a seeded geometric Brownian motion function, so the server and browser draw the same series without a mismatch.' },
      { title: 'Risk you can adjust', text: 'The Monte Carlo view runs 300 paths over 6 months, using a drift and volatility you can change with sliders, and reports the mean and 5th percentile outcome.' },
      { title: 'Backtest sandbox', text: 'A moving-average crossover strategy with a sentiment filter, run on the simulated prices, sits alongside the forecast and correlation panels.' },
      { title: 'Panels that explain themselves', text: 'Panels open a drawer on hover that explains what the chart shows, so the numbers come with context.' },
    ],
    limits: [
      'All market data is simulated or illustrative, and the panels are labelled that way. There is no live feed.',
      'The LSTM and Prophet forecast options change simulation settings. No trained model runs behind them.',
      "The repo's description mentions Python and machine learning, but the code there today is a TypeScript front end.",
    ],
    gallery: [
      { image: 'projects/quant-terminal-montecarlo.jpg', alt: 'A fan of 300 simulated price paths spreading out from a single start.', caption: "Redrawn from the project's formula, simulated data" },
      { image: 'projects/quant-terminal-drawdown.jpg', alt: 'A chart of a simulated price series falling below its running peak.', caption: "Redrawn from the project's price function, simulated data" },
    ],
  },
  {
    slug: 'maison-aurelle',
    title: 'Maison Aurelle',
    year: '2026',
    description: 'A five-star hotel booking site with a slash-wipe motion system, in progress.',
    role: 'Personal project',
    stack: ['PHP 8', 'MySQL', 'Vanilla JavaScript', 'CSS'],
    built: [
      'A hotel site in charcoal, ivory and champagne gold, with a fullscreen menu, a flex room carousel, slash-wipe page transitions and kinetic type, written in vanilla JavaScript with no framework.',
      'Phase 1 is done: the database schema for rooms, guests and bookings, the PHP core, the design system, the motion engine and the Home page. The booking engine, reservation manager and AI concierge are in progress.',
    ],
    links: [{ label: 'See the code', url: 'https://github.com/MaosterM/Maison-Aurelle' }],
    image: 'projects/maison-aurelle.jpg',
    imageAlt: "Cover graphic using the project's hero image: soft window light in a dark room, with the title in the site's ivory and gold.",
    languages: ['PHP', 'JavaScript'],
    stats: [
      { label: 'Database tables', value: '8' },
      { label: 'Room types', value: '6' },
      { label: 'Frameworks', value: '0' },
      { label: 'Status', value: 'Phase 1' },
    ],
    steps: [
      { title: 'Database', text: 'Schema and seed data for rooms, add-ons, guests, bookings, booking events, inquiries and rate limits.' },
      { title: 'PHP core', text: 'PHP 8 with PDO and prepared statements, for MySQL 8 or MariaDB.' },
      { title: 'Motion engine', text: 'Slash-wipe page transitions, a fullscreen menu and a flex room carousel in vanilla ES modules.' },
      { title: 'Home page', text: 'The first complete page in charcoal, ivory and champagne gold, and the base for the rest.' },
    ],
    notes: [
      { title: 'Transitions without a framework', text: 'The wipe runs on a normal multi-page PHP site. A page arriving through a wipe starts covered, then reveals in the same direction, and it respects reduced motion.' },
      { title: 'Touch-aware carousel', text: 'On touch devices the first tap expands a room card and the second follows its link, so the hover idea still works without a mouse.' },
      { title: 'Safer bookings', text: 'The booking code locks the room type row while it checks availability, the standard way to stop two guests taking the last room.' },
      { title: 'A complete atmosphere', text: 'The site ships its own atmospheric images for each room type and for the spa and gym, all in one muted palette.' },
    ],
    limits: [
      'In progress. The README lists Phase 1 as done, with the booking engine, other pages and AI concierge still to come.',
      "I couldn't run it for this page, so the images are the project's own assets rather than screenshots.",
    ],
    gallery: [
      { image: 'projects/maison-aurelle-presidential-suite.jpg', alt: 'Soft light through two tall windows above a dark, low bed.', caption: 'Project asset: Presidential Suite', portrait: true },
      { image: 'projects/maison-aurelle-garden-villa.jpg', alt: "The project's dark, softly lit artwork for its Garden Villa.", caption: 'Project asset: Garden Villa', portrait: true },
      { image: 'projects/maison-aurelle-spa.jpg', alt: 'A silhouette of stacked stones in slanted light.', caption: 'Project asset: Spa', portrait: true },
      { image: 'projects/maison-aurelle-gym.jpg', alt: "The project's dark, softly lit artwork for its gym.", caption: 'Project asset: Gym', portrait: true },
    ],
  },
]

// Areas of work, shown on Home and About. Each links to the projects that show it.
export const focusAreas: (Note & { projects: string[] })[] = [
  {
    title: 'Data and machine learning',
    text: 'Training and tuning models where the rare case matters most, and reporting results by class and by language.',
    projects: ['prompt-attack-classifier'],
  },
  {
    title: 'Finance and markets',
    text: 'Market mechanics, risk simulation and backtesting, from how a liquidity pool prices a sale to Monte Carlo paths.',
    projects: ['ejector-seat', 'quant-terminal'],
  },
  {
    title: 'Security and trust',
    text: 'Systems designed so that no single party holds all the power: narrow permissions, on-chain limits and split keys.',
    projects: ['zenithium', 'ejector-seat'],
  },
  {
    title: 'Web and motion',
    text: 'Interfaces with a strong point of view, from a framework-free hotel site to this portfolio, with reduced motion handled.',
    projects: ['maison-aurelle'],
  },
]

// When each public repo was created on GitHub. Times are in UTC.
export const buildLog: { stamp: string; text: string; to?: string }[] = [
  { stamp: '2026-08-21', text: 'Quant Terminal: repo created', to: '/work/quant-terminal' },
  { stamp: '2026-10-08', text: 'Maison Aurelle: repo created', to: '/work/maison-aurelle' },
  { stamp: '2026-10-17', text: 'Ejector Seat: repo created', to: '/work/ejector-seat' },
  { stamp: '2026-10-17', text: 'Prompt attack classifier: repo created', to: '/work/prompt-attack-classifier' },
  { stamp: '2026-10-22', text: 'Zenithium: repo created', to: '/work/zenithium' },
  { stamp: '2026-11-05', text: 'This portfolio: repo created', to: '/about' },
]
