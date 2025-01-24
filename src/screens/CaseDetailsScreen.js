import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LawsuitService } from '../services/LawsuitService';

const ActionCard = ({ title, daysCount, createdDate, status, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionCard}>
    <View style={styles.actionContent}>
      <View style={styles.actionHeader}>
        <Text style={styles.actionTitle}>{title}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: status === 'Completed' ? '#4CAF50' : '#FFC107' }
        ]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <Text style={styles.daysCount}>Days Count: {daysCount} days</Text>
      <Text style={styles.createdDate}>Created: {createdDate}</Text>
    </View>
  </TouchableOpacity>
);

export default function CaseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [caseDetails, setCaseDetails] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleActionPress = (action) => {
    if (!action.completed) {
      setSelectedAction(action);
      setModalVisible(true);
    }
  };

  const handleCompleteAction = () => {
    if (selectedAction) {
      const success = LawsuitService.completeAction(parseInt(id), selectedAction.actionId);
      if (success) {
        // Refresh case details
        const updatedCase = LawsuitService.getLawsuit(parseInt(id));
        setCaseDetails(updatedCase);
        Alert.alert('Success', 'Action marked as completed');
      } else {
        Alert.alert('Error', 'Failed to complete action');
      }
    }
    setModalVisible(false);
    setSelectedAction(null);
  };

  useEffect(() => {
    try {
      const lawsuit = LawsuitService.getLawsuit(parseInt(id));
      if (lawsuit) {
        setCaseDetails(lawsuit);
      } else {
        Alert.alert('Error', 'Case not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading case details:', error);
      Alert.alert('Error', 'Failed to load case details');
      router.back();
    }
  }, [id]);

  if (!caseDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: `Case #${caseDetails.lawsuitNumber}`,
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
        }}
      />
      <View style={styles.header}>
        <Text style={styles.caseNumber}>Case #{caseDetails.lawsuitNumber}</Text>
        <Text style={styles.nextDate}>
          Next Date: {new Date(caseDetails.nextDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        {caseDetails.actions.map((action, index) => (
          <ActionCard
            key={action.actionId}
            title={action.actionId === '1' ? 'Document Preparation' : 'Court Submission'}
            daysCount={action.actionId === '1' ? 7 : 5}
            createdDate={new Date(action.createdAt).toLocaleDateString()}
            status={action.completed ? 'Completed' : 'Pending'}
            onPress={() => handleActionPress(action)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{caseDetails.actions.length}</Text>
            <Text style={styles.summaryLabel}>Total Actions</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {caseDetails.actions.filter(a => a.completed).length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {caseDetails.actions.filter(a => !a.completed).length}
            </Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Action Details</Text>
            {selectedAction && (
              <>
                <View style={styles.modalContent}>
                  <Text style={styles.modalLabel}>Type:</Text>
                  <Text style={styles.modalValue}>
                    {selectedAction.actionId === '1' ? 'Document Preparation' : 'Court Submission'}
                  </Text>
                </View>
                <View style={styles.modalContent}>
                  <Text style={styles.modalLabel}>Created:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedAction.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.modalContent}>
                  <Text style={styles.modalLabel}>Days Count:</Text>
                  <Text style={styles.modalValue}>
                    {selectedAction.actionId === '1' ? '7' : '5'} days
                  </Text>
                </View>
                <View style={styles.modalContent}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <Text style={[
                    styles.modalValue,
                    { color: selectedAction.completed ? '#4CAF50' : '#FFC107' }
                  ]}>
                    {selectedAction.completed ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </>
            )}
            <Text style={styles.modalQuestion}>
              Do you want to mark this action as completed?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonComplete]}
                onPress={handleCompleteAction}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  caseNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nextDate: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionContent: {
    padding: 16,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  daysCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 14,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalQuestion: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    width: '45%',
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#666',
  },
  buttonComplete: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
