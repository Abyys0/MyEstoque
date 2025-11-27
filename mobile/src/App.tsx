import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import InventoryScreen from './screens/InventoryScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'MyStock' }}
      />
    </Stack.Navigator>
  );
}

function ScanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Scan" 
        component={ScanScreen}
        options={{ title: 'Ler Código de Barras' }}
      />
    </Stack.Navigator>
  );
}

function InventoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{ title: 'Estoque' }}
      />
    </Stack.Navigator>
  );
}

function ReportsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ title: 'Relatórios' }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#888888',
        }}
      >
        <Tab.Screen 
          name="HomeStack" 
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }: { color: string }) => (
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="ScanStack" 
          component={ScanStack}
          options={{
            tabBarLabel: 'Scan',
            tabBarIcon: ({ color }: { color: string }) => (
              <Text style={{ color, fontSize: 20 }}>📱</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="InventoryStack" 
          component={InventoryStack}
          options={{
            tabBarLabel: 'Estoque',
            tabBarIcon: ({ color }: { color: string }) => (
              <Text style={{ color, fontSize: 20 }}>📦</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="ReportsStack" 
          component={ReportsStack}
          options={{
            tabBarLabel: 'Relatórios',
            tabBarIcon: ({ color }: { color: string }) => (
              <Text style={{ color, fontSize: 20 }}>📊</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="SettingsStack" 
          component={SettingsStack}
          options={{
            tabBarLabel: 'Config',
            tabBarIcon: ({ color }: { color: string }) => (
              <Text style={{ color, fontSize: 20 }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
