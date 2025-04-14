import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use SERVICE_ROLE key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SCRYFALL_BULK_ENDPOINT = 'https://api.scryfall.com/bulk-data';

async function fetchBulkDataUrl() {
  const res = await axios.get(SCRYFALL_BULK_ENDPOINT);
  const defaultData = res.data.data.find((d: any) => d.type === 'default_cards');
  return defaultData.download_uri;
}

async function runSync() {
  try {
    const url = await fetchBulkDataUrl();
    const res = await axios.get(url);
    const cards = res.data;

    let inserted = 0;

    for (const card of cards) {
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
          layout,
          foil: !!foil,
          mana_cost,
          cmc,
          power,
          toughness,
          colors,
          image_uri: image_uris?.normal ?? null,
          prices,
          last_updated: new Date().toISOString()
        });

      if (!error) inserted++;
    }

    console.log(`✅ Synced ${inserted} cards to Supabase`);
  } catch (e) {
    console.error('❌ Sync failed:', e);
  }
}

runSync();
