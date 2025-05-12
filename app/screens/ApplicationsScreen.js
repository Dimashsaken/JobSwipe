import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Appbar, Card, Button, Chip, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ApplicationsScreen = ({ navigation }) => {
  // In the full version, this would come from state/storage
  const applications = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': 
        return '#3498db';
      case 'Under Review': 
        return '#f39c12';
      case 'Interview Scheduled': 
        return '#9b59b6';
      case 'Offer': 
        return '#2ecc71';
      case 'Rejected': 
        return '#e74c3c';
      default: 
        return '#95a5a6';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="file-document-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Applications Yet</Text>
      <Text style={styles.emptyText}>
        When you apply for jobs, they'll appear here so you can track your progress.
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

  const renderApplicationItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.companyName}>{item.company}</Text>
          </View>
          <Chip 
            mode="outlined" 
            style={{ 
              backgroundColor: getStatusColor(item.status) + '20',
              borderColor: getStatusColor(item.status),
            }}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
        </View>

        <Divider style={styles.divider} />
        
        <List.Item
          title="Date Applied"
          description={item.appliedDate}
          left={props => <List.Icon {...props} icon="calendar" />}
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
        />
        
        <List.Item
          title="Last Updated"
          description={item.lastUpdated}
          left={props => <List.Icon {...props} icon="update" />}
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
        />
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => {}}>View Job</Button>
        <Button 
          mode="outlined"
          onPress={() => {}}
        >
          Update Status
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Applications" />
      </Appbar.Header>

      {applications.length > 0 ? (
        <FlatList
          data={applications}
          renderItem={renderApplicationItem}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyName: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
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

export default ApplicationsScreen; 