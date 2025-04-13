import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { X } from 'lucide-react-native';

const TCG_OPTIONS = [
  {
    id: 'mtg',
    name: 'Magic: The Gathering',
    image: 'https://images.unsplash.com/photo-1593035013811-2db9b3d0c06b?w=800&q=80',
    color: '#BE3B45',
  },
  {
    id: 'pokemon',
    name: 'Pokémon TCG',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80',
    color: '#FFCB05',
  },
  {
    id: 'yugioh',
    name: 'Yu-Gi-Oh!',
    image: 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?w=800&q=80',
    color: '#7E57C2',
  },
];

interface AddBinderModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (binder: { title: string; tcg: string }) => void;
}

export default function AddBinderModal({ visible, onClose, onAdd }: AddBinderModalProps) {
  const [title, setTitle] = useState('');
  const [selectedTcg, setSelectedTcg] = useState<string | null>(null);

  const handleAdd = () => {
    if (title && selectedTcg) {
      onAdd({ title, tcg: selectedTcg });
      setTitle('');
      setSelectedTcg(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Binder</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X color="#fff" size={24} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Binder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter binder name..."
              placeholderTextColor="#666"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Select TCG</Text>
            <View style={styles.tcgGrid}>
              {TCG_OPTIONS.map((tcg) => (
                <Pressable
                  key={tcg.id}
                  style={[
                    styles.tcgOption,
                    selectedTcg === tcg.id && styles.tcgOptionSelected,
                  ]}
                  onPress={() => setSelectedTcg(tcg.id)}
                >
                  <Image source={{ uri: tcg.image }} style={styles.tcgImage} />
                  <View
                    style={[
                      styles.tcgOverlay,
                      selectedTcg === tcg.id && { backgroundColor: `${tcg.color}99` },
                    ]}
                  />
                  <Text style={styles.tcgName}>{tcg.name}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Pressable
            style={[styles.addButton, (!title || !selectedTcg) && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!title || !selectedTcg}
          >
            <Text style={styles.addButtonText}>Create Binder</Text>
          </Pressable>
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
    minHeight: '70%',
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
  modalBody: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 24,
  },
  tcgGrid: {
    gap: 16,
  },
  tcgOption: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tcgOptionSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  tcgImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tcgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  tcgName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});