# Pulse Finance — estudo de caso (PT-BR)

> **Status deste rascunho:** revisão 2. Cada afirmação técnica foi verificada no repositório público `Edvanfigueredo/CarteiraDigitalPulse` (commit `4a73070`) em 13/11/2026: testes e build executados, cobertura medida, importação exercitada. Itens `[C#]` dependem de confirmação.
> **URL:** `/pt/projects/pulse-finance/` · **Status:** MVP — v2.0 · **Links:** Repositório · Demonstração [C33]

---

## 1. Resumo executivo
O Pulse Finance é uma aplicação web de finanças pessoais local-first que desenvolvi individualmente. Ela reúne os dados financeiros da própria pessoa em uma visão mensal consistente:
- **Importação:** extratos bancários (OFX, CSV/Excel, PDF) e backups em JSON. Possíveis duplicidades são sinalizadas para revisão antes de qualquer gravação.
- **Planejamento:** dívidas com parcelas, recorrências, orçamentos e metas.
- **Projeção:** projeção multi-mês e simulador "e se?".

Os dados ficam no navegador. Não há servidor, conta nem chave de API. O código segue arquitetura em camadas. 42 testes automatizados passam, e o workflow de CI está configurado para rodá-los antes de cada publicação.

**Status: MVP.** Os fluxos principais funcionam e são testados. Problemas conhecidos na importação, na precisão monetária e na segurança de dependências estão listados abertamente na seção 10. O app não é apresentado como pronto para produção.

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
Projetei e desenvolvi o Pulse individualmente: requisitos, arquitetura, regras de negócio, importação e conciliação, suíte de testes, documentação e pipeline de CI/CD. [C29: se houve desenvolvimento assistido por IA, o texto final dirá isso e descreverá o que especifiquei, revisei e testei.]

## 5. Visão geral da solução
**Implementado:**
- **Importação:**
  - JSON (backup do Pulse ou lista de lançamentos);
  - Excel/CSV com detecção automática de colunas e mapeamento manual como alternativa;
  - OFX;
  - PDF, como "melhor esforço" para o layout comum `data · descrição · valor`.

  Antes de confirmar, aparece um resumo (quantidade, receitas, despesas, período).
- **Sinalização de duplicidades:** cada linha importada é classificada como *nova*, *duplicada exata* (mesma data, valor e descrição) ou *provável duplicada* (mesmo valor em até ±3 dias).
- **Dívidas e parcelas:** o cronograma é gerado automaticamente, e a última parcela absorve o arredondamento. Pagar uma parcela registra a transação real, vincula-a à parcela e atualiza o status da dívida; o pagamento pode ser desfeito.
- **Receitas e despesas recorrentes,** incluindo a regra de "último dia útil do mês" (apenas fins de semana; feriados não são tratados).
- **Calendário financeiro:** combina transações reais, parcelas pendentes e recorrências projetadas. O dashboard lê os próximos compromissos da mesma função, então as duas telas usam uma única fonte.
- **Projeção e simulador "e se?":** projeção multi-mês, mais cenários de poupança extra mensal, corte percentual de uma categoria ou quitação de uma dívida.
- **Modo privado:** mascara valores na tela. **Alertas** de vencimentos, orçamentos e metas. Exportação em CSV e JSON.

**Não implementado (por decisão ou planejado):** backend, sincronização entre dispositivos, autenticação. Ver seção 14.

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
| Escape central de HTML (`escapeHtml` / template tag `esc`) | Framework de UI com escape automático | As telas usam template literals e `innerHTML`, então o dado do usuário passa por uma única função de escape contra XSS. |
| Revisão de duplicidades antes de gravar | Importar direto e limpar depois | A pessoa decide com informação completa antes da gravação. |
| Limitações declaradas no próprio produto | Prometer PDF universal ou "IA" | A importação de PDF é rotulada como melhor esforço; o assistente do app é baseado em regras, não em modelo de linguagem. |

