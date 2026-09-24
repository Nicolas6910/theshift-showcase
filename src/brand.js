// Extrait de https://www.the-shift.ai/ — voir ../../brand.json. Rien n'est devine ici.
export const B = {
  url: 'the-shift.ai',
  href: 'https://www.the-shift.ai/',
  colors: {
    primary:'#2563eb', primaryDark:'#1e3a8a', primaryLight:'#3b82f6', violet:'#7c3aed',
    bg:'#fafafa', surface:'#f1f5f9', card:'#ffffff', border:'#e2e8f0',
    text:'#0f172a', muted:'#475569', onPrimary:'#ffffff'
  },
  font: "'Inter', system-ui, -apple-system, sans-serif",
  radius: 20,
  eyebrow: 'AI Driven Development',
  headline1: 'Dans cinq ans, votre entreprise sera AI Driven.',
  headline2: 'Ou elle ne sera plus.',
  tagline: "L'usine logicielle qui fait basculer les entreprises en AI Driven Development.",
  stats: [
    {v:88, suf:' %', l:"des entreprises utilisent déjà l'IA"},
    {v:94, suf:' %', l:"n'en tirent aucune valeur"},
    {v:6,  suf:' %', l:"capturent tout — et creusent l'écart"},
    {v:50, suf:' %', l:"des emplois entry-level menacés d'ici 1 à 5 ans"}
  ],
  statsSource: 'Sources : McKinsey, State of AI 2025 · Dario Amodei (CEO Anthropic), Axios, 28 mai 2025',
  mfa: { title:'MFA : 14 marques et 400 documents tiennent dans un seul agent IA',
         figures:[{v:3,suf:'h',l:'de mise en service'},{v:14,suf:'',l:'marques'},{v:400,suf:'+',l:'documents'}] },
  clients: ['MFA','Expert-Flow.ai','Prizoners','Lab-Mind.ai','Beyond Scale Group'],
  services: ['Chatbot','Email','Veille','Contenu','Bot équipe','Multi-agents'],
  products: ['Donna','Jarvis','The Brain'],
  cta: 'Audit stratégique gratuit — 45 min',
  pages: [
    ['services','Services','/services'], ['produits','Produits','/produits'],
    ['pricing','Tarifs','/pricing'], ['formation','Formation','/formation'],
    ['references','Références','/references'], ['casusage',"Cas d'usage",'/cas-usage'],
    ['conseil','Conseil','/conseil'], ['contact','Contact','/contact']
  ]
};
export default B;
