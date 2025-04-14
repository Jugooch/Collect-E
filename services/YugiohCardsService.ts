import { supabase } from '../lib/supabase';
import axios from 'axios';

const YUGIOH_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

export default class YugiohCardsService {
  /** === Local DB Access === */
  static async getCardById(id: number) {
    const { data, error } = await supabase
      .from('yugioh_cards')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async searchLocalByName(name: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('yugioh_cards')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(20);
    if (error) throw error;
    return data;
  }

  /** === Note: No API endpoint for single card fetch by ID === */
  static async fetchAndResyncAllCards() {
    const res = await axios.get(YUGIOH_API);
    const cards = res.data.data;

    for (const card of cards) {
      await this.saveCardToSupabase(card);
    }
  }

  /** === Save to Supabase === */
  static async saveCardToSupabase(card: any) {
    const {
      id, name, type, frameType, desc,
      atk, def, level, race, attribute,
      archetype, scale, linkval, linkmarkers,
      card_sets, card_images, card_prices
    } = card;

    const { error } = await supabase
      .from('yugioh_cards')
      .upsert({
        id,
        name,
        type,
        frame_type: frameType,
        desc,
        atk,
        def,
        level,
        race,
        attribute,
        archetype,
        scale,
        linkval,
        linkmarkers,
        card_sets,
        card_images,
        card_prices,
        last_updated: new Date().toISOString()
      });

    if (error) throw error;
  }

  /** === Bulk Sync (daily job) === */
  static async bulkSync() {
    return this.fetchAndResyncAllCards(); // alias for clarity
  }

  /** === For Binder Loading === */
  static async preloadCardsForBinder(cardIds: number[]) {
    const { data, error } = await supabase
      .from('yugioh_cards')
      .select('*')
      .in('id', cardIds);
    if (error) throw error;
    return data;
  }
}
