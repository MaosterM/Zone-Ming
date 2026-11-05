/**
 * Every piece of personal content on the site lives in this file.
 *
 * Search for "TODO" to find what still needs filling in. Nothing here has been invented: each
 * value comes from your LinkedIn headline, your public GitHub repos, or is a marked TODO.
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
  },
]
