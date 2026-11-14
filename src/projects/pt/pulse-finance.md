---
lang: pt
pageKey: pulse
permalink: /pt/projects/pulse-finance/index.html
layout: layouts/case-study.njk
navKey: projects
eyebrow: Estudo de caso · Finanças pessoais · Aplicação web local-first
lead: Aplicação web de finanças pessoais local-first que projetei e desenvolvi individualmente em um projeto de extensão universitária sobre educação financeira. Importação de extratos, sinalização de duplicidades, dívidas, recorrências e projeções em uma visão mensal consistente.
role: "Projeto individual, criado em um projeto de extensão universitária. A IA apoiou o protótipo inicial de UX; eu desenvolvi a aplicação."
---

## Resumo

O Pulse Finance reúne os dados financeiros da própria pessoa em uma visão mensal:

- **Importação:** extratos bancários (OFX, CSV/Excel, PDF) e backups em JSON. Possíveis duplicidades são sinalizadas para revisão antes de qualquer gravação.
- **Planejamento:** dívidas com parcelas, recorrências, orçamentos e metas.
- **Projeção:** projeção multi-mês e simulador “e se?”.

Os dados ficam no navegador: sem servidor, sem conta, sem chave de API. **Status: MVP.** Os fluxos principais funcionam. Dívidas, projeções, o simulador “e se?” e o modo privado têm testes automatizados; a importação ainda não. Os problemas conhecidos estão listados abaixo, e o app não é apresentado como pronto para produção.

<figure>
  <picture>
    <img src="{{ '/assets/img/pulse-dashboard-1280.webp' | url }}" srcset="{{ '/assets/img/pulse-dashboard-800.webp' | url }} 800w, {{ '/assets/img/pulse-dashboard-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Visão geral do Pulse Finance no modo demonstração: patrimônio líquido, saldo em contas, receitas e despesas do mês, o Pulse Score com seus cinco fatores e gráficos.">
  </picture>
  <figcaption>Visão geral com o conjunto de dados de demonstração do próprio app (dados fictícios).</figcaption>
</figure>

## Origem: um projeto de extensão universitária

O Pulse surgiu em um projeto de extensão universitária da Universidade Cruzeiro do Sul, no qual cada proposta precisava se relacionar com os Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030 da ONU. Projetei e desenvolvi a aplicação individualmente como ferramenta de apoio a uma atividade prática de educação financeira: uma dinâmica, oficina e palestra para jovens do Ensino Médio. A proposta era tornar a educação financeira mais acessível, prática e interativa, com uma ferramenta real de organização financeira.

Esta página não afirma adoção por escolas, uso em larga escala nem resultados educacionais medidos.

## Como foi construído

A IA foi utilizada como apoio na prototipação inicial da experiência do usuário, como referência visual e de navegação. A partir dessa referência, conduzi o desenvolvimento da aplicação: arquitetura, regras de negócio, lógica de importação e conciliação, testes e pipeline de CI/CD.

## Problema

- Extratos chegam em formatos incompatíveis, e reimportar o mesmo período gera duplicidades.
- Compras parceladas e contas recorrentes são difíceis de enxergar mês a mês; a mesma informação é lançada em vários lugares e os números divergem.
- Muitas pessoas não querem enviar extratos a um serviço de terceiros.

## O que está implementado

- **Importação:** JSON (backup ou lista de lançamentos); Excel/CSV com detecção automática de colunas e mapeamento manual como alternativa; OFX; PDF como "melhor esforço" para o layout comum `data · descrição · valor`. Antes de confirmar, aparece um resumo (quantidade, receitas, despesas, período).
- **Sinalização de duplicidades:** cada linha importada é classificada como *nova*, *duplicada exata* (mesma data, valor e descrição) ou *provável duplicada* (mesmo valor em até ±3 dias).
- **Dívidas e parcelas:** o cronograma é gerado automaticamente, e a última parcela absorve o arredondamento. Pagar uma parcela registra a transação, vincula-a e atualiza o status da dívida; o pagamento pode ser desfeito.
- **Receitas e despesas recorrentes,** incluindo a regra de "último dia útil do mês" (apenas fins de semana; feriados não são tratados).
- **Calendário financeiro:** transações reais, parcelas pendentes e recorrências projetadas; o dashboard lê os próximos compromissos da mesma função.
- **Projeção e simulador “e se?”:** projeção multi-mês e cenários de poupança extra, corte de uma categoria ou quitação de uma dívida.
- **Modo privado** que mascara valores na tela, **alertas** de vencimentos, orçamentos e metas, e exportação em CSV e JSON.

