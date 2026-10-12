'use strict';
let language = 'tr';
const translations = [
  ['.skip', 'Skip to content'],
  ['nav a[href="#proje"]', 'Project'],
  ['nav a[href="#deney"]', 'Interactive experiment'],
  ['h1', 'One prediction.<br>Two outcomes.<br><em>Thousands of possibilities.</em>'],
  ['.intro', 'What happens when we represent a correct model prediction as <strong>1</strong> and an incorrect one as <strong>0</strong>? Explore Bernoulli and Binomial distributions, from a single outcome to the bigger picture.'],
  ['.actions .button', 'Explore probability <span>↓</span>'],
  ['.text-link', 'Explore the notebook ↗'],
  ['.baseline div:nth-child(1) span', 'BASELINE EXPERIMENT'],
  ['.baseline div:nth-child(1) strong', '10 predictions · p = 0.80'],
  ['.baseline div:nth-child(2) span', 'Expected correct predictions'],
  ['.baseline div:nth-child(3) span', 'Variance'],
  ['.baseline div:nth-child(4) strong', '30.20%'],
  ['.baseline div:nth-child(4) span', 'Probability of exactly 8 correct'],
  ['.experiment .eyebrow', '01 / PROBABILITY PLAYGROUND'],
  ['.experiment h2', 'Change the parameters.<br>Watch the distribution shift.'],
  ['.section-heading > p', 'Each bar shows the probability of exactly that many correct predictions. This interactive demo brings the notebook’s Binomial model to your browser.'],
  ['.controls .small-label', 'MODEL CONFIGURATION'],
  ['.plot-heading > span:first-child', 'BINOMIAL DISTRIBUTION'],
  ['.axis-caption', 'NUMBER OF CORRECT PREDICTIONS (k)'],
  ['.plot-stats div:nth-child(1) span', 'EXPECTED VALUE'],
  ['.plot-stats div:nth-child(2) span', 'STANDARD DEVIATION'],
  ['.plot-stats div:nth-child(3) span', 'MOST LIKELY OUTCOME'],
  ['summary', 'Show probability values as a table'],
  ['caption', 'Probability of each number of correct predictions'],
  ['thead th:first-child', 'Correct predictions (k)'],
  ['thead th:nth-child(2)', 'Probability'],
  ['.journey .eyebrow', '02 / BEHIND THE EXPERIMENT'],
  ['.journey h2', 'From a single prediction<br>to long-run behavior.'],
  ['.steps article:nth-child(1) h3', 'Binary outcomes'],
  ['.steps article:nth-child(1) p', 'Independent correct and incorrect predictions are modeled as 0 and 1 using Bernoulli trials.'],
  ['.steps article:nth-child(2) h3', 'Probability distribution'],
  ['.steps article:nth-child(2) p', 'How many correct outcomes should we expect in 10 predictions? Calculate the probability of exactly 8 successes and compare the full distribution.'],
  ['.steps article:nth-child(3) h3', 'Simulation & convergence'],
  ['.steps article:nth-child(3) p', 'Compare theory and simulation across 1,000 repetitions. Follow convergence with a running average over 10,000 experiments.'],
  ['.insight .eyebrow', '03 / KEY INSIGHT'],
  ['.insight h2', 'An expected value<br>is not a promised outcome.'],
  ['.insight > div > p:last-child', 'Expecting 8 correct predictions on average does not mean every set of 10 will contain exactly 8 successes. Larger samples make accuracy estimates more stable; repeated experiments reveal convergence toward the theoretical mean.'],
  ['.insight .small-label', 'MODEL ASSUMPTIONS'],
  ['.insight li:nth-child(1)', 'A fixed number of trials'],
  ['.insight li:nth-child(2)', 'Two possible outcomes per trial'],
  ['.insight li:nth-child(3)', 'Independent trials'],
  ['.insight li:nth-child(4)', 'A constant success probability'],
  ['.insight aside p', 'Real machine learning predictions may not always satisfy these conditions.'],
  ['.closing .eyebrow', 'KEEP EXPLORING'],
  ['.closing h2', 'Read the theory.<br>Run the code. <em>Question the outcome.</em>'],
  ['.closing .button', 'Explore the project on GitHub ↗'],
  ['footer a', 'Back to top ↑']
].map(([selector, en]) => {
  const element = document.querySelector(selector);
  return {element, en, tr: element.innerHTML};
});
const attributes = [
  ['nav', 'aria-label', 'Main navigation'],
  ['.hero-art', 'aria-label', 'Decorative animation representing binary Bernoulli outcomes'],
  ['#trial-results', 'aria-label', 'Simulated prediction outcomes'],
  ['meta[name="description"]', 'content', 'Explore binary classifier outcomes with Bernoulli and Binomial distributions. Python, Monte Carlo, and interactive probability experiments.']
].map(([selector, attribute, en]) => {
  const element = document.querySelector(selector);
  return {element, attribute, en, tr: element.getAttribute(attribute)};
});
const originalTitle = document.title;
const labels = [
  {element: document.querySelector('label[for="trials"]'), tr: 'Tahmin sayısı ', en: 'Number of predictions '},
  {element: document.querySelector('label[for="probability"]'), tr: 'Doğru tahmin olasılığı ', en: 'Probability of a correct prediction '}
];
function localized(tr, en) { return language === 'en' ? en : tr; }
function percent(value, digits = 1) {
  const number = (value * 100).toFixed(digits);
  return language === 'en' ? number + '%' : '%' + number;
}
const dialog = document.getElementById('language-dialog');
const languageSwitch = document.getElementById('language-switch');
function applyLanguage(selected) {
  language = selected === 'en' ? 'en' : 'tr';
  document.documentElement.lang = language;
  translations.forEach(item => { item.element.innerHTML = item[language]; });
  attributes.forEach(item => item.element.setAttribute(item.attribute, item[language]));
  labels.forEach(item => { item.element.firstChild.textContent = item[language]; });
  document.title = localized(originalTitle, 'Bernoulli × Binomial — From probability to insight');
  languageSwitch.textContent = language === 'en' ? 'EN / TR' : 'TR / EN';
  languageSwitch.setAttribute('aria-label', localized('Dili değiştir', 'Change language'));
  document.dispatchEvent(new Event('languagechange'));
}
function openLanguageDialog() {
  document.getElementById('choose-tr').setAttribute('aria-pressed', String(language === 'tr'));
  document.getElementById('choose-en').setAttribute('aria-pressed', String(language === 'en'));
  dialog.showModal();
}
languageSwitch.addEventListener('click', openLanguageDialog);
document.querySelectorAll('[data-language]').forEach(button => {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.language);
    try { localStorage.setItem('bernoulli-language', language); } catch { /* Private browsing can disable storage. */ }
    dialog.close();
    languageSwitch.focus();
  });
});
let savedLanguage;
try { savedLanguage = localStorage.getItem('bernoulli-language'); } catch { /* The chooser still works without storage. */ }
applyLanguage(savedLanguage);
if (savedLanguage !== 'tr' && savedLanguage !== 'en') openLanguageDialog();
