
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

// Define your memories here. I've added a 4th entry for your GIF.
const memoriesData = [
  {
    id: 1,
    image: require('./assets/memory1.jpeg'),
    caption: "That amazing! Best day ever.",
  },
  {
    id: 2,
    image: require('./assets/memory4.gif'),
    caption: "Couldn't stop laughing at this moment!",
  },
  {
    id: 3,
    image: require('./assets/memory5.gif'),
    caption: "coke moment.",
  },
  {
    id: 4,
    image: require('./assets/memory6.gif'),
    caption: "This moment was just pure fun!",
  },
];

// Function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

interface MemoryCardProps {
  image: any; // Replace 'any' with a more specific type if possible
  caption: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ image, caption }) => (
  <View style={styles.card}>
    <FastImage 
      style={styles.imageStyle} 
      source={image} 
      resizeMode={FastImage.resizeMode.cover}
    />
    <View style={styles.captionContainer}>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  </View>
);

interface MemoriesScreenProps {
  onContinue: () => void;
}

const MemoriesScreen: React.FC<MemoriesScreenProps> = ({ onContinue }) => {
  const [shuffledMemories, setShuffledMemories] = useState<typeof memoriesData>([]);

  useEffect(() => {
    // Shuffle the memories once when the component mounts
    setShuffledMemories(shuffleArray([...memoriesData]));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>A Few Memories...</Text>

        {memoriesData.map(memory => (
          <MemoryCard 
            key={memory.id}
            image={memory.image}
            caption={memory.caption}
          />
        ))}

        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>And for the grand finale...</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  scrollContainer: { alignItems: 'center', paddingVertical: 60 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#f0f0f0', marginBottom: 30 },
  card: { width: CARD_WIDTH, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, marginBottom: 30, overflow: 'hidden' },
  imageStyle: {
    height: 280,
    width: '100%',
  },
  captionContainer: { padding: 20 },
  caption: { fontSize: 18, color: '#f0f0f0', textAlign: 'center', lineHeight: 26 },
  button: { backgroundColor: '#e94560', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, marginTop: 20 },
  buttonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
});

export default MemoriesScreen;
