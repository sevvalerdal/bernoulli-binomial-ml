'use strict';
const trials = document.getElementById('trials');
const probability = document.getElementById('probability');
const chart = document.getElementById('chart');
const ns = 'http://www.w3.org/2000/svg';
function svgElement(tag, attributes, text) {
  const element = document.createElementNS(ns, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text !== undefined) element.textContent = text;
  return element;
}
function distribution(n, p) {
  const values = [Math.pow(1 - p, n)];
  for (let k = 1; k <= n; k++) values.push(values[k - 1] * (n - k + 1) / k * p / (1 - p));
  return values;
}
function update() {
  const n = Number(trials.value), p = Number(probability.value) / 100;
  const values = distribution(n, p), max = Math.max(...values);
  const modes = values.flatMap((value, k) => Math.abs(value - max) < 1e-12 ? [k] : []);
  document.getElementById('n-value').textContent = n;
  document.getElementById('p-value').textContent = p.toFixed(2);
  document.getElementById('expected').textContent = (n * p).toFixed(2);
  document.getElementById('deviation').textContent = Math.sqrt(n * p * (1 - p)).toFixed(2);
  document.getElementById('mode').textContent = modes.join(' / ') + localized(' doğru', ' correct');
  document.getElementById('simulate').firstChild.textContent = localized(n + ' tahmin simüle et ', 'Simulate ' + n + ' predictions ');
  chart.replaceChildren(svgElement('title', {id: 'chart-title'}, localized('Binom olasılık dağılımı', 'Binomial probability distribution')), svgElement('desc', {id: 'chart-description'}, localized(`${n} tahmin, başarı olasılığı ${p.toFixed(2)}. Beklenen değer ${(n * p).toFixed(2)}. En olası doğru tahmin sayısı ${modes.join(' veya ')}.`, `${n} predictions with success probability ${p.toFixed(2)}. Expected value ${(n * p).toFixed(2)}. Most likely number of correct predictions: ${modes.join(' or ')}.`)));
  const left = 48, top = 25, width = 635, height = 265, ceiling = Math.ceil(max * 100 / 5) * 5 / 100;
  for (let i = 0; i <= 4; i++) {
    const y = top + height * i / 4;
    chart.append(svgElement('line', {x1:left, x2:left+width, y1:y, y2:y, stroke:'#354033', 'stroke-dasharray':'3 5'}));
    chart.append(svgElement('text', {x:left-10, y:y+4, fill:'#a2ada0', 'font-size':11, 'text-anchor':'end'}, percent(ceiling * (1 - i / 4), 0)));
  }
  const table = document.getElementById('probability-table');
  table.replaceChildren();
  values.forEach((value, k) => {
    const slot = width / (n + 1), barHeight = value / ceiling * height;
    const rect = svgElement('rect', {x:left+k*slot+slot*.15, y:top+height-barHeight, width:slot*.7, height:barHeight, rx:3, class:'chart-bar' + (modes.includes(k) ? ' peak' : '')});
    rect.append(svgElement('title', {}, localized(`${k} doğru: ${percent(value, 4)}`, `${k} correct: ${percent(value, 4)}`)));
    chart.append(rect);
    if (n <= 15 || k % 2 === 0 || k === n) chart.append(svgElement('text', {x:left+(k+.5)*slot, y:top+height+22, fill:'#a2ada0', 'font-size':11, 'text-anchor':'middle'}, k));
    const row = document.createElement('tr'), label = document.createElement('th'), cell = document.createElement('td');
    label.scope = 'row'; label.textContent = k; cell.textContent = percent(value, 4);
    row.append(label, cell); table.append(row);
  });
  document.getElementById('trial-results').replaceChildren();
  document.getElementById('trial-summary').textContent = localized('Bir deney başlat; tek bir örneğin nasıl değişebildiğini gör.', 'Run an experiment to see how a single sample can vary.');
}
document.addEventListener('languagechange', update);
trials.addEventListener('input', update);
probability.addEventListener('input', update);
document.getElementById('simulate').addEventListener('click', () => {
  const n = Number(trials.value), p = Number(probability.value) / 100;
  const results = document.getElementById('trial-results');
  results.replaceChildren();
  let successes = 0;
  for (let i = 0; i < n; i++) {
    const success = Math.random() < p;
    successes += Number(success);
    const bit = document.createElement('span');
    bit.className = 'trial-bit' + (success ? '' : ' failure');
    bit.textContent = success ? '1' : '0'; bit.style.animationDelay = `${i * 25}ms`;
    results.append(bit);
  }
  document.getElementById('trial-summary').textContent = localized(`${n} tahminde ${successes} doğru, ${n - successes} yanlış · Gözlenen doğruluk ${percent(successes / n)}. Bu rastgele bir tarayıcı simülasyonudur.`, `${successes} correct, ${n - successes} incorrect out of ${n} predictions · Observed accuracy ${percent(successes / n)}. This is a random browser simulation.`);
});
update();
