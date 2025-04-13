/**
 * Represents a trading card in the application
 */
export interface Card {
  /** Unique identifier for the card */
  id: string;
  /** Name of the card */
  name: string;
  /** Card number in the set (optional) */
  number?: string;
  /** Name of the set the card belongs to */
  set: string;
  /** URL to the card's image */
  imageUrl: string;
}

/**
 * Represents a card's position in the UI
 */
export interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents a binder's dimensions and layout calculations
 */
export interface BinderDimensions {
  pageWidth: number;
  sleeveWidth: number;
  sleeveHeight: number;
  cardWidth: number;
  cardHeight: number;
  gridHeight: number;
  contentPadding: number;
  availableHeight: number;
}