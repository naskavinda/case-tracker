import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LawsuitService } from '../services/LawsuitService';

const ActionCard = ({ title, daysCount, createdDate, status }) => (
  <View style={styles.actionCard}>
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
  </View>
);

export default function CaseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [caseDetails, setCaseDetails] = useState(null);

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
});
