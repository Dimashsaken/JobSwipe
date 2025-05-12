import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const SwipeCard = ({ job, onSwipeLeft, onSwipeRight, onPress }) => {
  // Animation values
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  
  // Handle card swipe
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotation.value = event.translationX / 20;
    })
    .onEnd((event) => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeLeft)(job);
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeRight)(job);
      } else {
        translateX.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  // Animated styles
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, cardStyle]}>
        <TouchableOpacity onPress={() => onPress(job)} activeOpacity={0.9}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>{job.title}</Title>
              <Text style={styles.company}>{job.company}</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <IconButton icon="map-marker" size={16} />
                  <Text>{job.location}</Text>
                </View>
                {job.salary && (
                  <View style={styles.detailItem}>
                    <IconButton icon="currency-usd" size={16} />
                    <Text>{job.salary}</Text>
                  </View>
                )}
              </View>
              <Paragraph numberOfLines={3} style={styles.description}>
                {job.description}
              </Paragraph>
            </Card.Content>
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Swipe left to skip, right to apply</Text>
              <Text style={styles.tapText}>Tap for details</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  description: {
    marginVertical: 10,
    lineHeight: 20,
  },
  cardFooter: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  tapText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6200ee',
    fontWeight: 'bold',
  }
});

export default SwipeCard; 