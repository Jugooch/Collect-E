import { supabase } from '../lib/supabase';
import axios from 'axios';

const SCRYFALL_BASE = 'https://api.scryfall.com';

export default class ScryfallService {
  /** === Local (Supabase) DB Access === */
  static async getCardById(id: string) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async searchLocalByName(name: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(20);

    if (error) throw error;
    return data;
  }

  /** === Remote API === */
  static async searchScryfall(name: string) {
    const res = await axios.get(`${SCRYFALL_BASE}/cards/search?q=${encodeURIComponent(name)}`);
    return res.data.data;
  }

  static async fetchCardById(id: string) {
    const res = await axios.get(`${SCRYFALL_BASE}/cards/${id}`);
    const card = res.data;
    await this.saveCardToSupabase(card);
    return card;
  }

  /** === Save to Supabase === */
  static async saveCardToSupabase(card: any) {
    const {
      id, name, set, collector_number, rarity,
      type_line, oracle_text, layout, foil,
      mana_cost, cmc, power, toughness, colors,
      image_uris, prices
    } = card;

    const { error } = await supabase
      .from('cards')
      .upsert({
        id,
        name,
        set,
        collector_number,
        rarity,
        type_line,
        oracle_text,
        image_uri: image_uris?.normal || null,
        foil: !!foil,
        layout,
        mana_cost,
        cmc,
        colors: colors || [],
        power,
        toughness,
        prices,
        last_updated: new Date().toISOString()
      });

    if (error) throw error;
  }

  /** === Bulk Sync === */
  static async bulkImportAllCards(limit?: number) {
    const res = await axios.get(`${SCRYFALL_BASE}/bulk-data`);
    const bulk = res.data.data.find((d: any) => d.type === 'default_cards');

    const jsonDump = await axios.get(bulk.download_uri);
    const cards = limit ? jsonDump.data.slice(0, limit) : jsonDump.data;

    for (const card of cards) {
      try {
        await this.saveCardToSupabase(card);
      } catch (err) {
        console.warn(`Failed to save ${card.name}`, err);
      }
    }
  }

  /** === Utility for Binder View === */
  static async preloadCardsForBinder(cardIds: string[]) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .in('id', cardIds);

    if (error) throw error;
    return data;
  }
}
