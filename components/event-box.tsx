import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export const EventCard = ({ event }: { event: any }) => {
  return (
    <Pressable style={styles.card}>
      {/* Constraint the image to a fixed square 
         so it doesn't stretch if the description is long 
      */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: event.imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContent}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.icon}>🗓️</Text>
          <Text style={styles.infoText}>{event.dateLabel}</Text>
        </View>

        <Text numberOfLines={3} style={styles.description}>
          {event.description}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#484848', // Specific medium-grey from your screen
    borderRadius: 24,           // More aggressive rounding for the 'premium' look
    padding: 16,                // More padding inside the card
    flexDirection: 'row',
    alignItems: 'flex-start',   // Align items to the top
    marginBottom: 16,           // More space between cards
    minHeight: 140,             // Ensure the card has a substantial feel
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 110,                 // Larger, fixed width
    height: 110,                // Match height for a perfect square
    borderRadius: 18,
    backgroundColor: '#27272a',
  },
  textContent: {
    flex: 1,
    marginLeft: 16,             // Space between image and text
    paddingTop: 2,
  },
  title: {
    color: '#FDBB30',           // The Gold color
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoText: {
    color: '#FFFFFF',           // Bright white for high contrast
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: '#E4E4E7',           // Light grey text
    fontSize: 13,
    lineHeight: 18,             // Better readability
  },
});