/* Renderiza o painel a partir de window.PAINEL (data/kpis.js). */
(function () {
  'use strict';

  var P = window.PAINEL;
  if (!P) {
    document.body.insertAdjacentHTML('beforeend', '<p style="padding:20px">Dados não carregados (data/kpis.js).</p>');
    return;
  }

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var eixoOf = function (id) { return P.eixos.filter(function (e) { return e.id === id; })[0]; };

  function fmt(v, dec) {
    if (v == null || isNaN(v)) return '—';
    return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  // Valor com unidade: "R$ 29.319" (prefixo) ou "6,3 pts" (sufixo). Sem valor, mostra travessão.
  function valorCurto(k, v) {
    if (v == null) return '—';
    return k.prefixo ? '<small>' + esc(k.unidadeCurta) + '</small> ' + fmt(v, k.dec)
                     : fmt(v, k.dec) + '<small>' + esc(k.unidadeCurta) + '</small>';
  }
  function ultimo(k) {
    var s = k.serie.filter(function (p) { return p.valor != null; });
    return { atual: s[s.length - 1], anterior: s[s.length - 2] };
  }
  function delta(k) {
    var u = ultimo(k);
    if (!u.atual || !u.anterior) return { txt: 'sem comparação anterior', cls: 'flat' };
    var d = u.atual.valor - u.anterior.valor;
    var pct = u.anterior.valor ? (d / Math.abs(u.anterior.valor)) * 100 : 0;
    var sinal = d > 0 ? '▲' : d < 0 ? '▼' : '●';
    // Para mortalidade infantil, queda é positiva. Usa k.melhorSe.
    var bom = k.melhorSe === 'menor' ? d < 0 : d > 0;
    var cls = d === 0 ? 'flat' : bom ? 'up' : 'down';
    return {
      txt: sinal + ' ' + fmt(Math.abs(d), k.dec) + ' ' + k.unidadeCurta + ' (' + (pct >= 0 ? '+' : '') + fmt(pct, 1) + '%) vs ' + u.anterior.ano,
      cls: cls
    };
  }

  /* ---------- Cabeçalho ---------- */
  if ($('dataAtualizacao')) $('dataAtualizacao').textContent = 'Atualizado em ' + P.atualizado;

  /* ---------- Resumo ---------- */
  var resumoHTML = P.kpis.map(function (k) {
    var e = eixoOf(k.eixo), u = ultimo(k);
    return '<a class="mini" href="#' + esc(k.id) + '" style="--eixo:' + e.cor + '">' +
      '<div class="mini__eixo" style="color:' + e.cor + '">' + esc(e.nome) + '</div>' +
      '<div class="mini__nome">' + esc(k.titulo) + '</div>' +
      '<div class="mini__val">' + valorCurto(k, u.atual && u.atual.valor) + '</div>' +
      '<div class="mini__ano">' + (u.atual ? 'Ano ' + u.atual.ano : '') + '</div>' +
      '</a>';
  }).join('');
  $('resumo').innerHTML = resumoHTML;

  /* ---------- Eixos e cards ---------- */
  var eixosHTML = P.eixos.map(function (e) {
    var cards = P.kpis.filter(function (k) { return k.eixo === e.id; }).map(function (k) {
      return kpiCard(k, e);
    }).join('');
    return '<section class="eixo" style="--eixo:' + e.cor + ';--eixo-soft:' + e.soft + '" aria-labelledby="eixo-' + e.id + '">' +
      '<div class="eixo__head"><span class="eixo__icon">' + esc(e.icone) + '</span>' +
      '<div><h2 id="eixo-' + e.id + '">' + esc(e.nome) + '</h2><p>' + esc(e.descricao) + '</p></div></div>' +
      '<div class="grid-kpi">' + cards + '</div>' +
      '</section>';
  }).join('');
  $('eixos').innerHTML = eixosHTML;

  function kpiCard(k, e) {
    var u = ultimo(k), d = delta(k);
    var legenda = [];
    legenda.push('<span><i style="background:' + e.cor + '"></i>' + esc(P.nomeMunicipio) + '</span>');
    if (k.serie.some(function (p) { return p.meta != null; })) legenda.push('<span><i style="background:#7A8493;border-top:1px dashed #7A8493;height:0"></i>Meta</span>');
    if (k.serie.some(function (p) { return p.al != null; })) legenda.push('<span><i style="background:#0E8A8A"></i>Alagoas</span>');
    if (k.serie.some(function (p) { return p.br != null; })) legenda.push('<span><i style="background:#9AA3B2"></i>Brasil</span>');

    var decisao = k.decisao || {};
    var tabela = '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
      '<thead><tr><th style="text-align:left;padding:4px">Ano</th><th style="text-align:right;padding:4px">' + esc(P.nomeMunicipio) + '</th>' +
      (k.serie.some(function (p) { return p.meta != null; }) ? '<th style="text-align:right;padding:4px">Meta</th>' : '') +
      (k.serie.some(function (p) { return p.al != null; }) ? '<th style="text-align:right;padding:4px">AL</th>' : '') +
      (k.serie.some(function (p) { return p.br != null; }) ? '<th style="text-align:right;padding:4px">BR</th>' : '') +
      '</tr></thead><tbody>' +
      k.serie.slice().reverse().map(function (p) {
        return '<tr><td style="padding:4px;border-top:1px solid var(--line)">' + p.ano + '</td>' +
          '<td style="padding:4px;text-align:right;border-top:1px solid var(--line)">' + fmt(p.valor, k.dec) + '</td>' +
          (k.serie.some(function (q) { return q.meta != null; }) ? '<td style="padding:4px;text-align:right;border-top:1px solid var(--line)">' + fmt(p.meta, k.dec) + '</td>' : '') +
          (k.serie.some(function (q) { return q.al != null; }) ? '<td style="padding:4px;text-align:right;border-top:1px solid var(--line)">' + fmt(p.al, k.dec) + '</td>' : '') +
          (k.serie.some(function (q) { return q.br != null; }) ? '<td style="padding:4px;text-align:right;border-top:1px solid var(--line)">' + fmt(p.br, k.dec) + '</td>' : '') +
          '</tr>';
      }).join('') + '</tbody></table>';

    return '<article class="card kpi" id="' + esc(k.id) + '" style="--eixo:' + e.cor + ';--eixo-soft:' + e.soft + '">' +
      '<div class="kpi__top">' +
        '<div><span class="kpi__tag">' + esc(k.tag || e.nome) + '</span>' +
        '<h3 class="kpi__title">' + esc(k.titulo) + '</h3>' +
        '<p class="kpi__desc">' + esc(k.descricao) + '</p></div>' +
        '<div class="kpi__num"><div class="kpi__big">' + valorCurto(k, u.atual && u.atual.valor) + '</div>' +
        '<div class="kpi__delta ' + d.cls + '">' + esc(d.txt) + '</div>' +
        '<div class="section-sub">Ano ' + (u.atual ? u.atual.ano : '—') + '</div></div>' +
      '</div>' +
      '<div class="chart"><canvas id="chart-' + esc(k.id) + '" role="img" aria-label="Série histórica: ' + esc(k.titulo) + '"></canvas></div>' +
      '<div class="legenda">' + legenda.join('') + '</div>' +
      '<dl class="audit">' +
        '<div class="full"><dt>Pergunta que responde</dt><dd>' + esc(k.pergunta) + '</dd></div>' +
        '<div><dt>Fórmula / como é medido</dt><dd><code>' + esc(k.formula) + '</code></dd></div>' +
        '<div><dt>Fonte</dt><dd>' + (k.url ? '<a class="fonte-link" href="' + esc(k.url) + '" target="_blank" rel="noopener">' + esc(k.fonte) + '</a>' : esc(k.fonte)) + '</dd></div>' +
        '<div><dt>Comparado com</dt><dd>' + esc(k.comparacao) + '</dd></div>' +
        '<div><dt>Decisão possível</dt><dd><span class="decisao decisao--' + esc(decisao.acao) + '">' + esc(decisao.acao) + '</span><br>' + esc(decisao.texto) + '</dd></div>' +
        '<div class="full"><dt>O que permite concluir</dt><dd>' + esc(k.permite) + '</dd></div>' +
        '<div class="full"><dt>O que NÃO permite concluir</dt><dd>' + esc(k.naoPermite) + '</dd></div>' +
        '<div class="full"><dt>Limitação</dt><dd>' + esc(k.limitacao) + '</dd></div>' +
      '</dl>' +
      '<details class="audit-wrap"><summary>Ver série completa (' + k.serie.length + ' anos)</summary><div style="margin-top:10px;overflow-x:auto">' + tabela + '</div></details>' +
      '</article>';
  }

  /* ---------- Gráficos ---------- */
  function corTexto() { return '#4A5563'; }
  function corGrade() { return '#E3E7ED'; }

  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.color = corTexto();

    P.kpis.forEach(function (k) {
      var e = eixoOf(k.eixo);
      var canvas = document.getElementById('chart-' + k.id);
      if (!canvas) return;
      var labels = k.serie.map(function (p) { return p.ano; });
      var datasets = [{
        label: P.nomeMunicipio,
        data: k.serie.map(function (p) { return p.valor; }),
        borderColor: e.cor, backgroundColor: e.cor,
        borderWidth: 3, pointRadius: 3, pointHoverRadius: 6, tension: .25, spanGaps: true
      }];
      if (k.serie.some(function (p) { return p.meta != null; })) {
        datasets.push({ label: 'Meta', data: k.serie.map(function (p) { return p.meta; }), borderColor: '#7A8493', borderDash: [6, 5], borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true });
      }
      if (k.serie.some(function (p) { return p.al != null; })) {
        datasets.push({ label: 'Alagoas', data: k.serie.map(function (p) { return p.al; }), borderColor: '#0E8A8A', borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true });
      }
      if (k.serie.some(function (p) { return p.br != null; })) {
        datasets.push({ label: 'Brasil', data: k.serie.map(function (p) { return p.br; }), borderColor: '#9AA3B2', borderDash: [2, 4], borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true });
      }
      new Chart(canvas, {
        type: 'line',
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (c) { return ' ' + c.dataset.label + ': ' + fmt(c.parsed.y, k.dec) + ' ' + k.unidadeCurta; }
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 8 } },
            y: { grid: { color: corGrade() }, beginAtZero: !!k.inicioZero, ticks: { callback: function (v) { return fmt(v, k.dec > 0 ? 1 : 0); } } }
          }
        }
      });
    });
  }

  /* ---------- Leitura integrada ---------- */
  function listar(id, arr) {
    var el = $(id);
    if (el) el.innerHTML = (arr || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }
  listar('permite', P.permite);
  listar('nao-permite', P.naoPermite);
  listar('recomendacoes', P.recomendacoes);
  if ($('fontes')) $('fontes').innerHTML = (P.fontes || []).map(function (f) { return '<li>' + f + '</li>'; }).join('');
})();
