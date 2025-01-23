import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { LawsuitService } from '../services/LawsuitService';

// Custom Checkbox component
const CustomCheckbox = ({ title, checked, onPress }) => (
  <TouchableOpacity 
    style={styles.checkboxContainer} 
    onPress={onPress}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxTitle}>{title}</Text>
  </TouchableOpacity>
);

// Dummy data for predefined actions
const PREDEFINED_ACTIONS = [
  { id: '1', name: 'Document Preparation', daysCount: 7 },
  { id: '2', name: 'Client Communication', daysCount: 3 },
  { id: '3', name: 'Court Submission', daysCount: 5 },
];

const HomeScreen = () => {
  const router = useRouter();
  const [lawsuitNumber, setLawsuitNumber] = useState('');
  const [nextDate, setNextDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedActions, setSelectedActions] = useState({});

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNextDate(selectedDate);
    }
  };

  const toggleAction = (actionId) => {
    setSelectedActions(prev => ({
      ...prev,
      [actionId]: !prev[actionId]
    }));
  };

  const validateForm = () => {
    if (!lawsuitNumber.trim()) {
      Alert.alert('Error', 'Please enter a lawsuit number');
      return false;
    }

    const hasSelectedActions = Object.values(selectedActions).some(isSelected => isSelected);
    if (!hasSelectedActions) {
      Alert.alert('Error', 'Please select at least one action');
      return false;
    }

    return true;
  };

  const handleAddAction = () => {
    if (!validateForm()) return;

    try {
      const lawsuit = LawsuitService.addLawsuit(
        lawsuitNumber.trim(),
        nextDate,
        selectedActions
      );

      // Reset form
      setLawsuitNumber('');
      setNextDate(new Date());
      setSelectedActions({});

      Alert.alert(
        'Success',
        `Lawsuit ${lawsuit.lawsuitNumber} has been added successfully!`,
        [
          {
            text: 'View All Lawsuits',
            onPress: () => router.push('/dashboard')
          },
          { text: 'Add Another' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add lawsuit. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Lawsuit Number</Text>
        <TextInput
          style={styles.input}
          value={lawsuitNumber}
          onChangeText={setLawsuitNumber}
          placeholder="Enter lawsuit number"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Next Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{nextDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={nextDate}
            mode="date"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Actions</Text>
        {PREDEFINED_ACTIONS.map((action) => (
          <View key={action.id} style={styles.actionItem}>
            <CustomCheckbox
              title={`${action.name} (${action.daysCount} days)`}
              checked={selectedActions[action.id] || false}
              onPress={() => toggleAction(action.id)}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddAction}
      >
        <Text style={styles.addButtonText}>Add Action</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  actionsContainer: {
    marginTop: 20,
  },
  actionItem: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxTitle: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
