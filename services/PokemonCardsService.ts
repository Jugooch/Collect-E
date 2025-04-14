import { supabase } from '../lib/supabase';
import axios from 'axios';

const POKEMON_API = 'https://api.pokemontcg.io/v2/cards';
const API_KEY = process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY;

export default class PokemonCardsService {
  /** === Local DB Access === */
  static async getCardById(id: string) {
    const { data, error } = await supabase
      .from('pokemon_cards')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async searchLocalByName(name: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('pokemon_cards')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(20);
    if (error) throw error;
    return data;
  }

  /** === Remote API Lookup === */
  static async fetchCardById(id: string) {
    const res = await axios.get(`${POKEMON_API}/${id}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
    const card = res.data.data;
    await this.saveCardToSupabase(card);
    return card;
  }

  /** === Save to Supabase === */
  static async saveCardToSupabase(card: any) {
    const {
      id, name, supertype, subtypes, level, hp, types, evolvesFrom,
      rules, abilities, attacks, weaknesses, resistances,
      retreatCost, convertedRetreatCost,
      set, rarity, artist, images, tcgplayer
    } = card;

    const { error } = await supabase
      .from('pokemon_cards')
      .upsert({
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

    if (error) throw error;
  }

  /** === Bulk Sync === */
  static async bulkSync() {
    let page = 1;
    let hasMore = true;
    const pageSize = 250;

    while (hasMore) {
      const res = await axios.get(POKEMON_API, {
        params: { page, pageSize },
        headers: { 'X-Api-Key': API_KEY }
      });

      const cards = res.data.data;
      for (const card of cards) {
        await this.saveCardToSupabase(card);
      }

      hasMore = cards.length === pageSize;
      page++;
    }
  }

  /** === For Binder Loading === */
  static async preloadCardsForBinder(cardIds: string[]) {
    const { data, error } = await supabase
      .from('pokemon_cards')
      .select('*')
      .in('id', cardIds);
    if (error) throw error;
    return data;
  }
}
