# Arapiraca em Indicadores

Painel com 6 KPIs públicos de Arapiraca-AL, 2 em cada eixo: **Educação**, **Saúde** e **Desenvolvimento Econômico**. Projeto Integrador (Etapa 2) — Controladoria, Universidade Estadual de Alagoas (UNEAL).

Cada indicador traz a pergunta que responde, a fórmula, a fonte, o comparativo usado, o que permite e o que não permite concluir, e a decisão possível (manter, alterar ou excluir).

## Indicadores
| Eixo | Indicador | Fonte |
|---|---|---|
| Educação | IDEB anos iniciais (rede municipal) | INEP |
| Educação | IDEB anos finais (rede municipal) | INEP |
| Saúde | Mortalidade infantil | Secretaria Municipal de Saúde (boletim 2024) |
| Saúde | Cobertura da Atenção Básica | e-Gestor AB — **pendente** |
| Desenvolvimento Econômico | PIB per capita | IBGE |
| Desenvolvimento Econômico | Salário médio mensal formal | IBGE (CEMPRE) |

## Estrutura
- `index.html` — página
- `assets/styles.css`, `assets/app.js` — layout e renderização
- `data/kpis.js` — todos os números, fontes e textos (edite aqui)
- `assets/logo-uneal.jpg` — logo da UNEAL

Sem build: basta abrir `index.html` ou servir a pasta com qualquer servidor estático.
