# Pulse Finance — estudo de caso (PT-BR)

> **Status deste rascunho:** cada afirmação técnica foi verificada no repositório público `Edvanfigueredo/CarteiraDigitalPulse` em 13/11/2026; os testes foram executados, não apenas lidos. Itens `[C#]` dependem de confirmação.
> **URL:** `/pt/projects/pulse-finance/` · **Status:** Concluído — v2.0 · **Links:** Repositório · Demonstração [C33]

---

## 1. Resumo executivo
O Pulse Finance é uma aplicação web de finanças pessoais local-first. A pessoa traz os próprios dados bancários:
- Extratos em cinco formatos (JSON, Excel, CSV, OFX e PDF).
- Uma etapa de conciliação aponta duplicidades antes de qualquer gravação.
- O app conecta dívidas, recorrências, orçamentos e metas em uma visão mensal consistente, com projeção e simulador "e se?".

Os dados ficam no navegador. Não há servidor, conta nem chave de API. O código segue arquitetura em camadas, e 42 testes automatizados rodam no CI antes de cada publicação.

## 2. Contexto de negócio
Ferramentas de finanças pessoais costumam impor uma troca:
- **Planilhas** são privadas, mas manuais.
- **Apps em nuvem** automatizam mais, mas pedem acesso aos dados bancários.

O Pulse foi criado como ferramenta educacional para quem quer organizar receitas, despesas e dívidas e aprender com os próprios números, sem essa troca. [C22: projeto pessoal ou de extensão universitária?]

## 3. Problema
- Extratos chegam em formatos incompatíveis, e reimportar o mesmo período gera duplicidades.
- Compras parceladas e contas recorrentes são difíceis de enxergar mês a mês. A mesma informação é lançada em vários lugares, e os números divergem.
- Privacidade: muitas pessoas não querem enviar extratos a terceiros.

## 4. Meu papel e contribuições
[C34][C29] *Rascunho a confirmar:* projetei e construí a aplicação de ponta a ponta: requisitos, arquitetura, regras de negócio, importação e conciliação, suíte de testes, documentação e pipeline de CI/CD. *(Se houve desenvolvimento assistido por IA, o texto final dirá isso e descreverá o que especifiquei, revisei e testei.)*

## 5. Visão geral da solução
- **Importação de extratos** em JSON (backup completo ou lista de lançamentos), Excel/CSV com detecção automática de colunas e mapeamento manual como alternativa, OFX e PDF ("melhor esforço" para o layout comum `data · descrição · valor`). Antes de confirmar, aparecem um resumo (quantidade, receitas, despesas, período) e a checagem de duplicidades.
- **Conciliação:** cada linha importada é classificada como *nova*, *duplicada exata* (mesma data, valor e descrição) ou *provável duplicada* (mesmo valor em até ±3 dias).
- **Dívidas e parcelas:** o cronograma é gerado automaticamente, e a última parcela absorve o arredondamento. Pagar uma parcela cria a transação real, vincula-a à parcela, atualiza o status da dívida e pode ser desfeito.
- **Receitas e despesas recorrentes**, incluindo a regra de "último dia útil do mês".
- **Calendário financeiro:** une transações reais, parcelas pendentes e recorrências projetadas, sem contar duas vezes. O dashboard lê a mesma fonte, e as duas telas nunca divergem.
- **Projeção e simulador "e se?":** projeção multi-mês, mais cenários de poupança extra mensal, corte percentual de uma categoria ou quitação de uma dívida.
- **Modo privado:** mascara valores na tela. **Alertas** de vencimentos, orçamentos e metas. Exportação em CSV e JSON.

## 6. Arquitetura
```
UI (telas, componentes)
  → Services       regras de negócio: transações, importação, calendário, projeção, simulador, alertas
    → Repositories   um por entidade: transações, contas, dívidas, recorrências, metas…
      → Store          estado em memória + notificação de mudanças
        → db.js          único módulo que acessa o IndexedDB (fallback em localStorage)
```
A persistência fica isolada em um único módulo de propósito. Migrar para um backend REST exige reescrever apenas `db.js` e `store.js`; repositórios, serviços e UI não mudam.
*(Diagrama em SVG acessível a ser produzido na Etapa 2.5.)*

