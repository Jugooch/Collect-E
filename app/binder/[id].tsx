import { View, Text, StyleSheet, ScrollView, Pressable, Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';

const GRID_SIZE = 3;
const SPACING = 16;

interface Card {
  id: string;
  name: string;
  imageUrl: string;
}

export default function BinderDetailScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  
  // Return null if width is not available yet
  if (!width) {
    return null;
  }
  
  const CARD_SIZE = (width - (SPACING * (GRID_SIZE + 1))) / GRID_SIZE;
  
  // This would come from your state management solution
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

  const pages = Array(Math.ceil(18 / (GRID_SIZE * GRID_SIZE))).fill(null);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
        <View>
          <Text style={styles.title}>{binder.title}</Text>
          <Text style={styles.subtitle}>{binder.description}</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.pageScroller}
      >
        {pages.map((_, pageIndex) => (
          <View key={pageIndex} style={[styles.page, { width }]}>
            <View style={styles.pageContent}>
              <View style={styles.cardGrid}>
                {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, slotIndex) => {
                  const cardIndex = (pageIndex * GRID_SIZE * GRID_SIZE) + slotIndex;
                  const card = binder.cards[cardIndex];

                  return (
                    <View key={slotIndex} style={[styles.cardSlot, { width: CARD_SIZE, height: CARD_SIZE * 1.4 }]}>
                      {card ? (
                        <Pressable style={styles.card}>
                          <Image 
                            source={{ uri: card.imageUrl }} 
                            style={styles.cardImage}
                          />
                          <View style={styles.sleeve}>
                            <View style={[styles.sleeveShineLine, { transform: [
                              { rotate: '45deg' },
                              { translateX: -CARD_SIZE },
                              { translateY: CARD_SIZE * 0.5 },
                            ] }]} />
                            <View style={[styles.sleeveShineLine, styles.sleeveShineLine2, { transform: [
                              { rotate: '-45deg' },
                              { translateX: CARD_SIZE },
                              { translateY: -CARD_SIZE * 0.5 },
                            ] }]} />
                            <View style={styles.sleeveOverlay} />
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable style={styles.emptySlot}>
                          <Plus color="#666" size={32} />
                          <View style={styles.emptySleeveOverlay} />
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
            <Text style={styles.pageNumber}>Page {pageIndex + 1}</Text>
          </View>
        ))}
      </ScrollView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  pageScroller: {
    flex: 1,
  },
  page: {
    padding: SPACING,
  },
  pageContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: SPACING,
    marginBottom: 8,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING,
    justifyContent: 'center',
  },
  cardSlot: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sleeve: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  sleeveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sleeveShineLine: {
    position: 'absolute',
    width: '200%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  sleeveShineLine2: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptySlot: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emptySleeveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pageNumber: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});