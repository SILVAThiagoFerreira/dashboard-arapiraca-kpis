/* Renderiza o painel a partir de window.PAINEL (data/kpis.js). */
(function () {
  'use strict';

  var P = window.PAINEL;
  if (!P) return;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var eixoOf = function (id) { return P.eixos.filter(function (e) { return e.id === id; })[0]; };
  var comValor = function (k) { return k.serie.filter(function (p) { return p.valor != null; }); };

  function fmt(v, dec) {
    if (v == null || isNaN(v)) return '—';
    return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  // "R$ 29.319" (prefixo) ou "6,3 pts" (sufixo)
  function valor(k, v, cls) {
    if (v == null) return '<span class="' + cls + '">—</span>';
    return k.prefixo
      ? '<span class="' + cls + '"><small>' + esc(k.unidadeCurta) + '</small> ' + fmt(v, k.dec) + '</span>'
      : '<span class="' + cls + '">' + fmt(v, k.dec) + '<small>' + esc(k.unidadeCurta) + '</small></span>';
  }
  function ultimos(k) {
    var s = comValor(k);
    return { atual: s[s.length - 1], anterior: s[s.length - 2] };
  }
  function delta(k) {
    var u = ultimos(k);
    if (!u.atual) return { txt: 'Sem série verificada', cls: 'flat' };
    if (!u.anterior) return { txt: 'Único ano disponível', cls: 'flat' };
    var d = u.atual.valor - u.anterior.valor;
    var pct = u.anterior.valor ? (d / Math.abs(u.anterior.valor)) * 100 : 0;
    var bom = k.melhorSe === 'menor' ? d < 0 : d > 0;
    var cls = d === 0 ? 'flat' : bom ? 'up' : 'down';
    var seta = d > 0 ? '▲' : d < 0 ? '▼' : '•';
    return { txt: seta + ' ' + (pct >= 0 ? '+' : '') + fmt(pct, 1) + '% vs ' + u.anterior.ano, cls: cls };
  }
  function temSerie(k, campo) { return k.serie.some(function (p) { return p[campo] != null; }); }

  /* ---------- Cabeçalho ---------- */
  if ($('atualizado')) $('atualizado').textContent = 'atualizado em ' + P.atualizado;

  /* ---------- Filtros ---------- */
  var filtros = [{ id: 'todos', nome: 'Todos' }].concat(P.eixos.map(function (e) { return { id: e.id, nome: e.nome }; }));
  $('filtros').innerHTML = filtros.map(function (f, i) {
    return '<button type="button" class="filtro" data-eixo="' + f.id + '" aria-pressed="' + (i === 0) + '">' + esc(f.nome) + '</button>';
  }).join('');
  $('filtros').addEventListener('click', function (ev) {
    var b = ev.target.closest('.filtro');
    if (!b) return;
    var alvo = b.getAttribute('data-eixo');
    Array.prototype.forEach.call($('filtros').querySelectorAll('.filtro'), function (x) {
      x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-filtro]'), function (el) {
      var mostra = alvo === 'todos' || el.getAttribute('data-filtro') === alvo;
      el.hidden = !mostra;
    });
  });

  /* ---------- Números-chave ---------- */
  $('tiles').innerHTML = P.kpis.map(function (k) {
    var e = eixoOf(k.eixo), u = ultimos(k);
    return '<a class="tile" href="#' + esc(k.id) + '" data-filtro="' + esc(k.eixo) + '" style="--c:' + e.cor + ';text-decoration:none;color:inherit">' +
      '<div class="tile__rot">' + esc(k.titulo) + '</div>' +
      '<div class="tile__val">' + (u.atual ? valor(k, u.atual.valor, '').replace(/^<span class="">|<\/span>$/g, '') : '—') + '</div>' +
      '<div class="tile__ano">' + (u.atual ? 'Ano ' + u.atual.ano : 'Dado pendente') + '</div>' +
      '</a>';
  }).join('');

  /* ---------- Eixos e cards ---------- */
  function legendaDe(k) {
    var itens = ['<span><i style="background:' + eixoOf(k.eixo).cor + '"></i>' + esc(P.nomeMunicipio) + '</span>'];
    if (temSerie(k, 'meta')) itens.push('<span><i style="background:#7A8493"></i>Meta</span>');
    if (temSerie(k, 'al')) itens.push('<span><i style="background:#0E8A8A"></i>Alagoas</span>');
    if (temSerie(k, 'br')) itens.push('<span><i style="background:#B8C0CC"></i>Brasil</span>');
    return itens.length > 1 ? '<div class="legenda">' + itens.join('') + '</div>' : '';
  }

  function card(k) {
    var e = eixoOf(k.eixo), u = ultimos(k), d = delta(k);
    var n = comValor(k).length;
    var grafico = n === 0
      ? '<div class="chart chart--vazio">Sem série verificada nesta versão</div>'
      : '<div class="chart"><canvas id="chart-' + esc(k.id) + '" role="img" aria-label="' + esc(k.titulo) + '"></canvas></div>';
    return '<article class="card" id="' + esc(k.id) + '" style="--c:' + e.cor + '">' +
      '<div class="card__top">' +
        '<div><h3 class="card__titulo">' + esc(k.titulo) + '</h3><p class="card__desc">' + esc(k.descricao) + '</p></div>' +
        '<div class="card__num">' + valor(k, u.atual && u.atual.valor, 'card__val') +
          '<div class="card__delta ' + d.cls + '">' + esc(d.txt) + '</div></div>' +
      '</div>' +
      grafico + legendaDe(k) +
      '<div class="card__pe"><span class="card__fonte">Fonte: ' + esc(k.fonteCurta) + '</span>' +
        '<span>Decisão: <span class="decisao decisao--' + esc(k.decisao.acao) + '">' + esc(k.decisao.acao) + '</span></span></div>' +
      '<details class="metodo"><summary>Método e limitações</summary>' +
        '<dl class="metodo__grid">' +
          '<div class="full"><dt>Pergunta que responde</dt><dd>' + esc(k.pergunta) + '</dd></div>' +
          '<div class="full"><dt>Fórmula</dt><dd><code>' + esc(k.formula) + '</code></dd></div>' +
          '<div><dt>Comparado com</dt><dd>' + esc(k.comparacao) + '</dd></div>' +
          '<div><dt>Fonte</dt><dd>' + (k.url ? '<a href="' + esc(k.url) + '" target="_blank" rel="noopener">' + esc(k.fonte) + '</a>' : esc(k.fonte)) + '</dd></div>' +
          '<div><dt>Permite concluir</dt><dd>' + esc(k.permite) + '</dd></div>' +
          '<div><dt>Não permite concluir</dt><dd>' + esc(k.naoPermite) + '</dd></div>' +
          '<div class="full"><dt>Decisão possível</dt><dd>' + esc(k.decisao.texto) + '</dd></div>' +
          '<div class="full"><dt>Limitação</dt><dd>' + esc(k.limitacao) + '</dd></div>' +
        '</dl></details>' +
      '</article>';
  }

  $('eixos').innerHTML = P.eixos.map(function (e) {
    var cards = P.kpis.filter(function (k) { return k.eixo === e.id; }).map(card).join('');
    return '<section class="eixo" data-filtro="' + e.id + '" style="--c:' + e.cor + '">' +
      '<h2 class="eixo__titulo">' + esc(e.nome) + '</h2>' +
      '<div class="grid-cards">' + cards + '</div></section>';
  }).join('');

  /* ---------- Gráficos ---------- */
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.color = '#4A5563';

    P.kpis.forEach(function (k) {
      var canvas = document.getElementById('chart-' + k.id);
      if (!canvas) return;
      var cor = eixoOf(k.eixo).cor;
      var pts = comValor(k);
      var labels = k.serie.map(function (p) { return p.ano; });

      // Um único ano: barra. Série: linha com referências.
      if (pts.length === 1) {
        new Chart(canvas, {
          type: 'bar',
          data: { labels: [pts[0].ano], datasets: [{ data: [pts[0].valor], backgroundColor: cor, borderRadius: 3, barThickness: 70 }] },
          options: barOpcoes(k)
        });
        return;
      }

      var datasets = [{
        label: P.nomeMunicipio,
        data: k.serie.map(function (p) { return p.valor; }),
        borderColor: cor, backgroundColor: cor,
        borderWidth: 3, pointRadius: 3, pointHoverRadius: 6, tension: .25, spanGaps: true
      }];
      if (temSerie(k, 'meta')) datasets.push({ label: 'Meta', data: k.serie.map(function (p) { return p.meta; }), borderColor: '#7A8493', borderDash: [6, 5], borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true });
      if (temSerie(k, 'al')) datasets.push({ label: 'Alagoas', data: k.serie.map(function (p) { return p.al; }), borderColor: '#0E8A8A', borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true });
      if (temSerie(k, 'br')) datasets.push({ label: 'Brasil', data: k.serie.map(function (p) { return p.br; }), borderColor: '#B8C0CC', borderDash: [2, 4], borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true });

      new Chart(canvas, {
        type: 'line',
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function (c) { return ' ' + c.dataset.label + ': ' + fmt(c.parsed.y, k.dec) + ' ' + (k.prefixo ? '' : k.unidadeCurta); } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 8 } },
            y: { grid: { color: '#EEF2F6' }, beginAtZero: !!k.inicioZero, ticks: { callback: function (v) { return fmt(v, k.dec > 0 ? 1 : 0); } } }
          }
        }
      });
    });
  }

  function barOpcoes(k) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + fmt(c.parsed.y, k.dec) + ' ' + (k.prefixo ? '' : k.unidadeCurta); } } } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#EEF2F6' }, ticks: { callback: function (v) { return fmt(v, k.dec > 0 ? 1 : 0); } } }
      }
    };
  }

  /* ---------- Leitura integrada ---------- */
  function listar(id, arr) {
    var el = $(id);
    if (el) el.innerHTML = (arr || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }
  listar('permite', P.permite);
  listar('naoPermite', P.naoPermite);
  listar('recomendacoes', P.recomendacoes);
  listar('fontes', P.fontes);
})();
