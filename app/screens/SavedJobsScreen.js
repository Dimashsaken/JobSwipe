import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Appbar, Card, Button, Title, Paragraph, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiService } from '../utils/apiService';

const SavedJobsScreen = ({ navigation }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Fetch saved jobs when component mounts
  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsUsingBackup(false);
      
      const data = await apiService.getSavedJobs();
      setSavedJobs(data);
      
      // Check if we're using backup data by trying to make a simple API request
      try {
        await fetch(`http://localhost:3000/api/health-check`, { 
          method: 'GET',
          timeout: 2000 
        });
      } catch (e) {
        // If fetch fails, we're using backup data
        setIsUsingBackup(true);
        setSnackbarVisible(true);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError('Failed to load saved jobs. Using backup data.');
      setIsUsingBackup(true);
      if (savedJobs.length === 0) {
        setSnackbarVisible(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedJobs();
  };

  const handleViewJob = (job) => {
    navigation.navigate('JobDetail', { job });
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await apiService.unsaveJob(jobId);
      // Remove job from local state
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error removing saved job:', err);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      await apiService.applyForJob(jobId);
      // Show some feedback or navigate to applications
      navigation.navigate('Applications');
    } catch (err) {
      console.error('Error applying for job:', err);
    }
  };

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
        <Button onPress={() => handleViewJob(item)}>View</Button>
        <Button 
          icon="briefcase" 
          mode="outlined" 
          onPress={() => handleApplyJob(item.id)}
        >
          Apply
        </Button>
        <Button 
          icon="heart" 
          color="#FF5C5C" 
          onPress={() => handleUnsaveJob(item.id)}
        >
          Unsave
        </Button>
      </Card.Actions>
    </Card>
  );

  const onDismissSnackbar = () => setSnackbarVisible(false);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Saved Jobs" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading saved jobs...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saved Jobs" />
        {isUsingBackup && (
          <Appbar.Action 
            icon="database" 
            color="#FF9800"
            onPress={() => setSnackbarVisible(true)}
          />
        )}
      </Appbar.Header>

      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          renderItem={renderJobItem}
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
            onPress={fetchSavedJobs}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : (
        renderEmptyState()
      )}
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={5000}
        action={{
          label: 'Close',
          onPress: onDismissSnackbar,
        }}
      >
        Using demo data - API server not connected
      </Snackbar>
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

export default SavedJobsScreen; 