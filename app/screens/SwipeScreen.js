import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import SwipeCard from '../components/cards/SwipeCard';
import { MOCK_JOBS } from '../utils/mockData';
import Animated, { 
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';

const SwipeScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeAnim = useSharedValue(0);

  const handleSwipeLeft = (job) => {
    console.log('Passed on job:', job.title);
    // Animation and delay to allow the card to finish animating off screen
    swipeAnim.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      swipeAnim.value = 0;
    }, 300);
  };

  const handleSwipeRight = (job) => {
    console.log('Applied to job:', job.title);
    // Here we would handle job application logic
    // For now just advancing to the next card with animation
    swipeAnim.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      swipeAnim.value = 0;
    }, 300);
  };

  const handleCardPress = (job) => {
    // Navigate to job details screen
    navigation.navigate('JobDetail', { job });
  };

  // For manually swiping left/right using buttons (alternative to gesture)
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

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="JobSwipe" />
        <Appbar.Action icon="filter-variant" onPress={() => {}} />
      </Appbar.Header>
      
      <View style={styles.cardContainer}>
        {/* End of jobs message */}
        <Animated.View style={[styles.endOfJobsContainer, noMoreJobsAnimStyle]}>
          <Text style={styles.endOfJobsText}>No more jobs to display!</Text>
          <Button 
            mode="contained" 
            style={styles.refreshButton}
            onPress={() => setCurrentIndex(0)}
          >
            Start Over
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
          Pass
        </Button>
        <Button
          icon="thumb-up"
          mode="contained"
          onPress={handleButtonSwipeRight}
          style={[styles.button, styles.applyButton]}
          disabled={currentIndex >= jobs.length}
        >
          Apply
        </Button>
      </View>
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
});

export default SwipeScreen; 