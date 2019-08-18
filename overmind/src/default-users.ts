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
const POKEMON = {
  ...USER(317728807286, "Bulbasaur", "users/pokemon/001.png"),
  ...USER(315967265052, "Charmander", "users/pokemon/004.png"),
  ...USER(1069549541688, "Squirtle ", "users/pokemon/007.png"),
  ...USER(382975531445, "Caterpie", "users/pokemon/010.png"),
  ...USER(797104331241, "Pidgey", "users/pokemon/016.png"),
  ...USER(590224415009, "Pikachu", "users/pokemon/025.png"),
  ...USER(1072670104062, "Vulpix", "users/pokemon/037.png"),
  ...USER(864146151740, "Meowth", "users/pokemon/052.png"),
  ...USER(726807861590, "Growlithe", "users/pokemon/058.png"),
  ...USER(452500380148, "Haunter", "users/pokemon/093.png"),
  ...USER(1071713278385, "Magikarp", "users/pokemon/129.png"),
  ...USER(1001064421682, "Eevee", "users/pokemon/133.png"),
  ...USER(591448234474, "Mew", "users/pokemon/151.png")
};
const USERS = POKEMON;

export default USERS;
