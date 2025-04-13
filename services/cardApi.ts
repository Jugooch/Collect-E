import { Card } from '@/types/card';

/**
 * Service for handling card-related API calls
 */
export class CardApiService {
  private static BASE_URL = 'https://api.scryfall.com';

  /**
   * Search for cards using the Scryfall API
   * @param query - Search query string
   * @returns Promise containing array of cards matching the query
   */
  static async searchCards(query: string): Promise<Card[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/cards/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || 'Failed to search cards');
      }
      
      if (data.data) {
        return data.data.map(this.mapCardData);
      }
      
      return [];
    } catch (error) {
      console.error('Error searching cards:', error);
      throw error;
    }
  }

  /**
   * Maps raw card data from the API to our Card interface
   * @param cardData - Raw card data from the API
   * @returns Mapped Card object
   */
  private static mapCardData(cardData: any): Card {
    return {
      id: cardData.id,
      name: cardData.name,
      number: cardData.collector_number,
      set: cardData.set_name,
      imageUrl: cardData.image_uris?.normal || 
                cardData.image_uris?.large || 
                cardData.image_uris?.png,
    };
  }
}