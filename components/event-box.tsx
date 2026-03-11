import React, { useState } from 'react';
import { Image, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EventCard = ({ event }: { event: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    // This creates the "morph" effect without Moti or Framer
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.card, isOpen && styles.cardExpanded]}>
      <Pressable onPress={toggleOpen}>
        <View style={isOpen ? styles.colLayout : styles.rowLayout}>
          <Image 
            source={{ uri: event.imageUrl }} 
            style={isOpen ? styles.imageExpanded : styles.imageCollapsed} 
          />
          <View style={styles.textContent}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.date}>{event.dateLabel}</Text>
            
            {!isOpen && (
              <Text numberOfLines={2} style={styles.snippet}>{event.description}</Text>
            )}
          </View>
        </View>
      </Pressable>

      {isOpen && (
        <ScrollView style={styles.body}>
          <Text style={styles.subTitle}>{event.subTitle}</Text>
          <Text style={styles.details}>{event.fullDetails}</Text>
          
          <View style={styles.priceContainer}>
             {event.pricing.map((p: any, i: number) => (
               <View key={i} style={styles.priceRow}>
                 <Text style={styles.priceLabel}>{p.label}: </Text>
                 <Text style={styles.priceValue}>{p.value}</Text>
               </View>
             ))}
          </View>

          <Pressable style={styles.button} onPress={toggleOpen}>
            <Text style={styles.buttonText}>CLOSE</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#2a2a2a', borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  cardExpanded: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, height: '100%' },
  rowLayout: { flexDirection: 'row', padding: 12, gap: 12 },
  colLayout: { flexDirection: 'column' },
  imageCollapsed: { width: 80, height: 80, borderRadius: 10 },
  imageExpanded: { width: '100%', height: 250 },
  textContent: { flex: 1, justifyContent: 'center' },
  title: { color: '#f59e0b', fontWeight: 'bold', fontSize: 18 },
  date: { color: '#aaa', fontSize: 14, marginTop: 2 },
  snippet: { color: '#777', fontSize: 12, marginTop: 4 },
  body: { padding: 20 },
  subTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  details: { color: '#ccc', lineHeight: 20 },
  priceContainer: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#444', pt: 15 },
  priceRow: { flexDirection: 'row', marginBottom: 5 },
  priceLabel: { color: '#888' },
  priceValue: { color: '#f59e0b', fontWeight: 'bold' },
  button: { backgroundColor: '#f59e0b', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { fontWeight: 'bold', color: '#000' }
});

export default EventCard;