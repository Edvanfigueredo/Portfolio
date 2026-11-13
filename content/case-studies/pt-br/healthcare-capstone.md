# TCC de Saúde (IMC e Nutrição) — mini estudo de caso (PT-BR)

> **Publicação bloqueada até a resposta de [C18].** O repositório público `Edvanfigueredo/IMC_BMI_health` é uma aplicação front-end com lógica baseada em regras. A arquitetura descrita no planejamento anterior (Node/Express, React, Azure SQL, Azure Pipelines, planos gerados por IA) **não** está nesse repositório. Este rascunho descreve apenas o que o código público mostra.
> **URL:** `/pt/projects/healthcare-capstone/` · **Status:** Projeto acadêmico · **Links:** Repositório · Demonstração

## Resumo
Aplicação web desenvolvida na graduação em Análise e Desenvolvimento de Sistemas [C18]. Calcula o Índice de Massa Corporal, compara o resultado com estatísticas por país e gera um exemplo de plano alimentar de 7 dias e 6 refeições, ajustado à faixa de IMC, ao país e ao perfil alimentar.

## O que faz
- Cálculo e classificação do IMC.
- Comparação com uma tabela de referência de nove países [C18: fonte das estatísticas].
- Planos alimentares por regras, a partir de listas de alimentos por país. Suporta perfis vegetariano, intolerante à lactose e diabético tipos 1 e 2, além de combinações.
- Saída para impressão.

## Tecnologias
HTML · Tailwind CSS · JavaScript (sem framework) · GitHub Pages

## Escopo, com honestidade
- Os planos vêm de **regras e modelos determinísticos**, não de modelo de linguagem.
- **Projeto educacional. Não substitui orientação médica ou nutricional** e não é ferramenta clinicamente validada. O aviso permanece em destaque, especialmente para perfis com diabetes.

## Próximos passos
Citar as fontes de dados, criar testes unitários para as regras de IMC e de planos, remover o `package.json` de modelo não utilizado e, se [C18] confirmar, publicar a versão completa em camadas com a respectiva arquitetura.
