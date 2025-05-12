import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, TextInput, Button, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleResumeUpload = () => {
    // This would handle document picking in a more complete version
    alert('Resume upload will be available in future versions');
    setResumeUploaded(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Image 
            size={120} 
            source={{ uri: 'https://ui-avatars.com/api/?name=Job+Seeker&background=0D8ABC&color=fff' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialCommunityIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            mode="outlined"
          />
          
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            mode="outlined"
          />
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Resume</Text>
          
          <Button 
            icon="file-upload" 
            mode="outlined" 
            onPress={handleResumeUpload}
            style={styles.uploadButton}
          >
            {resumeUploaded ? 'Update Resume' : 'Upload Resume'}
          </Button>
          
          {resumeUploaded && (
            <View style={styles.resumeInfo}>
              <MaterialCommunityIcons name="file-document" size={24} color="#6200ee" />
              <Text style={styles.resumeText}>my_resume.pdf</Text>
              <Text style={styles.resumeDate}>Uploaded: Today</Text>
            </View>
          )}
          
          <Text style={styles.infoText}>
            Upload your resume to enable AI-powered auto-filling of job applications
          </Text>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Skills</Text>
          
          <List.Item
            title="Add your skills"
            description="Help employers find you"
            left={props => <List.Icon {...props} icon="toolbox" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Experience</Text>
          
          <List.Item
            title="Add work experience"
            description="Tell employers about your past roles"
            left={props => <List.Icon {...props} icon="briefcase" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Education</Text>
          
          <List.Item
            title="Add education"
            description="Add your educational background"
            left={props => <List.Icon {...props} icon="school" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Button 
            mode="contained" 
            style={styles.saveButton}
            onPress={() => alert('Profile saved!')}
          >
            Save Profile
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
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#6200ee',
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  editIcon: {
    position: 'absolute',
    bottom: 30,
    right: '35%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  form: {
    padding: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#6200ee',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  divider: {
    marginVertical: 16,
  },
  uploadButton: {
    marginVertical: 10,
  },
  resumeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  resumeText: {
    marginLeft: 10,
    flex: 1,
    fontWeight: 'bold',
  },
  resumeDate: {
    color: '#666',
    fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  saveButton: {
    marginVertical: 20,
    backgroundColor: '#6200ee',
  },
});

export default ProfileScreen; 