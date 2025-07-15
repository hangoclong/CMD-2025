// components/IdeaCard.tsx
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Props for the component, allowing for customization.
interface IdeaCardProps {
  title: string;
  description: string;
  date: string;
  onDelete?: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ title, description, date, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {/* The delete button is only shown if an onDelete function is provided. */}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <FontAwesome name="trash" size={18} color="#ff4444" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 1, flexDirection: 'row', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  description: { fontSize: 14, color: '#666', marginBottom: 8 },
  date: { fontSize: 12, color: '#999' },
  deleteButton: { padding: 10, marginLeft: 10 },
});

export default IdeaCard;