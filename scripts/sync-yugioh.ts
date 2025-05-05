const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

async function runSync() {
  const { data } = await axios.get(API_URL);
  const cards = data.data;

  let count = 0;

  for (const card of cards) {
    const {
      id, name, type, frameType, desc,
      atk, def, level, race, attribute,
      archetype, scale, linkval, linkmarkers,
      card_sets, card_images, card_prices
    } = card;

    const { error } = await supabase.from('yugioh_cards').upsert({
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

    if (error) {
      console.warn(`❌ Error saving ${name}`, error);
    } else {
      count++;
    }
  }

  console.log(`✅ Synced ${count} Yu-Gi-Oh! cards`);
}

runSync();
