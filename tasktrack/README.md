
# TaskTrack — Gerenciador de Tarefas e Bugs

O TaskTrack é uma aplicação web desenvolvida com HTML, CSS e JavaScript para organizar tarefas e acompanhar registros de bugs.

O projeto foi criado para colocar em prática conhecimentos de desenvolvimento web, lógica de programação, manipulação do DOM e armazenamento de dados no navegador.

## Funcionalidades

- Cadastro de tarefas e bugs
- Edição e exclusão de registros
- Classificação por prioridade: baixa, média e alta
- Acompanhamento por status: pendente, em andamento e concluída
- Alteração rápida de status diretamente nos cartões
- Pesquisa por título e descrição
- Filtros combinados por tipo, prioridade e status
- Ordenação por data de criação e prioridade
- Registro automático das datas de criação e atualização
- Dashboard com indicadores atualizados automaticamente
- Armazenamento de dados utilizando localStorage
- Interface responsiva para computadores e dispositivos móveis

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Web Storage API (localStorage)

## Como executar

1. Faça o download dos arquivos do projeto.
2. Abra a pasta do projeto.
3. Execute o arquivo `index.html` em um navegador.

Não é necessário instalar dependências ou configurar um servidor.

## Como utilizar

1. Clique em **+ Nova tarefa** para cadastrar um registro.
2. Escolha se o registro é uma tarefa ou um bug.
3. Preencha o título, a descrição (opcional), a prioridade e o status.
4. Clique em **Salvar tarefa**.
5. Utilize os filtros, a pesquisa e a ordenação para localizar registros.
6. Altere o status diretamente nos cartões ou utilize os botões de edição e exclusão.

## Armazenamento de dados

Os registros são armazenados localmente no navegador por meio do `localStorage`.

Isso permite manter as informações após atualizar ou fechar a página, desde que os dados do site não sejam apagados.

O projeto não utiliza banco de dados externo nem autenticação de usuários.

## Objetivo do projeto

Praticar o desenvolvimento de uma aplicação web funcional, incluindo:

- Manipulação de elementos HTML com JavaScript
- Tratamento de eventos
- Operações de cadastro, consulta, atualização e exclusão (CRUD)
- Manipulação de arrays e objetos
- Implementação de pesquisa, filtros e ordenação
- Persistência de dados no navegador
- Desenvolvimento de interfaces responsivas
