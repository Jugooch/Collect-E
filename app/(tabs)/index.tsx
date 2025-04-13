import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AddBinderModal from '@/components/AddBinderModal';

interface Binder {
  id: number;
  title: string;
  description: string;
  cardCount: number;
  coverImage: string;
  lastUpdated: Date;
}

export default function CollectionScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [binders, setBinders] = useState<Binder[]>([
    {
      id: 1,
      title: 'Mythic Collection',
      description: 'Magic: The Gathering',
      cardCount: 142,
      coverImage: 'https://images.unsplash.com/photo-1529832393073-e362750f78b3?w=800&q=80',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      title: 'Gen 1 Favorites',
      description: 'Pokémon TCG',
      cardCount: 98,
      coverImage: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80',
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      title: 'Blue Eyes Collection',
      description: 'Yu-Gi-Oh!',
      cardCount: 76,
      coverImage: 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?w=800&q=80',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const handleAddBinder = (binder: { title: string; tcg: string }) => {
    const tcgMap: Record<string, string> = {
      mtg: 'Magic: The Gathering',
      pokemon: 'Pokémon TCG',
      yugioh: 'Yu-Gi-Oh!',
    };

    const imageMap: Record<string, string> = {
      mtg: 'https://images.unsplash.com/photo-1529832393073-e362750f78b3?w=800&q=80',
      pokemon: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80',
      yugioh: 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?w=800&q=80',
    };

    const newBinder: Binder = {
      id: Date.now(),
      title: binder.title,
      description: tcgMap[binder.tcg],
      cardCount: 0,
      coverImage: imageMap[binder.tcg],
      lastUpdated: new Date(),
    };

    setBinders((prev) => [...prev, newBinder]);
    setIsModalVisible(false);
  };

  const formatLastUpdated = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Binders</Text>
        <Pressable 
          style={styles.createButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Plus color="#fff" size={24} />
        </Pressable>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.binderGrid}
        showsVerticalScrollIndicator={false}
      >
        {binders.map((binder) => (
          <Pressable 
            key={binder.id} 
            style={styles.binderCard}
            onPress={() => router.push(`/binder/${binder.id}`)}
          >
            <Image
              source={{ uri: binder.coverImage }}
              style={styles.binderCover}
            />
            <View style={styles.binderOverlay}>
              <View style={styles.binderContent}>
                <Text style={styles.binderTitle}>{binder.title}</Text>
                <Text style={styles.binderDescription}>{binder.description}</Text>
                <View style={styles.binderStats}>
                  <Text style={styles.binderCardCount}>
                    {binder.cardCount} cards
                  </Text>
                  <View style={styles.binderDot} />
                  <Text style={styles.binderLastUpdated}>
                    Updated {formatLastUpdated(binder.lastUpdated)}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <AddBinderModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddBinder}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  binderGrid: {
    padding: 16,
    gap: 16,
  },
  binderCard: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  binderCover: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  binderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  binderContent: {
    padding: 16,
  },
  binderTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  binderDescription: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 16,
    marginBottom: 8,
  },
  binderStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  binderCardCount: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
  },
  binderDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    opacity: 0.6,
    marginHorizontal: 8,
  },
  binderLastUpdated: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
  },
});