---
lang: pt
pageKey: capstone
permalink: /pt/projects/health-bmi-capstone/index.html
layout: layouts/case-study.njk
navKey: projects
eyebrow: "Estudo de caso · TCC · Saúde"
lead: "Meu TCC, desenvolvido individualmente, do curso de Análise e Desenvolvimento de Sistemas na Faculdade São Francisco de Assis. Aplicação web que calcula o IMC, compara com dados nacionais e sugere planos alimentares educativos de 7 dias."
role: "Projeto acadêmico individual desenvolvido como Trabalho de Conclusão de Curso (TCC), aprovado com nota final 9,5. Todo o código e os commits do repositório público são meus."
---

## Resumo

A aplicação transforma peso, altura, país e preferência alimentar em três resultados: o IMC com sua classificação, a comparação com as médias do país e um plano alimentar de 7 dias, com seis refeições por dia.

**Sobre o nome:** a aplicação se chama "Saúde IA", e a proposta acadêmica explorou a IA como apoio a orientações alimentares. A versão do repositório gera os planos com **regras fixas**. Ela não usa modelo de linguagem nem API externa. Esta página descreve o código como ele está.

**Status: protótipo funcional.** Roda no navegador, sem backend. Tem finalidade educativa e não substitui orientação médica ou nutricional. Não houve validação clínica.

<figure>
  <picture>
    <img src="{{ '/assets/img/capstone-bmi-1280.webp' | url }}" srcset="{{ '/assets/img/capstone-bmi-800.webp' | url }} 800w, {{ '/assets/img/capstone-bmi-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Formulário do Saúde IA com peso 72 kg, altura 175 cm, Brasil e preferência vegetariana, e o resultado: IMC 23,5, peso normal, comparado com o IMC médio e a taxa de obesidade do Brasil.">
  </picture>
  <figcaption>Formulário e resultado, com valores de exemplo. Captura feita localmente a partir do repositório público.</figcaption>
</figure>

## Resultado acadêmico

Desenvolvido como parte da minha formação em Análise e Desenvolvimento de Sistemas (ADS) na Faculdade São Francisco de Assis. O TCC foi **aprovado com nota final 9,5**.

## Problema

- Calculadoras de IMC costumam entregar um número sem contexto nem próximo passo.
- Sugestões alimentares genéricas ignoram hábitos locais e restrições comuns, como intolerância à lactose e diabetes.

## O que está implementado

- **Cálculo e classificação do IMC** em seis faixas, de abaixo do peso a obesidade grau III.
- **Comparação por país** com nove países (Brasil, Estados Unidos, México, Argentina, França, Japão, Alemanha, Irlanda e Itália): IMC médio nacional, taxa de obesidade e posição no ranking. Os valores ficam no código. Fonte de referência dos dados de IMC: Organização Mundial da Saúde (OMS), 2025.
- **Planos alimentares de 7 dias** com seis refeições por dia. O objetivo segue a faixa de IMC: ganho de peso saudável, manutenção ou perda de peso moderada.
- **Oito perfis alimentares:** carnívoro, vegetariano, intolerante à lactose, diabético tipo 1 ou tipo 2, e combinações. Os perfis com diabetes trocam por opções com menos açúcar; os sem lactose usam bebidas vegetais.
- **Listas de alimentos por país,** com alimentos comuns em cada um.
- **Impressão ou PDF** pelo navegador e layout responsivo. Os dados digitados são escapados antes de aparecer na tela.

<figure>
  <picture>
    <img src="{{ '/assets/img/capstone-plan-1280.webp' | url }}" srcset="{{ '/assets/img/capstone-plan-800.webp' | url }} 800w, {{ '/assets/img/capstone-plan-1280.webp' | url }} 1280w" sizes="(min-width: 64rem) 44rem, 100vw" width="1280" height="800" loading="lazy" alt="Plano de 7 dias gerado com foco em manutenção, perfil vegetariano no Brasil, com café da manhã, lanches, almoço, janta e ceia de cada dia.">
  </picture>
  <figcaption>Parte de um plano de 7 dias gerado (valores de exemplo).</figcaption>
</figure>

## Não implementado

Está no roadmap do repositório, mas não foi construído: dashboard em Power BI, login de usuários, histórico de resultados, API externa de nutrição e modo offline (PWA).

## Notas técnicas e limitações

| Item | Situação |
|---|---|
| Stack | HTML, JavaScript puro (um script de cerca de 570 linhas), Tailwind CSS via CDN, hospedado no GitHub Pages |
| Geração dos planos | Baseada em regras: modelos de refeição por objetivo, mais listas de alimentos por país e perfil, com escolhas aleatórias |
| Testes | Não há testes automatizados |
| Repositório | `package.json` e `src` são sobras de um template React não utilizado |
| Dados | Fonte de referência: Organização Mundial da Saúde (OMS), 2025 |

## Próximos passos

Documentar as fontes de dados, criar testes para as regras de IMC e de geração dos planos e remover os arquivos de template não usados.
