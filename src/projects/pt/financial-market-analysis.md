---
lang: pt
pageKey: fma
permalink: /pt/projects/financial-market-analysis/index.html
layout: layouts/case-study.njk
navKey: projects
eyebrow: Estudo de caso · Dados de mercado · Python
lead: Ferramenta em Python para análise rápida de ações dos EUA e do Brasil (B3), com pontuação transparente baseada em regras e a justificativa de cada ponto.
role: Desenvolvido individualmente (projeto de aprendizado)
---

## O que faz

- **Busca** por nome ou ticker, com uso automático do sufixo `.SA` para ações da B3.
- **Dados de mercado** do Yahoo Finance: preço atual e variação diária, valor de mercado, faixa de 52 semanas, P/L e dividend yield.
- **Pontuação por regras (0–100)** com cinco fatores fixos — P/L, posição na faixa de 52 semanas, dividend yield, crescimento de receita e margem de lucro — convertida em faixas *Comprar / Neutro / Evitar*. A contribuição de cada fator é exibida: a pessoa vê o porquê, não só o resultado.
- **Duas interfaces:** painel colorido no terminal (pontuação e histórico de consultas da sessão) e app web simples em Streamlit (preço, métricas, gráfico de 3 meses e resumo da empresa).

## Status da implementação

| Item | Status |
|---|---|
| Ferramenta de terminal com a pontuação de cinco fatores | Implementado |
| App web em Streamlit | Implementado parcialmente — ainda não inclui a pontuação |
| Testes automatizados | Não implementado |
| Modelo de IA ou machine learning | Não utilizado — a pontuação é uma heurística com limites fixos |
| Componente em C++ | Nenhum — o projeto é inteiramente em Python |

## Escopo, com honestidade

A pontuação é uma **heurística simples para fins de aprendizado**. Não é modelo de investimento validado nem recomendação financeira; o repositório traz esse aviso.

## Próximos passos

Remover o ambiente virtual versionado, passar o README para Markdown, levar a pontuação para o app Streamlit, adicionar cache nas consultas e testes unitários para a função de pontuação.
