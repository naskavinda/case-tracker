import { Stack } from 'expo-router';
import CaseDetailsScreen from '../../src/screens/CaseDetailsScreen';

export default function CaseDetails() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          tabBarStyle: { display: 'none' }
        }} 
      />
      <CaseDetailsScreen />
    </>
  );
}
