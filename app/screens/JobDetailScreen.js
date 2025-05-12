import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Button, List, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const JobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;

  const handleApply = () => {
    // This would integrate with the AI auto-fill in a future version
    alert('Application feature will be available in future versions!');
    // Navigate back to swipe screen
    navigation.goBack();
  };

  const handleSave = () => {
    // This would save the job to the user's saved list
    alert('Job saved to your favorites!');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Job Details" />
        <Appbar.Action icon="heart-outline" onPress={handleSave} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <Text style={styles.detailText}>{job.location}</Text>
          </View>
          
          {job.salary && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="currency-usd" size={20} color="#666" />
              <Text style={styles.detailText}>{job.salary}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <Text style={styles.detailText}>Posted on {job.postedDate}</Text>
          </View>
        </View>

        <Divider />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </View>

        <Divider />
        
        <List.Section>
          <List.Accordion
            title="Requirements"
            left={props => <List.Icon {...props} icon="clipboard-check" />}
            expanded={true}
          >
            {job.requirements.map((requirement, index) => (
              <List.Item
                key={index}
                title={requirement}
                left={() => <List.Icon icon="check" />}
                titleNumberOfLines={3}
              />
            ))}
          </List.Accordion>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Accordion
            title="Benefits"
            left={props => <List.Icon {...props} icon="star" />}
            expanded={true}
          >
            {job.benefits.map((benefit, index) => (
              <List.Item
                key={index}
                title={benefit}
                left={() => <List.Icon color="#56CD56" icon="check-circle" />}
                titleNumberOfLines={3}
              />
            ))}
          </List.Accordion>
        </List.Section>

        <View style={styles.applySection}>
          <Button
            mode="contained"
            style={styles.applyButton}
            labelStyle={styles.applyButtonLabel}
            onPress={handleApply}
            icon="send"
          >
            Apply Now
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  jobHeader: {
    padding: 20,
    backgroundColor: 'white',
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: '#555',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  applySection: {
    padding: 20,
    backgroundColor: 'white',
  },
  applyButton: {
    padding: 8,
    backgroundColor: '#56CD56',
  },
  applyButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobDetailScreen; 