/**
 * Classe que representa um Pokémon
 */
export class Pokemon {
  /**
   * Cria uma instância de Pokémon
   * @param {Object} data - Dados do Pokémon
   * @param {number} data.id - ID do Pokémon
   * @param {string} data.name - Nome do Pokémon
   * @param {string} data.image - URL da imagem do Pokémon
   * @param {Array<string>} data.types - Tipos do Pokémon
   * @param {number} data.height - Altura do Pokémon em metros
   * @param {number} data.weight - Peso do Pokémon em kg
   * @param {Array<string>} data.abilities - Habilidades do Pokémon
   * @param {Object} data.stats - Estatísticas do Pokémon
   * @param {Object} data.sprites - Sprites do Pokémon
   * @param {string} data.description - Descrição do Pokémon
   * @param {Array} data.evolutionChain - Cadeia de evolução do Pokémon
   * @param {Array} data.genera - Gêneros do Pokémon
   * @param {boolean} data.isBaby - Se o Pokémon é um bebê
   * @param {boolean} data.isLegendary - Se o Pokémon é lendário
   * @param {boolean} data.isMythical - Se o Pokémon é mítico
   * @param {string} data.habitat - Habitat do Pokémon
   * @param {string} data.generation - Geração do Pokémon
   * @param {Object} data.animated - Sprites animados do Pokémon
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.types = data.types;
    this.height = data.height;
    this.weight = data.weight;
    this.abilities = data.abilities;
    this.stats = data.stats;
    this.sprites = data.sprites;
    this.animated = data.animated;
    this.description = data.description;
    this.evolutionChain = data.evolutionChain;
    this.genera = data.genera;
    this.isBaby = data.isBaby;
    this.isLegendary = data.isLegendary;
    this.isMythical = data.isMythical;
    this.habitat = data.habitat;
    this.generation = data.generation;
  }

  /**
   * Cria uma instância de Pokémon a partir dos dados da API
   * @param {Object} apiData - Dados brutos da API
   * @param {Object} extraData - Dados extras não presentes na API básica
   * @returns {Pokemon} - Instância de Pokémon
   */
  static fromApiData(apiData, extraData = {}) {
    // Extrair sprites animados da geração 5 (Black/White)
    const animatedSprites = apiData.sprites?.versions?.['generation-v']?.['black-white']?.animated || {};
    
    return new Pokemon({
      id: apiData.id,
      name: apiData.name,
      image: apiData.sprites.front_default,
      types: apiData.types.map(type => type.type.name),
      height: apiData.height / 10, // Convertendo para metros
      weight: apiData.weight / 10, // Convertendo para kg
      abilities: apiData.abilities.map(ability => ability.ability.name),
      stats: this.transformStats(apiData.stats),
      sprites: apiData.sprites,
      animated: animatedSprites,
      description: extraData.description || '',
      evolutionChain: extraData.evolutionChain || [],
      genera: extraData.genera || [],
      isBaby: extraData.isBaby || false,
      isLegendary: extraData.isLegendary || false,
      isMythical: extraData.isMythical || false,
      habitat: extraData.habitat || '',
      generation: extraData.generation || '',
    });
  }

  /**
   * Transforma as estatísticas da API em um objeto mais amigável
   * @param {Array} stats - Estatísticas da API
   * @returns {Object} - Objeto com as estatísticas formatadas
   */
  static transformStats(stats) {
    const statsObj = {};
    
    stats.forEach(stat => {
      // Convertendo nomes como 'special-attack' para 'specialAttack'
      const statName = stat.stat.name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      statsObj[statName] = stat.base_stat;
    });
    
    return statsObj;
  }

  /**
   * Converte a instância para um objeto simples
   * @returns {Object} - Objeto simples representando o Pokémon
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      types: this.types,
      height: this.height,
      weight: this.weight,
      abilities: this.abilities,
      stats: this.stats,
      sprites: this.sprites,
      animated: this.animated,
      description: this.description,
      evolutionChain: this.evolutionChain,
      genera: this.genera,
      isBaby: this.isBaby,
      isLegendary: this.isLegendary,
      isMythical: this.isMythical,
      habitat: this.habitat,
      generation: this.generation,
    };
  }
} 