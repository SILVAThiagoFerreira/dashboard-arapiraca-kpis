/* Renderiza o painel a partir de window.PAINEL (data/kpis.js). Só gráficos e números. */
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
  var temSerie = function (k, campo) { return k.serie.some(function (p) { return p[campo] != null; }); };

  function fmt(v, dec) {
    if (v == null || isNaN(v)) return '—';
    return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  function numero(k, v) {
    if (v == null) return '<span class="card__num">—</span>';
    return k.prefixo
      ? '<span class="card__num"><small>' + esc(k.unidadeCurta) + '</small> ' + fmt(v, k.dec) + '</span>'
      : '<span class="card__num">' + fmt(v, k.dec) + '<small>' + esc(k.unidadeCurta) + '</small></span>';
  }
  function ultimo(k) {
    var s = comValor(k);
    return s[s.length - 1];
  }

  /* ---------- Ícones da navegação (SVG simples) ---------- */
  var ICONES = {
    todos: '<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" fill="currentColor"/>',
    educacao: '<path d="M12 4L2 9l10 5 10-5-10-5z" fill="currentColor"/><path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4l-6 3-6-3z" fill="currentColor"/>',
    saude: '<path d="M12 21s-7-4.4-9.3-9A5.2 5.2 0 0 1 12 6.5 5.2 5.2 0 0 1 21.3 12C19 16.6 12 21 12 21z" fill="currentColor"/>',
    economia: '<path d="M3 17l6-6 4 4 8-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  function icone(id) {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' + (ICONES[id] || ICONES.todos) + '</svg>';
  }

  /* ---------- Navegação lateral ---------- */
  var areas = [{ id: 'todos', nome: 'Dashboard', icone: 'todos' }].concat(P.eixos.map(function (e) {
    return { id: e.id, nome: e.nome, icone: e.id };
  }));
  var atual = 'todos';

  function renderNav() {
    $('nav').innerHTML = areas.map(function (a) {
      return '<button type="button" class="nav__item" data-area="' + a.id + '" aria-current="' + (a.id === atual) + '">' +
        icone(a.icone) + '<span>' + esc(a.nome) + '</span></button>';
    }).join('');
  }

  /* ---------- Cards ---------- */
  function legendaDe(k) {
    var itens = ['<span><i style="background:' + eixoOf(k.eixo).cor + '"></i>' + esc(P.nomeMunicipio) + '</span>'];
    if (temSerie(k, 'meta')) itens.push('<span><i style="background:#7A8493"></i>Meta</span>');
    if (temSerie(k, 'al')) itens.push('<span><i style="background:#0E8A8A"></i>Alagoas</span>');
    if (temSerie(k, 'br')) itens.push('<span><i style="background:#B8C0CC"></i>Brasil</span>');
    return itens.length > 1 ? '<div class="legenda">' + itens.join('') + '</div>' : '';
  }

  function card(k) {
    var e = eixoOf(k.eixo), u = ultimo(k);
    var grafico = comValor(k).length === 0
      ? '<div class="chart chart--vazio">Sem série verificada</div>'
      : '<div class="chart"><canvas id="chart-' + esc(k.id) + '" role="img" aria-label="' + esc(k.titulo) + '"></canvas></div>';
    return '<article class="card" data-eixo="' + esc(k.eixo) + '" data-busca="' + esc((k.titulo + ' ' + k.descricao + ' ' + e.nome).toLowerCase()) + '">' +
      '<div class="card__head">' +
        '<div><h2 class="card__titulo">' + esc(k.titulo) + '</h2><p class="card__eixo">' + esc(e.nome) + '</p></div>' +
        '<div class="card__valor">' + numero(k, u && u.valor) + (u ? '<div class="card__ano">' + u.ano + '</div>' : '') + '</div>' +
      '</div>' +
      grafico + legendaDe(k) +
    '</article>';
  }

  function renderCards() {
    $('grid').innerHTML = P.kpis.map(card).join('');
  }

  /* ---------- Filtros: área (menu) e busca ---------- */
  function aplicarFiltros() {
    var termo = ($('busca').value || '').trim().toLowerCase();
    var visiveis = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.card'), function (c) {
      var okArea = atual === 'todos' || c.getAttribute('data-eixo') === atual;
      var okBusca = !termo || c.getAttribute('data-busca').indexOf(termo) !== -1;
      c.hidden = !(okArea && okBusca);
      if (!c.hidden) visiveis++;
    });
    $('vazio').hidden = visiveis > 0;
    $('titulo').textContent = (areas.filter(function (a) { return a.id === atual; })[0] || areas[0]).nome;
  }

  /* ---------- Gráficos ---------- */
  function barOpcoes(k) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + fmt(c.parsed.y, k.dec) + ' ' + (k.prefixo ? '' : k.unidadeCurta); } } } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#EEF1F6' }, ticks: { callback: function (v) { return fmt(v, k.dec > 0 ? 1 : 0); } } }
      }
    };
  }

  function desenharGraficos() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.color = '#5B6170';

    P.kpis.forEach(function (k) {
      var canvas = document.getElementById('chart-' + k.id);
      if (!canvas) return;
      var cor = eixoOf(k.eixo).cor;
      var pts = comValor(k);

      if (pts.length === 1) {
        new Chart(canvas, {
          type: 'bar',
          data: { labels: [pts[0].ano], datasets: [{ data: [pts[0].valor], backgroundColor: cor, borderRadius: 6, barThickness: 80 }] },
          options: barOpcoes(k)
        });
        return;
      }

      var datasets = [{
        label: P.nomeMunicipio,
        data: k.serie.map(function (p) { return p.valor; }),
        borderColor: cor, backgroundColor: cor,
        borderWidth: 3, pointRadius: 3, pointHoverRadius: 6, tension: .3, spanGaps: true
      }];
      if (temSerie(k, 'meta')) datasets.push({ label: 'Meta', data: k.serie.map(function (p) { return p.meta; }), borderColor: '#7A8493', borderDash: [6, 5], borderWidth: 2, pointRadius: 0, tension: .3, spanGaps: true });
      if (temSerie(k, 'al')) datasets.push({ label: 'Alagoas', data: k.serie.map(function (p) { return p.al; }), borderColor: '#0E8A8A', borderWidth: 2, pointRadius: 0, tension: .3, spanGaps: true });
      if (temSerie(k, 'br')) datasets.push({ label: 'Brasil', data: k.serie.map(function (p) { return p.br; }), borderColor: '#B8C0CC', borderDash: [2, 4], borderWidth: 2, pointRadius: 0, tension: .3, spanGaps: true });

      new Chart(canvas, {
        type: 'line',
        data: { labels: k.serie.map(function (p) { return p.ano; }), datasets: datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function (c) { return ' ' + c.dataset.label + ': ' + fmt(c.parsed.y, k.dec) + ' ' + (k.prefixo ? '' : k.unidadeCurta); } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 8 } },
            y: { grid: { color: '#EEF1F6' }, beginAtZero: !!k.inicioZero, ticks: { callback: function (v) { return fmt(v, k.dec > 0 ? 1 : 0); } } }
          }
        }
      });
    });
  }

  /* ---------- Eventos ---------- */
  $('atualizado').textContent = P.atualizado;
  renderNav();
  renderCards();
  desenharGraficos();
  aplicarFiltros();

  $('nav').addEventListener('click', function (ev) {
    var b = ev.target.closest('.nav__item');
    if (!b) return;
    atual = b.getAttribute('data-area');
    renderNav();
    aplicarFiltros();
    $('side').classList.remove('aberto');
  });
  $('busca').addEventListener('input', aplicarFiltros);
  $('menu').addEventListener('click', function () {
    var aberto = $('side').classList.toggle('aberto');
    $('menu').setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
})();
