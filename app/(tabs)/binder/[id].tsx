import { View, Text, StyleSheet, ScrollView, Pressable, Image, useWindowDimensions, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Plus, Pencil, Check } from 'lucide-react-native';
import { useMemo, useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Card, CardPosition } from '@/types/card';
import { useBinderDimensions, CONSTANTS } from '@/hooks/useBinderDimensions';
import CardDetail from '@/components/CardDetail';
import AddCardModal from '@/components/AddCardModal';

export default function BinderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [selectedCard, setSelectedCard] = useState<{
    card: typeof binder.cards[0];
    position: { x: number; y: number; width: number; height: number };
  } | null>(null);
  const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
  
  const binder = {
    id,
    title: 'Mythic Collection',
    description: 'Magic: The Gathering',
    cards: Array(4).fill(null).map((_, i) => ({
      id: `card-${i}`,
      name: 'Black Lotus',
      imageUrl: 'https://images.unsplash.com/photo-1529832393073-e362750f78b3?w=800&q=80'
    })),
  };

  const dimensions = useBinderDimensions(windowWidth, windowHeight);

  const pages = useMemo(() => {
    const totalSlots = totalPages * CONSTANTS.CARDS_PER_PAGE;
    return Array(totalPages).fill(null).map((_, pageIndex) => 
      Array(CONSTANTS.CARDS_PER_PAGE).fill(null).map((_, slotIndex) => {
        const cardIndex = (pageIndex * CONSTANTS.CARDS_PER_PAGE) + slotIndex;
        return binder.cards[cardIndex] || null;
      })
    );
  }, [binder.cards, totalPages]);

  const handleCardPress = useCallback((card: Card, event: any, index: number) => {
    if (isEditing) {
      setSelectedSlotIndex(index);
      setIsAddCardModalVisible(true);
    } else {
      if (!card || !event) return;

      let position;

      if (event.nativeEvent?.layout) {
        position = {
          x: event.nativeEvent.pageX || event.nativeEvent.x || 0,
          y: event.nativeEvent.pageY || event.nativeEvent.y || 0,
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        };
      } else {
        const row = Math.floor((index % CONSTANTS.CARDS_PER_PAGE) / CONSTANTS.GRID_SIZE);
        const col = index % CONSTANTS.GRID_SIZE;
        
        const x = col * (dimensions.sleeveWidth + CONSTANTS.SPACING) + CONSTANTS.SPACING + ((dimensions.sleeveWidth - dimensions.cardWidth) / 2);
        const y = row * (dimensions.sleeveHeight + CONSTANTS.SPACING) + CONSTANTS.SPACING + CONSTANTS.HEADER_HEIGHT + ((dimensions.sleeveHeight - dimensions.cardHeight) / 2);

        position = {
          x,
          y,
          width: dimensions.cardWidth,
          height: dimensions.cardHeight,
        };
      }
      
      setSelectedCard({
        card,
        position,
      });
    }
  }, [dimensions, isEditing]);

  const handleEmptySlotPress = (index: number) => {
    if (!isEditing) return;
    
    if (selectedForSwap !== null) {
      console.log('Moving card from index', selectedForSwap, 'to empty slot', index);
      setSelectedForSwap(null);
    } else {
      setSelectedSlotIndex(index);
      setIsAddCardModalVisible(true);
    }
  };

  const handleAddCard = (card: { name: string; imageUrl: string }) => {
    console.log('Adding card:', card, 'to slot:', selectedSlotIndex);
  };

  const handleAddPage = () => {
    setTotalPages(prev => prev + 1);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSelectedForSwap(null);
  };

  const renderCard = (card: typeof binder.cards[0] | null, index: number) => {
    const cardOffset = {
      x: (dimensions.sleeveWidth - dimensions.cardWidth) / 2,
      y: (dimensions.sleeveHeight - dimensions.cardHeight) / 2,
    };

    const isSelected = selectedForSwap === index;

    return (
      <View 
        key={index}
        style={[
          styles.sleeveWrapper,
          {
            width: dimensions.sleeveWidth,
            height: dimensions.sleeveHeight,
          }
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sleeveBackground}
          pointerEvents="none"
        />
        
        <View style={[
          styles.cardContainer,
          {
            width: dimensions.cardWidth,
            height: dimensions.cardHeight,
            top: cardOffset.y,
            left: cardOffset.x,
          }
        ]}>
          {card ? (
            <Pressable 
              style={[
                styles.card,
                isSelected && styles.selectedCard
              ]}
              onPress={(event) => handleCardPress(card, event, index)}
            >
              <Image 
                source={{ uri: card.imageUrl }}
                style={styles.cardImage}
              />
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardOverlay}
                pointerEvents="none"
              />
              {isEditing && (
                <View style={styles.editOverlay}>
                  <Pencil color="#fff" size={24} />
                </View>
              )}
              {isSelected && (
                <View style={styles.selectedOverlay}>
                  <View style={styles.selectedIndicator} />
                </View>
              )}
            </Pressable>
          ) : (
            <Pressable 
              style={[
                styles.emptySlot,
                isEditing && styles.emptySlotEditing
              ]}
              onPress={() => handleEmptySlotPress(index)}
            >
              {isEditing && <Plus color="#666" size={24} />}
            </Pressable>
          )}
        </View>

        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.sleeveOverlay}
          pointerEvents="none"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>{binder.title}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{binder.description}</Text>
        </View>
        <Pressable 
          style={[
            styles.editButton,
            isEditing && styles.editButtonActive
          ]} 
          onPress={toggleEditMode}
        >
          {isEditing ? (
            <Check color="#fff" size={24} />
          ) : (
            <Pencil color="#fff" size={24} />
          )}
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={dimensions.pageWidth}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {pages.map((pageCards, pageIndex) => (
          <View 
            key={pageIndex}
            style={[
              styles.page,
              { 
                width: dimensions.pageWidth,
                maxHeight: dimensions.availableHeight,
              }
            ]}
          >
            <View style={[
              styles.pageContent,
              { 
                padding: dimensions.contentPadding,
              }
            ]}>
              <View style={[
                styles.gridContainer,
                { 
                  gap: dimensions.contentPadding,
                  height: dimensions.gridHeight,
                }
              ]}>
                {pageCards.map((card, index) => renderCard(card, (pageIndex * CONSTANTS.CARDS_PER_PAGE) + index))}
              </View>
              <View style={styles.pageFooter}>
                <Text style={styles.pageNumber}>
                  Page {pageIndex + 1} of {pages.length}
                </Text>
                {pageIndex === pages.length - 1 && isEditing && (
                  <Pressable 
                    style={styles.addPageButton}
                    onPress={handleAddPage}
                  >
                    <Plus color="#fff" size={16} />
                    <Text style={styles.addPageText}>Add Page</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedCard && !isEditing && (
        <CardDetail
          card={selectedCard.card}
          cardPosition={selectedCard.position}
          onClose={() => setSelectedCard(null)}
        />
      )}

      <AddCardModal
        visible={isAddCardModalVisible}
        onClose={() => {
          setIsAddCardModalVisible(false);
          setSelectedSlotIndex(null);
        }}
        onAdd={handleAddCard}
        mode={selectedSlotIndex !== null && binder.cards[selectedSlotIndex] ? 'swap' : 'add'}
        existingCard={selectedSlotIndex !== null ? binder.cards[selectedSlotIndex] : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: CONSTANTS.HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  editButtonActive: {
    backgroundColor: '#4CAF50',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  page: {
    padding: CONSTANTS.SPACING,
  },
  pageContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sleeveWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sleeveBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  sleeveOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  cardContainer: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 2,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotEditing: {
    borderColor: '#666',
    backgroundColor: '#2a2a2a',
  },
  pageFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: CONSTANTS.SPACING,
    height: CONSTANTS.PAGE_NUMBER_HEIGHT,
  },
  pageNumber: {
    color: '#666',
    fontSize: 14,
  },
  addPageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addPageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});