**Não implementado** (por decisão ou planejado): backend, sincronização entre dispositivos, autenticação.

<figure>
  <picture>
    <img src="{{ '/assets/img/pulse-calendario-1280.webp' | url }}" srcset="{{ '/assets/img/pulse-calendario-800.webp' | url }} 800w, {{ '/assets/img/pulse-calendario-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Calendário financeiro do Pulse Finance no modo demonstração, combinando transações reais, parcelas pendentes e recorrências projetadas do mês.">
  </picture>
  <figcaption>Calendário financeiro (dados de demonstração).</figcaption>
</figure>

## Arquitetura

```
UI (telas, componentes)
  → Services       regras de negócio: transações, importação, calendário, projeção, simulador, alertas
    → Repositories   um por entidade: transações, contas, dívidas, recorrências, metas
      → Store          estado em memória + notificação de mudanças
        → db.js          único módulo que acessa o IndexedDB (fallback em localStorage)
```

A persistência fica isolada em um único módulo de propósito: migrar para um backend REST exige reescrever apenas `db.js` e `store.js`.

## Decisões técnicas

| Decisão | Alternativa considerada | Motivo |
|---|---|---|
| Local-first, sem backend | Backend em nuvem com contas | Privacidade desde o desenho e infraestrutura zero; o custo é não ter sincronização nem autenticação real, ambos documentados. |
| Um módulo de persistência atrás dos repositórios | Serviços acessando o IndexedDB | A escolha de armazenamento continua reversível. |
| Escape central de HTML (`escapeHtml` / `esc`) | Framework de UI com escape automático | As telas usam template literals, então o dado do usuário passa por uma única função de escape contra XSS. |
| Revisão de duplicidades antes de gravar | Importar direto e limpar depois | A pessoa decide com informação completa antes da gravação. |
| Limitações declaradas no produto | Prometer PDF universal ou "IA" | A importação de PDF é rotulada como melhor esforço; o assistente do app é baseado em regras, não em modelo de linguagem. |

## Problemas conhecidos (em aberto)

1. **Valores em OFX com vírgula decimal** (ex.: `-123,45`) são lidos sem os centavos; lançamentos OFX sem data recebem a data atual, sem aviso.
2. **Importação e conciliação ainda não têm testes automatizados** (cobertura de linhas: conciliação 6%, serviço de importação 13%, parsers de 4% a 19%).
3. **Valores monetários usam ponto flutuante;** deveriam ser guardados em centavos inteiros.
4. **Pagar uma parcela faz duas gravações separadas;** deveria ser uma operação atômica.
5. **Dependências:** a biblioteca de planilhas (SheetJS 0.18.5 do npm) tem alertas públicos de severidade alta; as ferramentas de desenvolvimento (Vite, Vitest) precisam de atualização de versão principal.

## Evidências

- **42 testes automatizados em 7 arquivos, todos aprovados** em instalação limpa (verificado em 13/11/2026): onboarding, CRUD de transações, dívidas e parcelas, isolamento do modo demonstração, projeção, score, simulador, modo privado, alertas, metas, patrimônio e um teste de fumaça que navega por todas as telas.
- **Cobertura de linhas medida:** 47% no total; de 96% a 100% em dívidas, projeção, simulador, regras de dias úteis e modo privado.
- **CI/CD:** o workflow do GitHub Actions está configurado para executar `npm ci → npm test → npm run build` e só publicar se os testes passarem.
- **Não existem métricas de uso,** então nenhuma é declarada.

## Lições aprendidas

- **Planejamento:** a importância de planejar a solução antes de iniciar o desenvolvimento.
- **Comunicação e oratória:** explicar o mesmo assunto para públicos diferentes, adaptando a linguagem e a abordagem ao perfil de quem está ouvindo.
- **Arquitetura e banco de dados:** desenvolver uma solução com arquitetura e banco de dados locais, adequada a quem usaria a aplicação sem depender de um backend tradicional.
- **Conhecimento financeiro:** aprofundar o domínio da terminologia e dos conceitos do mundo financeiro, aprendendo a traduzir termos técnicos para uma linguagem acessível a jovens e adultos.

## Próximos passos

Corrigir os problemas acima, criar interface e README em inglês e, opcionalmente, uma API de backend com autenticação e sincronização, para a qual as camadas já estão preparadas.
