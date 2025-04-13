import { useMemo } from 'react';
import { Platform } from 'react-native';
import { BinderDimensions } from '@/types/card';

// Constants for binder layout
const GRID_SIZE = 3;
const CARD_RATIO = 88 / 63; // Standard trading card ratio (2.5" x 3.5")
const SPACING = 16;
const HEADER_HEIGHT = 120;
const PAGE_NUMBER_HEIGHT = 40;
const SLEEVE_HEIGHT_RATIO = 1.4;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

/**
 * Custom hook to calculate and manage binder dimensions
 * @param windowWidth - Current window width
 * @param windowHeight - Current window height
 * @returns Calculated binder dimensions
 */
export function useBinderDimensions(
  windowWidth: number,
  windowHeight: number
): BinderDimensions {
  return useMemo(() => {
    const pageWidth = windowWidth;
    const availableHeight = windowHeight - HEADER_HEIGHT - TAB_BAR_HEIGHT;
    
    const gridWidth = pageWidth - (SPACING * 4);
    const sleeveWidth = (gridWidth - (SPACING * (GRID_SIZE - 1))) / GRID_SIZE;
    const sleeveHeight = sleeveWidth * SLEEVE_HEIGHT_RATIO;
    
    let cardWidth, cardHeight;
    
    if (CARD_RATIO > 1) {
      cardHeight = sleeveHeight * 0.9;
      cardWidth = cardHeight / CARD_RATIO;
    } else {
      cardWidth = sleeveWidth * 0.9;
      cardHeight = cardWidth * CARD_RATIO;
    }
    
    const gridHeight = Math.min(
      (sleeveHeight * GRID_SIZE) + (SPACING * (GRID_SIZE - 1)),
      availableHeight - PAGE_NUMBER_HEIGHT - (SPACING * 4)
    );
    
    return {
      pageWidth,
      sleeveWidth,
      sleeveHeight,
      cardWidth,
      cardHeight,
      gridHeight,
      contentPadding: SPACING,
      availableHeight,
    };
  }, [windowWidth, windowHeight]);
}

// Export constants for use in other components
export const CONSTANTS = {
  GRID_SIZE,
  CARD_RATIO,
  SPACING,
  HEADER_HEIGHT,
  PAGE_NUMBER_HEIGHT,
  SLEEVE_HEIGHT_RATIO,
  TAB_BAR_HEIGHT,
  CARDS_PER_PAGE: GRID_SIZE * GRID_SIZE,
};