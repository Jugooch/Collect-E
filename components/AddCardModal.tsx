import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, Search, ChevronRight } from 'lucide-react-native';
import { useDebounce } from 'use-debounce';
import { Card } from '@/types/card';

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (card: Card) => void;
  mode?: 'add' | 'swap';
  existingCard?: Card;
}

/**
 * Modal component for adding or swapping cards in a binder
 * Provides card search functionality and selection interface
 */
export default function AddCardModal({ 
  visible, 
  onClose, 
  onAdd, 
  mode = 'add',
  existingCard
}: AddCardModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal visibility changes
  React.useEffect(() => {
    if (visible && existingCard) {
      setSelectedCard(existingCard);
    } else if (!visible) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedCard(null);
      setError(null);
    }
  }, [visible, existingCard]);

  // Handle card search with debounced query
  const searchCards = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // const cards = await CardApiService.searchCards(query);
      // setSearchResults(cards);
    } catch (error) {
      setError('Failed to search cards. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (debouncedQuery) {
      searchCards(debouncedQuery);
    }
  }, [debouncedQuery, searchCards]);

  const handleAdd = () => {
    if (selectedCard) {
      onAdd(selectedCard);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedCard(null);
      onClose();
    }
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCancel = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCard(existingCard || null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Add Card' : 'Swap Card'}
            </Text>
            <Pressable style={styles.closeButton} onPress={handleCancel}>
              <X color="#fff" size={24} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <Search color="#666" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a card..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : selectedCard ? (
            <View style={styles.selectedCardContainer}>
              <Image
                source={{ uri: selectedCard.imageUrl }}
                style={styles.selectedCardImage}
              />
              <View style={styles.selectedCardInfo}>
                <Text style={styles.selectedCardName}>{selectedCard.name}</Text>
                <Text style={styles.selectedCardSet}>
                  {selectedCard.set} #{selectedCard.number}
                </Text>
              </View>
            </View>
          ) : (
            <ScrollView style={styles.searchResults}>
              {searchResults.map((card) => (
                <Pressable
                  key={card.id}
                  style={styles.searchResultItem}
                  onPress={() => handleCardSelect(card)}
                >
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.resultCardImage}
                  />
                  <View style={styles.resultCardInfo}>
                    <Text style={styles.resultCardName}>{card.name}</Text>
                    <Text style={styles.resultCardSet}>
                      {card.set} #{card.number}
                    </Text>
                  </View>
                  <ChevronRight color="#666" size={20} />
                </Pressable>
              ))}
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            {mode === 'swap' && (
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            )}
            <Pressable
              style={[
                styles.button,
                styles.addButton,
                !selectedCard && styles.addButtonDisabled,
                mode === 'swap' && styles.swapButton
              ]}
              onPress={handleAdd}
              disabled={!selectedCard}
            >
              <Text style={styles.addButtonText}>
                {mode === 'add' ? 'Add to Binder' : 'Swap Card'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  resultCardImage: {
    width: 40,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
  },
  resultCardInfo: {
    flex: 1,
  },
  resultCardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultCardSet: {
    color: '#666',
    fontSize: 14,
  },
  selectedCardContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  selectedCardImage: {
    width: 240,
    height: 336,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedCardInfo: {
    alignItems: 'center',
  },
  selectedCardName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedCardSet: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#fff',
  },
  swapButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});