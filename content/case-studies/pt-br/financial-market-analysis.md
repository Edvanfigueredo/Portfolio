# Análise do Mercado Financeiro — mini estudo de caso (PT-BR)

> Verificado no repositório público `Edvanfigueredo/stock-exchange-analysis` em 13/11/2026. As melhorias em "Próximos passos" deveriam ser feitas antes da publicação [C19][C35].
> **URL:** `/pt/projects/financial-market-analysis/` · **Status:** Concluído — projeto de aprendizado · **Links:** Repositório · App Streamlit [C19]

## Resumo
Ferramenta em Python para análise rápida de ações dos EUA e do Brasil (B3). Busca a empresa pelo nome ou ticker, obtém dados de mercado e fundamentos no Yahoo Finance e gera uma pontuação heurística transparente de 0 a 100, com a justificativa de cada ponto.

## O que faz
- **Busca:** por nome ou ticker, com uso automático do sufixo `.SA` para ações da B3.
- **Dados de mercado:** preço atual e variação diária, valor de mercado, faixa de 52 semanas, P/L e dividend yield.
- **Pontuação heurística** com cinco fatores baseados em regras:
  - P/L;
  - posição na faixa de 52 semanas;
  - dividend yield;
  - crescimento de receita;
  - margem de lucro.

  Os fatores são convertidos em faixas *Comprar / Neutro / Evitar*. A contribuição de cada fator é exibida: a pessoa vê o porquê, não só o resultado.
- **Duas interfaces:** painel colorido no terminal, com histórico de consultas da sessão, e um app web simples em Streamlit (preço, métricas, gráfico de 3 meses, resumo da empresa).

## Tecnologias
Python · yfinance · pandas · Streamlit · colorama · configuração de Dev Container

## Escopo, com honestidade
- A pontuação é uma **heurística simples, baseada em regras, para fins de aprendizado**. Não é um modelo de investimento validado nem recomendação financeira; o repositório traz esse aviso.
- O app Streamlit mostra os dados de mercado, mas ainda não inclui a pontuação.
- Ainda não há testes automatizados.

## Próximos passos (plano de melhoria)
- Remover o ambiente virtual versionado e passar o README para Markdown (`README.md`).
- Descrever a pontuação como "heurística baseada em regras", não como "motor proprietário".
- Levar a pontuação para o app Streamlit, adicionar cache nas consultas e testes unitários para a função de pontuação.
