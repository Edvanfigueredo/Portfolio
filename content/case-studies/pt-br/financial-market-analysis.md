# Análise do Mercado Financeiro — mini estudo de caso (PT-BR)

> Revisão 2. Verificado no repositório público `Edvanfigueredo/stock-exchange-analysis` em 13/11/2026. As melhorias em "Próximos passos" deveriam ser feitas antes da publicação [C19][C35].
> **URL:** `/pt/projects/financial-market-analysis/` · **Status:** Concluído (projeto de aprendizado) · **Links:** Repositório · App Streamlit [C19]

## Resumo
Ferramenta em Python para análise rápida de ações dos EUA e do Brasil (B3). Busca a empresa pelo nome ou ticker, obtém dados de mercado e fundamentos no Yahoo Finance e gera uma pontuação transparente de 0 a 100, com a justificativa de cada ponto.

## O que faz
- **Busca:** por nome ou ticker, com uso automático do sufixo `.SA` para ações da B3.
- **Dados de mercado:** preço atual e variação diária, valor de mercado, faixa de 52 semanas, P/L e dividend yield.
- **Pontuação por regras** com cinco fatores fixos:
  - P/L;
  - posição na faixa de 52 semanas;
  - dividend yield;
  - crescimento de receita;
  - margem de lucro.

  A pontuação é convertida em faixas *Comprar / Neutro / Evitar*. A contribuição de cada fator é exibida: a pessoa vê o porquê, não só o resultado.
- **Duas interfaces:**
  - painel colorido no terminal (pontuação e histórico de consultas da sessão);
  - app web simples em Streamlit (preço, métricas, gráfico de 3 meses, resumo da empresa; **ainda não** inclui a pontuação).

## Tecnologias
Python · yfinance · pandas · Streamlit · colorama · configuração de Dev Container

## Escopo, com honestidade
- A pontuação é uma **heurística simples com limites fixos**. **Não é modelo de IA nem de machine learning**, não é modelo de investimento validado nem recomendação financeira; o repositório traz esse aviso.
- O projeto é inteiramente em Python. Não há componente em C++.
- Ainda não há testes automatizados.

## Próximos passos (plano de melhoria)
- Remover o ambiente virtual versionado e passar o README para Markdown (`README.md`).
- Descrever a pontuação como "heurística baseada em regras", não como "motor proprietário".
- Levar a pontuação para o app Streamlit, adicionar cache nas consultas e testes unitários para a função de pontuação.
