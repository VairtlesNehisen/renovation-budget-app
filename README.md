Sistema de Orçamento para Reforma

Este projeto é um sistema web interativo para ajudar usuários a estimar o custo de uma reforma, oferecendo a funcionalidade de selecionar diferentes tipos de serviços, níveis de acabamento e medidas. Ele é dividido em um frontend (HTML, CSS com Tailwind CSS, JavaScript) e um backend (Node.js com Express e SQLite) para persistência de dados.
🏗️ Estrutura do Projeto



🛠️ Tecnologias Utilizadas

    Frontend:
        HTML5: Estrutura da página.
        Tailwind CSS: Framework CSS para estilização rápida e responsiva.
        JavaScript (Vanilla JS): Lógica da aplicação, cálculo do orçamento, interação com a API.
    Backend:
        Node.js: Ambiente de tempo de execução JavaScript.
        Express.js: Framework web para construir a API RESTful.
        SQLite3: Banco de dados SQL leve e sem servidor para persistência dos orçamentos.
        dotenv: Para gerenciar variáveis de ambiente.
        cors: Para habilitar a comunicação entre frontend e backend.

✨ Funcionalidades

    Interface Intuitiva: Formulário fácil de usar para inserir informações do cliente e detalhes do apartamento.
    Seleção de Itens de Reforma: Opções para incluir/excluir e configurar detalhes de:
        Banheiro (nível de acabamento, área)
        Rodapé (nível de acabamento, comprimento, altura)
        Pintura (nível de acabamento, área, tipo: paredes, teto ou ambos)
        Cozinha (nível de acabamento, área)
        Portas Internas (nível de acabamento, quantidade, tipo de fechadura)
        Piso SPC (nível de acabamento, área, padrão)
    Cálculo Automático: O orçamento total é atualizado em tempo real conforme o usuário interage com os campos.
    Estimativas Inteligentes: Preenchimento automático de campos como comprimento do rodapé, área de pintura e piso com base na área total do apartamento e número de cômodos.
    Resumo Detalhado: Uma seção de resumo exibe os dados do cliente e a discriminação dos custos por item.
    Impressão Otimizada: Funcionalidade de impressão que foca apenas no resumo do orçamento para gerar um documento limpo e profissional.
    Persistência de Dados:
        Salvar Orçamento: Envia os dados do orçamento para o backend, que os armazena em um banco de dados SQLite.
        Carregar Orçamento: Permite buscar e preencher o formulário com um orçamento salvo anteriormente através de seu ID.

🚀 Como Rodar o Projeto

Siga estas instruções para configurar e executar o projeto em sua máquina local.
Pré-requisitos

    Node.js (versão 14 ou superior recomendada)
    npm (gerenciador de pacotes do Node.js, geralmente vem com o Node.js)

1. Clonar o Repositório
Bash

git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

(Substitua seu-usuario/seu-repositorio pelo caminho real do seu repositório).
2. Instalar Dependências

No terminal, na pasta raiz do projeto, instale as dependências do Node.js:
Bash

npm install

3. Configurar Variáveis de Ambiente

Crie um arquivo chamado .env na raiz do projeto (na mesma pasta de package.json) e adicione a seguinte linha:
Snippet de código

PORT=3000

Esta linha define a porta em que o servidor Node.js será executado. Você pode alterá-la se a porta 3000 já estiver em uso.
4. Iniciar o Servidor Backend

Ainda no terminal, na pasta raiz do projeto, execute o servidor Node.js:
Bash

node server/app.js

Você deverá ver mensagens no terminal indicando que o servidor está rodando (ex: "Servidor Node.js rodando na porta 3000" e "Conectado ao banco de dados SQLite."). Um arquivo database.sqlite será criado automaticamente na raiz do projeto.
5. Acessar a Aplicação Frontend

Com o servidor Node.js em execução, abra seu navegador e acesse:

http://localhost:3000

💡 Como Usar

    Informações do Cliente e Apartamento: Preencha os detalhes do cliente e as medidas básicas do apartamento nas seções iniciais.
    Itens do Orçamento: Use os toggles (interruptores) ao lado de cada categoria (Banheiro, Rodapé, Pintura, etc.) para habilitar ou desabilitar o item.
    Configurar Detalhes: Ao habilitar um item, as opções de acabamento, área/quantidade e outros detalhes aparecerão. Preencha conforme a necessidade.
    Cálculo em Tempo Real: Observe que o "Resumo do Orçamento" será atualizado automaticamente à medida que você altera os valores e as opções.
    Salvar Orçamento: Clique em "Salvar Orçamento" para enviar os dados para o backend e armazená-los. Um ID será exibido para você.
    Carregar Orçamento: Clique em "Carregar Orçamento" e insira um ID de orçamento salvo para recarregar os dados no formulário.
    Imprimir: Clique em "Imprimir" para gerar uma versão imprimível do "Resumo do Orçamento" (apenas o resumo será visível na impressão).

🤝 Contribuições

Contribuições são bem-vindas! Se você tiver ideias para melhorias, novas funcionalidades ou encontrar bugs, sinta-se à vontade para abrir uma issue ou enviar um pull request.
📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
