import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Appbar, Card, Button, Title, Paragraph, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SavedJobsScreen = ({ navigation }) => {
  // In the full version, this would come from state/storage
  const savedJobs = [];

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Saved Jobs Yet</Text>
      <Text style={styles.emptyText}>
        When you find jobs you're interested in, tap the heart icon to save them for later.
      </Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Swipe')}
        style={styles.browseButton}
      >
        Browse Jobs
      </Button>
    </View>
  );

  const renderJobItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.company}</Paragraph>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          {item.salary && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
              <Text style={styles.detailText}>{item.salary}</Text>
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => {}}>View</Button>
        <Button 
          icon="heart" 
          color="#FF5C5C" 
          onPress={() => {}}
        >
          Unsave
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saved Jobs" />
      </Appbar.Header>

      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          renderItem={renderJobItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 4,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
  },
  browseButton: {
    paddingHorizontal: 20,
    backgroundColor: '#6200ee',
  },
});

export default SavedJobsScreen; 