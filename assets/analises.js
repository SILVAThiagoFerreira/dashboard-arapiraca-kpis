/* Análises comparativas: Arapiraca frente aos municípios de Alagoas. Só gráficos. */
(function () {
  'use strict';

  var A = window.ANALISES, P = window.PAINEL;
  if (!A || !P || typeof Chart === 'undefined') return;

  var VERMELHO = '#D81818', AZUL = '#0090D8', AZUL_CLARO = 'rgba(0,144,216,.35)', CINZA = '#B8C0CC', GRADE = '#EEF1F6';
  var M = A.municipios;
  var ar = M.filter(function (m) { return m.id === A.arapiraca; })[0];
  var ANOS_AI = [2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025];
  var nomeAR = 'Arapiraca';

  function num(v, d) { return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function corEixo(id) { return P.eixos.filter(function (e) { return e.id === id; })[0].cor; }
  function media(arr) { return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length; }

  var base = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: GRADE } } }
  };
  function opc(extra) {
    var o = JSON.parse(JSON.stringify(base));
    Object.keys(extra || {}).forEach(function (k) {
      if (k === 'plugins' || k === 'scales') {
        o[k] = Object.assign({}, o[k], extra[k]);
      } else { o[k] = extra[k]; }
    });
    return o;
  }
  function legendaAbaixo() { return { legend: { display: true, position: 'bottom', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 } } } }; }

  /* ---------- Cálculos ---------- */
  var anosAR = ANOS_AI.filter(function (y) { return ar.ai && ar.ai[y]; });

  // Posição de Arapiraca no ranking do IDEB anos iniciais (1 = melhor)
  var rankAI = anosAR.map(function (y) {
    var vals = M.filter(function (m) { return m.ai && m.ai[y] && m.ai[y].ideb != null; }).map(function (m) { return m.ai[y].ideb; });
    var mine = ar.ai[y].ideb;
    return { pos: 1 + vals.filter(function (v) { return v > mine; }).length, n: vals.length };
  });

  // Histograma IDEB AI 2025
  var ideb25 = M.filter(function (m) { return m.ai && m.ai[2025] && m.ai[2025].ideb != null; });
  var minV = Math.floor(Math.min.apply(null, ideb25.map(function (m) { return m.ai[2025].ideb; })) * 2) / 2;
  var maxV = Math.ceil(Math.max.apply(null, ideb25.map(function (m) { return m.ai[2025].ideb; })) * 2) / 2;
  var bins = [];
  for (var b = minV; b < maxV; b += 0.5) bins.push(b);
  var contagem = bins.map(function () { return 0; });
  ideb25.forEach(function (m) {
    var i = Math.min(bins.length - 1, Math.floor((m.ai[2025].ideb - minV) / 0.5));
    contagem[i]++;
  });
  var binAR = Math.min(bins.length - 1, Math.floor((ar.ai[2025].ideb - minV) / 0.5));

  // Maiores ganhos do IDEB AI 2005 -> 2025
  var ganhos = M.filter(function (m) { return m.ai && m.ai[2005] && m.ai[2025]; }).map(function (m) {
    return { nome: m.nome, d: m.ai[2025].ideb - m.ai[2005].ideb, ar: m.id === A.arapiraca };
  }).sort(function (a, b) { return b.d - a.d; });
  var topGanhos = ganhos.slice(0, 10);
  if (!topGanhos.some(function (g) { return g.ar; })) topGanhos.push(ganhos.filter(function (g) { return g.ar; })[0]);

  // PIB per capita e vínculos formais
  function pc(m, y) { return m.pib[y] && m.pop[y] ? (m.pib[y] * 1000) / m.pop[y] : null; }
  var pc21 = M.filter(function (m) { return pc(m, 2021) != null; }).map(function (m) {
    return { nome: m.nome, v: pc(m, 2021), ar: m.id === A.arapiraca };
  }).sort(function (a, b) { return b.v - a.v; });
  var topPC = pc21.slice(0, 12);
  if (!topPC.some(function (g) { return g.ar; })) topPC.push(pc21.filter(function (g) { return g.ar; })[0]);

  var vinc21 = M.filter(function (m) { return m.pes[2021] && m.pop[2021]; }).map(function (m) {
    return { nome: m.nome, v: (m.pes[2021] / m.pop[2021]) * 1000, ar: m.id === A.arapiraca };
  }).sort(function (a, b) { return b.v - a.v; });
  var topVinc = vinc21.slice(0, 12);
  if (!topVinc.some(function (g) { return g.ar; })) topVinc.push(vinc21.filter(function (g) { return g.ar; })[0]);

  // População: índice (2010 = 100), Arapiraca x total de Alagoas
  var anosPop = [];
  for (var y = 2010; y <= 2025; y++) anosPop.push(String(y));
  var totalAL = {};
  anosPop.forEach(function (y) {
    var soma = 0, n = 0;
    M.forEach(function (m) { if (m.pop[y] != null) { soma += m.pop[y]; n++; } });
    totalAL[y] = n === M.length ? soma : null;
  });
  var anosPopOK = anosPop.filter(function (y) { return ar.pop[y] != null && totalAL[y] != null; });
  var idxAR = anosPopOK.map(function (y) { return (ar.pop[y] / ar.pop['2010']) * 100; });
  var idxAL = anosPopOK.map(function (y) { return (totalAL[y] / totalAL['2010']) * 100; });

  // Salário de Arapiraca como % da média dos municípios de AL
  var anosSal = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'];
  var anosSalOK = anosSal.filter(function (y) { return ar.sal[y] != null; });
  var pctSal = anosSalOK.map(function (y) {
    var vals = M.filter(function (m) { return m.sal[y] != null; }).map(function (m) { return m.sal[y]; });
    return (ar.sal[y] / media(vals)) * 100;
  });

  /* ---------- Definição dos cards de análise ---------- */
  var analises = [
    {
      id: 'A1', eixo: 'educacao', titulo: 'IDEB anos iniciais: aprovação e aprendizado',
      sub: 'Taxa de aprovação (%) e nota SAEB, rede municipal de Arapiraca',
      draw: function (c) {
        new Chart(c, {
          type: 'line',
          data: { labels: anosAR, datasets: [
            { label: 'Aprovação (%)', data: anosAR.map(function (y) { return ar.ai[y].aprov; }), borderColor: AZUL, backgroundColor: AZUL, tension: .3, borderWidth: 3, pointRadius: 3, yAxisID: 'y' },
            { label: 'Nota SAEB', data: anosAR.map(function (y) { return ar.ai[y].saeb; }), borderColor: VERMELHO, backgroundColor: VERMELHO, tension: .3, borderWidth: 3, pointRadius: 3, yAxisID: 'y1' }
          ] },
          options: opc({ plugins: legendaAbaixo(), scales: {
            x: { grid: { display: false } },
            y: { position: 'left', grid: { color: GRADE }, title: { display: false } },
            y1: { position: 'right', grid: { display: false } }
          } })
        });
      }
    },
    {
      id: 'A2', eixo: 'educacao', titulo: 'Posição de Arapiraca entre os municípios de AL',
      sub: 'Ranking do IDEB anos iniciais (1º = melhor), por ano',
      draw: function (c) {
        new Chart(c, {
          type: 'line',
          data: { labels: anosAR, datasets: [{ label: 'Posição', data: rankAI.map(function (r) { return r.pos; }), borderColor: VERMELHO, backgroundColor: VERMELHO, tension: .3, borderWidth: 3, pointRadius: 4 }] },
          options: opc({
            plugins: { tooltip: { callbacks: { label: function (ctx) { return ' ' + ctx.parsed.y + 'º de ' + rankAI[ctx.dataIndex].n + ' municípios'; } } } },
            scales: { y: { reverse: true, min: 1, grid: { color: GRADE }, ticks: { stepSize: 10 } }, x: { grid: { display: false } } }
          })
        });
      }
    },
    {
      id: 'A3', eixo: 'educacao', titulo: 'Distribuição do IDEB anos iniciais em 2025',
      sub: 'Quantos municípios de AL estão em cada faixa de nota. Arapiraca em vermelho',
      draw: function (c) {
        new Chart(c, {
          type: 'bar',
          data: { labels: bins.map(function (b) { return num(b, 1) + '–' + num(b + .5, 1); }), datasets: [{
            data: contagem, borderRadius: 4,
            backgroundColor: contagem.map(function (_, i) { return i === binAR ? VERMELHO : AZUL_CLARO; })
          }] },
          options: opc({ plugins: { tooltip: { callbacks: { label: function (ctx) { return ' ' + ctx.parsed.y + ' municípios'; } } } } })
        });
      }
    },
    {
      id: 'A4', eixo: 'educacao', titulo: 'Aprovação × IDEB anos iniciais (2025)',
      sub: 'Cada ponto é um município de AL. Quanto mais aprovação, maior o IDEB?',
      draw: function (c) {
        var outros = M.filter(function (m) { return m.id !== A.arapiraca && m.ai && m.ai[2025] && m.ai[2025].aprov != null; });
        new Chart(c, {
          type: 'scatter',
          data: { datasets: [
            { label: 'Municípios de AL', data: outros.map(function (m) { return { x: m.ai[2025].aprov, y: m.ai[2025].ideb, nome: m.nome }; }), backgroundColor: AZUL_CLARO, borderColor: AZUL, pointRadius: 4 },
            { label: nomeAR, data: [{ x: ar.ai[2025].aprov, y: ar.ai[2025].ideb, nome: nomeAR }], backgroundColor: VERMELHO, borderColor: VERMELHO, pointRadius: 8 }
          ] },
          options: opc({
            plugins: Object.assign(legendaAbaixo(), { tooltip: { callbacks: { label: function (ctx) { return ' ' + ctx.raw.nome + ': aprovação ' + num(ctx.raw.x, 1) + '% · IDEB ' + num(ctx.raw.y, 1); } } } }),
            scales: { x: { title: { display: true, text: 'Aprovação (%)' }, grid: { color: GRADE } }, y: { title: { display: true, text: 'IDEB' }, grid: { color: GRADE } } }
          })
        });
      }
    },
    {
      id: 'A5', eixo: 'educacao', titulo: 'Maiores ganhos de IDEB anos iniciais (2005–2025)',
      sub: 'Pontos ganhos entre 2005 e 2025, 10 maiores de AL. Arapiraca em vermelho',
      draw: function (c) {
        new Chart(c, {
          type: 'bar',
          data: { labels: topGanhos.map(function (g) { return g.nome; }), datasets: [{
            data: topGanhos.map(function (g) { return g.d; }), borderRadius: 4,
            backgroundColor: topGanhos.map(function (g) { return g.ar ? VERMELHO : AZUL; })
          }] },
          options: opc({ indexAxis: 'y', plugins: { tooltip: { callbacks: { label: function (ctx) { return ' +' + num(ctx.parsed.x, 1) + ' pontos'; } } } }, scales: { x: { grid: { color: GRADE } }, y: { grid: { display: false } } } })
        });
      }
    },
    {
      id: 'A6', eixo: 'economia', titulo: 'PIB per capita em 2021: maiores de AL',
      sub: 'R$ por habitante, 12 maiores e Arapiraca em vermelho',
      draw: function (c) {
        new Chart(c, {
          type: 'bar',
          data: { labels: topPC.map(function (g) { return g.nome; }), datasets: [{
            data: topPC.map(function (g) { return g.v; }), borderRadius: 4,
            backgroundColor: topPC.map(function (g) { return g.ar ? VERMELHO : AZUL; })
          }] },
          options: opc({ indexAxis: 'y', plugins: { tooltip: { callbacks: { label: function (ctx) { return ' R$ ' + num(ctx.parsed.x); } } } }, scales: { x: { grid: { color: GRADE }, ticks: { callback: function (v) { return 'R$ ' + num(v / 1000) + ' mil'; } } }, y: { grid: { display: false } } } })
        });
      }
    },
    {
      id: 'A7', eixo: 'economia', titulo: 'PIB per capita × salário médio formal (2021)',
      sub: 'Cada ponto é um município de AL. Arapiraca em vermelho',
      draw: function (c) {
        var comSal = M.filter(function (m) { return m.id !== A.arapiraca && m.sal[2021] != null && pc(m, 2021) != null; });
        new Chart(c, {
          type: 'scatter',
          data: { datasets: [
            { label: 'Municípios de AL', data: comSal.map(function (m) { return { x: pc(m, 2021), y: m.sal[2021], nome: m.nome }; }), backgroundColor: AZUL_CLARO, borderColor: AZUL, pointRadius: 4 },
            { label: nomeAR, data: [{ x: pc(ar, 2021), y: ar.sal[2021], nome: nomeAR }], backgroundColor: VERMELHO, borderColor: VERMELHO, pointRadius: 8 }
          ] },
          options: opc({
            plugins: Object.assign(legendaAbaixo(), { tooltip: { callbacks: { label: function (ctx) { return ' ' + ctx.raw.nome + ': PIB pc R$ ' + num(ctx.raw.x) + ' · salário R$ ' + num(ctx.raw.y); } } } }),
            scales: { x: { title: { display: true, text: 'PIB per capita (R$)' }, grid: { color: GRADE } }, y: { title: { display: true, text: 'Salário médio (R$)' }, grid: { color: GRADE } } }
          })
        });
      }
    },
    {
      id: 'A8', eixo: 'economia', titulo: 'População: Arapiraca × Alagoas',
      sub: 'Índice com 2010 = 100. Arapiraca em vermelho, total de AL em azul',
      draw: function (c) {
        new Chart(c, {
          type: 'line',
          data: { labels: anosPopOK, datasets: [
            { label: nomeAR, data: idxAR, borderColor: VERMELHO, backgroundColor: VERMELHO, tension: .3, borderWidth: 3, pointRadius: 2 },
            { label: 'Alagoas', data: idxAL, borderColor: AZUL, backgroundColor: AZUL, tension: .3, borderWidth: 2, pointRadius: 2 }
          ] },
          options: opc({ plugins: legendaAbaixo(), scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 10 } }, y: { grid: { color: GRADE } } } })
        });
      }
    },
    {
      id: 'A9', eixo: 'economia', titulo: 'Salário formal de Arapiraca em relação à média de AL',
      sub: 'Salário médio de Arapiraca como % da média dos municípios de AL',
      draw: function (c) {
        new Chart(c, {
          type: 'line',
          data: { labels: anosSalOK, datasets: [{ label: '% da média', data: pctSal, borderColor: VERMELHO, backgroundColor: VERMELHO, tension: .3, borderWidth: 3, pointRadius: 3, fill: false }] },
          options: opc({ plugins: { tooltip: { callbacks: { label: function (ctx) { return ' ' + num(ctx.parsed.y, 1) + '% da média'; } } } }, scales: { y: { grid: { color: GRADE }, ticks: { callback: function (v) { return v + '%'; } } }, x: { grid: { display: false } } } })
        });
      }
    },
    {
      id: 'A10', eixo: 'economia', titulo: 'Vínculos formais por mil habitantes (2021)',
      sub: 'Pessoal ocupado formal por 1.000 habitantes. 12 maiores de AL, Arapiraca em vermelho',
      draw: function (c) {
        new Chart(c, {
          type: 'bar',
          data: { labels: topVinc.map(function (g) { return g.nome; }), datasets: [{
            data: topVinc.map(function (g) { return g.v; }), borderRadius: 4,
            backgroundColor: topVinc.map(function (g) { return g.ar ? VERMELHO : AZUL; })
          }] },
          options: opc({ indexAxis: 'y', plugins: { tooltip: { callbacks: { label: function (ctx) { return ' ' + num(ctx.parsed.x, 1) + ' por mil hab.'; } } } }, scales: { x: { grid: { color: GRADE } }, y: { grid: { display: false } } } })
        });
      }
    }
  ];

  /* ---------- Render ---------- */
  var grid = document.getElementById('grid');
  if (!grid) return;
  grid.insertAdjacentHTML('beforeend', analises.map(function (a) {
    var cor = corEixo(a.eixo);
    return '<article class="card" data-eixo="' + a.eixo + '" data-busca="' + (a.titulo + ' ' + a.sub + ' análise').toLowerCase() + '" style="--c:' + cor + '">' +
      '<div class="card__head"><div><h2 class="card__titulo">' + a.titulo + '</h2><p class="card__eixo">' + a.sub + '</p></div></div>' +
      '<div class="chart chart--alta"><canvas id="an-' + a.id + '" role="img" aria-label="' + a.titulo + '"></canvas></div>' +
      '</article>';
  }).join(''));

  analises.forEach(function (a) {
    var c = document.getElementById('an-' + a.id);
    if (c) a.draw(c);
  });

  if (typeof window.PAINEL_FILTRAR === 'function') window.PAINEL_FILTRAR();
})();
