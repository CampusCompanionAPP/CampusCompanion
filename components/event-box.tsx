import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export const EventCard = ({ event }: { event: any }) => {
  return (
    <Pressable style={styles.card}>
      <Image 
        source={{ uri: event.imageUrl }} 
        style={styles.image} 
      />

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
    backgroundColor: '#3f3f46',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: '#27272a',
  },
  textContent: {
    flex: 1,
  },
  title: {
    color: '#f59e0b',
    fontSize: 17,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  icon: {
    fontSize: 14,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
    opacity: 0.9,
  },
});