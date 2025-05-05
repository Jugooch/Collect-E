const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const API_URL = 'https://api.pokemontcg.io/v2/cards';
const API_KEY = process.env.POKEMON_TCG_API_KEY!; // optional, allows higher rate limit

async function runSync() {
  let page = 1;
  let hasMore = true;
  const pageSize = 250;

  while (hasMore) {
    const res = await axios.get(API_URL, {
      params: { page, pageSize },
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    const cards = res.data.data;

    for (const card of cards) {
      const {
        id, name, supertype, subtypes, level, hp, types, evolvesFrom,
        rules, abilities, attacks, weaknesses, resistances,
        retreatCost, convertedRetreatCost,
        set, rarity, artist, images, tcgplayer
      } = card;

      const { error } = await supabase.from('pokemon_cards').upsert({
        id,
        name,
        supertype,
        subtypes,
        level,
        hp,
        types,
        evolves_from: evolvesFrom,
        rules,
        abilities,
        attacks,
        weaknesses,
        resistances,
        retreat_cost: retreatCost?.length ?? 0,
        converted_retreat_cost: convertedRetreatCost,
        set_name: set?.name,
        set_series: set?.series,
        set_code: set?.id,
        set_release_date: set?.releaseDate,
        rarity,
        artist,
        image_small: images?.small,
        image_large: images?.large,
        prices: tcgplayer?.prices,
        last_updated: new Date().toISOString()
      });

      if (error) {
        console.warn(`❌ Error upserting ${card.name}:`, error);
      }
    }

    hasMore = cards.length === pageSize;
    page++;
  }

  console.log('✅ Finished syncing Pokémon cards');
}

runSync();
