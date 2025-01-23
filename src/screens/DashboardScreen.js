import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SectionList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LawsuitService } from '../services/LawsuitService';

const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'upcoming':
        return '#FFC107'; // Yellow
      case 'overdue':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  return (
    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
  );
};

const LawsuitCard = ({ lawsuit }) => {
  const calculateStatus = () => {
    const now = new Date();
    const nextDate = new Date(lawsuit.nextDate);
    
    // Check if all actions are completed
    const allActionsCompleted = lawsuit.actions.every(action => action.completed);
    if (allActionsCompleted) return 'completed';

    // Check if next date is overdue
    if (nextDate < now) return 'overdue';

    // Check if next date is within 7 days
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);
    if (nextDate <= sevenDaysFromNow) return 'upcoming';

    return 'upcoming';
  };

  return (
    <View style={styles.card}>
      <StatusIndicator status={calculateStatus()} />
      <View style={styles.cardContent}>
        <Text style={styles.lawsuitNumber}>Case #{lawsuit.lawsuitNumber}</Text>
        <Text style={styles.nextDate}>
          Next Date: {new Date(lawsuit.nextDate).toLocaleDateString()}
        </Text>
        <View style={styles.actionStatus}>
          <Text style={styles.actionCount}>
            Actions: {lawsuit.actions.filter(a => a.completed).length}/{lawsuit.actions.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const [lawsuits, setLawsuits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadLawsuits();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadLawsuits();
    setRefreshing(false);
  }, []);

  const loadLawsuits = () => {
    const allLawsuits = LawsuitService.getAllLawsuits();
    setLawsuits(allLawsuits);
    organizeLawsuits(allLawsuits);
  };

  const organizeLawsuits = (lawsuitList) => {
    const now = new Date();
    const overdue = [];
    const today = [];
    const thisWeek = [];
    const upcoming = [];
    
    lawsuitList.forEach(lawsuit => {
      const nextDate = new Date(lawsuit.nextDate);
      
      if (nextDate < now) {
        overdue.push(lawsuit);
        return;
      }

      const isToday = nextDate.toDateString() === now.toDateString();
      if (isToday) {
        today.push(lawsuit);
        return;
      }

      const sevenDaysFromNow = new Date(now);
      sevenDaysFromNow.setDate(now.getDate() + 7);
      
      if (nextDate <= sevenDaysFromNow) {
        thisWeek.push(lawsuit);
        return;
      }

      upcoming.push(lawsuit);
    });

    // Sort each section by date
    const sortByDate = (a, b) => new Date(a.nextDate) - new Date(b.nextDate);
    
    const sections = [
      { title: 'Overdue', data: overdue.sort(sortByDate) },
      { title: 'Today', data: today.sort(sortByDate) },
      { title: 'This Week', data: thisWeek.sort(sortByDate) },
      { title: 'Upcoming', data: upcoming.sort(sortByDate) },
    ].filter(section => section.data.length > 0);

    setSections(sections);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      organizeLawsuits(lawsuits);
      return;
    }

    const searchDate = new Date(query);
    const isValidDate = !isNaN(searchDate.getTime());

    const filtered = lawsuits.filter(lawsuit => {
      // Search by lawsuit number
      if (lawsuit.lawsuitNumber.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }

      // Search by date if valid date is entered
      if (isValidDate) {
        const nextDate = new Date(lawsuit.nextDate);
        return nextDate.toLocaleDateString() === searchDate.toLocaleDateString();
      }

      return false;
    });

    organizeLawsuits(filtered);
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No lawsuits found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by case number or date..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <SectionList
        sections={sections}
        renderItem={({ item }) => <LawsuitCard lawsuit={item} />}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 80, // Extra padding at bottom for better scrolling
  },
  sectionHeader: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    elevation: 2,
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 8,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  lawsuitNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nextDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  actionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default DashboardScreen;
