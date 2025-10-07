import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../lib/api';

const gradients = [
  ['#8A2BE2', '#4B0082'], // Purple
  ['#4158D0', '#C850C0'], // Blue to Pink
  ['#FF2525', '#FF7525'], // Red to Orange
  ['#00DBDE', '#FC00FF'], // Teal to Magenta
] as const;

type Props = {
  category: Category;
  onPress: () => void;
};

export default function CategoryCard({ category, onPress }: Props) {
  const gradientIndex = category.name.length % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    // THE FIX: The TouchableOpacity is now the main container, replacing the buggy Card.
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* The LinearGradient now fills the TouchableOpacity directly. */}
      <LinearGradient colors={gradient} style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.icon}>{category.icon}</Text>
          <Text style={styles.name}>{category.name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // This style now applies to the TouchableOpacity, making IT the card.
  container: {
    flex: 1,
    margin: 8,
    height: 120,
    borderRadius: 16,
    // Adding elevation for a card-like shadow effect
    elevation: 5,
    backgroundColor: '#000', // Fallback for shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    borderRadius: 16, // Match the container's border radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Added a content View for better internal alignment
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
    color: '#fff',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
});