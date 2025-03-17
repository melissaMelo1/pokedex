# Pokedex - Projeto React

![Pokeball](src/pokebola.png)

## 📱 Aplicação Web de Pokedex

Aplicação web de Pokedex desenvolvida para etapa técnica de uma vaga de estagiário na Smart.

## 📋 Descrição

A Pokedex é uma aplicação web que permite aos usuários visualizar, buscar e filtrar Pokémon. Os dados são obtidos da [API pública do Pokémon (PokeAPI)](https://pokeapi.co/), apresentando informações detalhadas sobre cada Pokémon.

## ✨ Funcionalidades

- 🔍 *Listagem de Pokémon*: Visualização de múltiplos Pokémon em cards interativos
- 🔎 *Busca*: Pesquisa de Pokémon por nome ou ID
- 🏷 *Filtros*: Filtragem por tipos de Pokémon e ordenação
- 📊 *Detalhes*: Página com informações detalhadas sobre cada Pokémon, incluindo:
  - Estatísticas base (HP, Ataque, Defesa, etc.)
  - Cadeia de evolução
  - Sprites animados
  - Informações de habitat, geração, peso, altura
  - Status especiais (Lendário, Mítico, etc.)
- 🎮 *Responsividade*: Interface adaptável para diversos tamanhos de tela
- 💖 *Favoritos*: Possibilidade de marcar Pokémon como favoritos

## 🛠 Tecnologias Utilizadas

- *React*: Biblioteca para construção da interface
- *React Router*: Para navegação entre páginas
- *Material UI*: Framework de componentes para React
- *Context API*: Para gerenciamento de estado global
- *Axios*: Para requisições HTTP

## 📁 Estrutura do Projeto


src/

├── api/           # Configuração e funções de acesso à API

├── components/    # Componentes reutilizáveis 

├── config/        # Constantes e configurações 

├── context/       # Contextos para gerenciamento de estado

├── hooks/         # Hooks personalizados

├── models/        # Classes e interfaces

├── pages/         # Componentes de página

├── routes/        # Configuração de rotas

├── services/      # Serviços de integração

└── utils/         # Funções utilitárias


## 🚀 Como Executar

1. Clone o repositório:
bash
git clone https://github.com/melissaMelo1/pokedex.git
cd pokedex


2. Instale as dependências:
bash
npm install


3. Execute a aplicação:
bash
npm start


4. Acesse a aplicação em seu navegador:

http://localhost:3000


## 🧪 Executando Testes

bash
npm test


## 🌟 Recursos adicionais

- Design responsivo para visualização em dispositivos móveis e desktop
- Animações e transições para melhor experiência do usuário
- Carregamento de mais Pokémon sob demanda (infinite scroll)
- Visualização de sprites animados quando disponíveis
