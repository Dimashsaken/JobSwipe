import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Appbar, Card, Button, Chip, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiService } from '../utils/apiService';

const ApplicationsScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch applications when component mounts
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
  };

  const handleViewJob = (jobId) => {
    // Navigate to job details with the job ID
    navigation.navigate('JobDetail', { jobId });
  };

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
        <Button onPress={() => handleViewJob(item.jobId)}>View Job</Button>
      </Card.Actions>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="My Applications" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      </View>
    );
  }

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6200ee"]}
            />
          }
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={fetchApplications}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
  },
});

export default ApplicationsScreen; 