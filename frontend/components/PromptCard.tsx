import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { Prompt } from '../lib/api';

type PromptCardProps = {
  prompt: Prompt;
  onPress: () => void;
};

export default function PromptCard({ prompt, onPress }: PromptCardProps) {
  const imageUrl = prompt.cover_image_url || 'https://placehold.co/700x400/2f2f2f/555555?text=No+Image';

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* THE FIX: Replaced Card.Cover with a custom layered Image component */}
      <View style={styles.imageContainer}>
        {/* Layer 1: The blurred background image that covers the area */}
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.imageBackground}
          resizeMode="cover"
          blurRadius={15}
        >
          {/* Layer 2: The sharp, fully visible image on top */}
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>

      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
          {prompt.translation.title}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle} numberOfLines={2}>
          {prompt.translation.subtitle || 'No subtitle provided.'}
        </Text>
        <View style={styles.chipContainer}>
          <Chip icon="brain" mode="outlined" style={styles.chip}>
            {prompt.model}
          </Chip>
          <Chip icon="creation" mode="outlined" style={styles.chip}>
            {prompt.difficulty}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#1e1e1e',
    overflow: 'hidden', // Important for the image container's border radius
  },
  // NEW STYLES for the professional image display
  imageContainer: {
    height: 180, // Give the image container a fixed height
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingTop: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#ccc',
    minHeight: 40,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

