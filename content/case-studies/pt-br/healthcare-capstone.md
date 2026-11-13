# TCC de Saúde (IMC e Nutrição) — mini estudo de caso (PT-BR)

> **Revisão 2 · publicação bloqueada até a resposta de [C18].** Este rascunho descreve apenas o que o repositório público `Edvanfigueredo/IMC_BMI_health` contém, conforme verificado em 13/11/2026. Materiais de planejamento anteriores e o README do perfil no GitHub mencionam Java, IA, Power BI, backend Node/Express, React, Azure SQL e Azure Pipelines. **Nada disso existe no repositório**, portanto nada disso é afirmado aqui.
> **URL:** `/pt/projects/healthcare-capstone/` · **Status:** Projeto acadêmico · **Links:** Repositório · Demonstração

## Resumo
Aplicação web de página única desenvolvida na graduação em Análise e Desenvolvimento de Sistemas [C18]. Calcula o Índice de Massa Corporal, compara o resultado com valores de referência por país e gera um exemplo de plano alimentar de 7 dias (6 refeições por dia), ajustado à faixa de IMC, ao país e ao perfil alimentar.

## O que existe — e o que não existe
| Categoria | No repositório |
|---|---|
| **Implementado** | Cálculo e classificação do IMC · comparação com uma tabela fixa de referência de nove países [C18: fonte dos valores] · saída para impressão (impressão do navegador) |
| **Regras e modelos determinísticos** | Planos montados a partir de listas de alimentos por país e modelos fixos, ajustados para perfis vegetariano, intolerante à lactose e diabético tipos 1 e 2, e suas combinações |
| **IA real** | **Nenhuma.** Sem modelo de linguagem, sem API de IA, sem chamadas de rede. |
| **Backend** | **Nenhum.** O app roda inteiramente no navegador. |
| **Integrações** | **Nenhuma** além do Tailwind CSS (CDN) e da hospedagem no GitHub Pages. Sem Azure, Java, Power BI ou banco de dados. |
| **Planejado (não construído)** | Itens do roadmap do repositório: dashboard em Power BI, login, histórico de resultados, API externa de nutrição, modo offline (PWA) |

## Tecnologias
HTML · Tailwind CSS · JavaScript (sem framework) · GitHub Pages

## Escopo, com honestidade
- **Projeto educacional. Não substitui orientação médica ou nutricional** e não é ferramenta clinicamente validada. O aviso permanece em destaque, especialmente para perfis com diabetes.

## Próximos passos
Citar as fontes de dados, criar testes unitários para as regras de IMC e de planos, remover o `package.json` de modelo não utilizado e corrigir o README do perfil no GitHub para que corresponda ao código.
