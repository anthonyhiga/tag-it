/**
 *  We define in here users we want to use mapped to existing tokenId's
 *  This is the easier... check-in able list... which doesn't rely on
 *  the db... cause that is harder to maintain if someone erases it.
 */

let id = 1;

function USER(
  totemId: number,
  name: string,
  iconUrl: string,
  avatarUrl?: string
) {
  return {
    [totemId]: {
      id: id++,
      totemId,
      name,
      iconUrl,
      avatarUrl: avatarUrl || iconUrl
    }
  };
}

// SET: Pokemon
// "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
const POKEMON_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/"
const POKEMON = {
  ...USER(317728807286, "Bulbasaur", POKEMON_IMG + "001.png"),
  ...USER(315967265052, "Charmander", POKEMON_IMG + "004.png"),
  ...USER(1069549541688, "Squirtle ", POKEMON_IMG + "007.png"),
  ...USER(382975531445, "Caterpie", POKEMON_IMG + "010.png"),
  ...USER(797104331241, "Pidgey", POKEMON_IMG + "016.png"),
  ...USER(590224415009, "Pikachu", POKEMON_IMG + "025.png"),
  ...USER(1072670104062, "Vulpix", POKEMON_IMG + "037.png"),
  ...USER(864146151740, "Meowth", POKEMON_IMG + "052.png"),
  ...USER(726807861590, "Growlithe", POKEMON_IMG + "058.png"),
  ...USER(452500380148, "Haunter", POKEMON_IMG + "093.png"),
  ...USER(1071713278385, "Magikarp", POKEMON_IMG + "129.png"),
  ...USER(1001064421682, "Eevee", POKEMON_IMG + "133.png"),
  ...USER(591448234474, "Mew", POKEMON_IMG + "151.png")
};
const USERS = POKEMON;

export default USERS;
