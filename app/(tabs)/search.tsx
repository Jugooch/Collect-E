import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Search cards..."
            placeholderTextColor="#666"
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholder}>Search for cards across all TCGs</Text>
      </View>
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});