## 9. Desafios de engenharia
- **Extratos heterogêneos:** detecção automática de colunas em planilhas, com mapeamento manual quando a detecção falha.
- **Uma única fonte da verdade:** calendário e dashboard leem itens reais, pendentes e projetados da mesma função.
- **Aritmética de parcelas:** dividir totais sem perder centavos.
- **Isolamento do modo demonstração:** os dados de exemplo nunca contaminam os dados reais. Coberto por testes.

## 10. Segurança, confiabilidade e problemas conhecidos
**Implementado:**
- Nunca armazena senhas bancárias, CVV, credenciais ou tokens. Os dados ficam no IndexedDB do navegador, no dispositivo.
- Mitigação de XSS com escape centralizado.

**Limitações por decisão:** não há autenticação. Quem tiver acesso ao navegador vê os dados, e isso está documentado.

**Problemas conhecidos, em aberto** (da minha própria revisão; são o motivo do status MVP):
1. **Valores em OFX com vírgula decimal** (ex.: `-123,45`) são lidos sem os centavos. Alguns bancos brasileiros exportam nesse formato. Lançamentos OFX sem data recebem a data atual, sem aviso.
2. **Importação e conciliação ainda não têm testes automatizados.** Cobertura de linhas medida: conciliação 6%, serviço de importação 13%, parsers de 4% a 19%.
3. **Valores monetários usam ponto flutuante.** Deveriam ser guardados em centavos inteiros.
4. **Pagar uma parcela faz duas gravações separadas,** então uma interrupção entre elas pode deixar o pagamento registrado e a parcela ainda pendente. Deveria ser uma operação atômica.
5. **Dependências:** a biblioteca de planilhas (SheetJS 0.18.5 do npm) tem alertas públicos de severidade alta, e a correção exige a linha mantida 0.20.x da distribuição oficial da SheetJS. Ferramentas usadas só no desenvolvimento (Vite, Vitest) também precisam de atualização de versão principal. [C35]

## 11. Resultados e evidências
- **42 testes automatizados em 7 arquivos, todos aprovados,** executados em instalação limpa em 13/11/2026. Cobrem onboarding, estado vazio no primeiro acesso, CRUD de transações, dívidas e aritmética de parcelas, isolamento do modo demonstração, projeção, score, simulador "e se?", modo privado, alertas, metas e patrimônio, e um teste de fumaça que navega por todas as telas com dados esparsos e completos.
- **Cobertura medida:** 47% das linhas no total.
  - De 96% a 100% em dívidas, projeção, simulador, regras de dias úteis e modo privado.
  - Baixa em importação e conciliação (ver seção 10).
- **CI/CD:** o workflow do GitHub Actions está configurado para executar `npm ci → npm test → npm run build` e só publicar no GitHub Pages se os testes passarem.
- **Não existem métricas de uso,** então nenhuma é declarada.

## 12. Status atual
**MVP — v2.0.** Funciona no escopo local-first, com os problemas em aberto da seção 10. Não está pronto para produção. Backend, sincronização e autenticação ficam deliberadamente fora de escopo. Demonstração: [C33].

## 13. Aprendizados
[Rascunho para sua revisão. Deve refletir sua experiência real.]
- Documentar as limitações tornou as decisões de escopo mais fáceis de defender do que adicionar funcionalidades.
- Testes que navegam por todas as telas pegaram quebras de integração, mas as áreas sem testes (os parsers de importação) foram justamente onde a revisão encontrou defeitos.

## 14. Próximos passos
- Corrigir os problemas da seção 10: vírgula decimal no OFX, testes de importação e conciliação, centavos inteiros, pagamento de parcela atômico, atualização de dependências.
- API de backend opcional, com autenticação e sincronização entre dispositivos. As camadas já estão preparadas.
- Mapeamento de colunas por arrastar e soltar, e edição de categoria linha a linha na conciliação.
- Interface e README em inglês, com capturas de tela no repositório.