## 7. Tecnologias
JavaScript puro (ES modules) · Vite · IndexedDB · Chart.js · SheetJS (planilhas) · pdf.js (texto de PDFs) · Vitest + jsdom + fake-indexeddb (testes) · GitHub Actions → GitHub Pages

## 8. Decisões técnicas
| Decisão | Alternativa considerada | Motivo |
|---|---|---|
| Local-first, sem backend | Backend em nuvem com contas | Privacidade desde o desenho e infraestrutura zero. O custo: sem sincronização entre dispositivos e sem autenticação real, ambos documentados como fora de escopo. |
| Um único módulo de persistência atrás dos repositórios | Serviços acessando o IndexedDB diretamente | A escolha de armazenamento continua reversível; uma API futura substitui uma única camada. |
| Escape central de HTML (`escapeHtml` / template tag `esc`) | Framework de UI com escape automático | As telas usam template literals e `innerHTML`, então todo dado do usuário passa por uma única função de escape contra XSS. |
| Conciliação antes de gravar, com duplicidade exata e provável | Importar direto e limpar depois | A pessoa decide com informação completa; dados errados nunca são gravados em silêncio. |
| Limitações declaradas no próprio produto | Prometer PDF universal ou "IA" | A importação de PDF é rotulada como melhor esforço; o assistente do app é baseado em regras, não em modelo de linguagem. |

## 9. Desafios de engenharia
- **Extratos heterogêneos:** detecção automática de colunas em planilhas, com mapeamento manual quando a detecção falha.
- **Uma única fonte da verdade:** calendário, dashboard e relatórios precisam mostrar os mesmos números para itens reais, pendentes e projetados.
- **Aritmética de parcelas:** dividir totais sem perder centavos.
- **Isolamento do modo demonstração:** os dados de exemplo nunca contaminam os dados reais. Coberto por testes.

## 10. Segurança e confiabilidade
- Nunca armazena senhas bancárias, CVV, credenciais ou tokens. Os dados ficam no IndexedDB do navegador, no dispositivo.
- Mitigação de XSS com escape centralizado.
- **Não há autenticação**: quem tiver acesso ao navegador vê os dados. Isso está documentado.
- **Melhorias conhecidas** (da minha própria revisão, listadas para manter o status honesto):
  - Atualizar o SheetJS para a linha mantida 0.20.x; a versão 0.18.5 do npm tem um alerta público de severidade alta, e o app processa planilhas enviadas pela pessoa. [C35]
  - Guardar valores em centavos inteiros, não em ponto flutuante.
  - Tornar o pagamento de parcela uma única transação atômica no IndexedDB.
  - Deixar de publicar source maps em produção.

## 11. Resultados e evidências
- **42 testes automatizados em 7 arquivos, todos aprovados.** Executados em instalação limpa em 13/11/2026: onboarding, estado vazio no primeiro acesso, CRUD de transações, aritmética de parcelas, isolamento do modo demonstração, projeção, score, modo privado, alertas, metas e patrimônio, e um teste de fumaça que navega por todas as telas com dados esparsos e completos.
- **CI/CD:** o GitHub Actions executa `npm ci → npm test → npm run build` e só publica no GitHub Pages se os testes passarem.
- **Não existem métricas de uso**, então nenhuma é declarada.

## 12. Status atual
**Concluído — v2.0.** Completo para o escopo local-first. Backend, sincronização e autenticação ficam deliberadamente fora de escopo. Demonstração: [C33].

## 13. Aprendizados
[Rascunho para sua revisão. Deve refletir sua experiência real.]
- Documentar as limitações tornou as decisões de escopo mais fáceis de defender do que adicionar funcionalidades.
- Testes que navegam por todas as telas pegaram quebras de integração que testes unitários sozinhos não pegariam.

## 14. Próximos passos
- Os itens de segurança e confiabilidade da seção 10.
- API de backend opcional, com autenticação e sincronização entre dispositivos. As camadas já estão preparadas.
- Mapeamento de colunas por arrastar e soltar, e edição de categoria linha a linha na conciliação.
- Interface e README em inglês, com capturas de tela no repositório.
