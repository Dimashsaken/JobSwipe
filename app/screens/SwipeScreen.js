import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { Button, Appbar, Snackbar } from 'react-native-paper';
import SwipeCard from '../components/cards/SwipeCard';
import { apiService } from '../utils/apiService';
import Animated, { 
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';

const SwipeScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const swipeAnim = useSharedValue(0);

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsUsingBackup(false);
      
      const fetchedJobs = await apiService.getJobs();
      setJobs(fetchedJobs);
      setCurrentIndex(0);
      
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
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Using backup data.');
      setIsUsingBackup(true);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = (job) => {
    // Simply pass on this job
    swipeAnim.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      swipeAnim.value = 0;
    }, 300);
  };

  const handleSwipeRight = async (job) => {
    // Apply for this job using the API
    try {
      await apiService.applyForJob(job.id);
      swipeAnim.value = withTiming(1, { duration: 300 });
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        swipeAnim.value = 0;
      }, 300);
    } catch (err) {
      console.error('Error applying for job:', err);
      // Continue to next job even if application fails
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleCardPress = (job) => {
    // Navigate to job details screen
    navigation.navigate('JobDetail', { job });
  };

  const handleButtonSwipeLeft = () => {
    if (currentIndex < jobs.length) {
      handleSwipeLeft(jobs[currentIndex]);
    }
  };

  const handleButtonSwipeRight = () => {
    if (currentIndex < jobs.length) {
      handleSwipeRight(jobs[currentIndex]);
    }
  };

  const noMoreJobsAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      swipeAnim.value,
      [0, 1],
      [0, 1]
    );
    
    return {
      opacity: currentIndex >= jobs.length ? 1 : opacity
    };
  });

  const onDismissSnackbar = () => setSnackbarVisible(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="JobSwipe" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="JobSwipe" />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={fetchJobs}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="JobSwipe" />
        {isUsingBackup && (
          <Appbar.Action 
            icon="database" 
            color="#FF9800"
            onPress={() => setSnackbarVisible(true)}
          />
        )}
      </Appbar.Header>
      
      <View style={styles.cardContainer}>
        {/* End of jobs message */}
        <Animated.View style={[styles.endOfJobsContainer, noMoreJobsAnimStyle]}>
          <Text style={styles.endOfJobsText}>No more jobs to display!</Text>
          <Button 
            mode="contained" 
            style={styles.refreshButton}
            onPress={fetchJobs}
          >
            Refresh Jobs
          </Button>
        </Animated.View>

        {/* Job cards */}
        {jobs.map((job, index) => {
          if (index < currentIndex || index > currentIndex + 2) return null;

          return (
            <SwipeCard
              key={job.id}
              job={job}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onPress={handleCardPress}
              style={{
                zIndex: jobs.length - index,
                opacity: index === currentIndex ? 1 : 0.8,
                transform: [{ scale: index === currentIndex ? 1 : 0.95 }]
              }}
            />
          );
        })}
      </View>

      {/* Swipe buttons (alternative to gestures) */}
      <View style={styles.buttonContainer}>
        <Button
          icon="thumb-down"
          mode="outlined"
          onPress={handleButtonSwipeLeft}
          style={[styles.button, styles.rejectButton]}
          disabled={currentIndex >= jobs.length}
        >
          Skip
        </Button>
        <Button
          icon="briefcase"
          mode="contained"
          onPress={handleButtonSwipeRight}
          style={[styles.button, styles.applyButton]}
          disabled={currentIndex >= jobs.length}
        >
          Apply
        </Button>
      </View>
      
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    width: '45%',
  },
  rejectButton: {
    borderColor: '#FF5C5C',
  },
  applyButton: {
    backgroundColor: '#56CD56',
  },
  endOfJobsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endOfJobsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  refreshButton: {
    marginTop: 20,
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

export default SwipeScreen; 