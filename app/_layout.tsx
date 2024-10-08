import React from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import { Stack } from "expo-router";
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faPlus, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';


import StocksView from './StocksView';
import StockDetailView from './StockDetailView';
import BrowseView from './BrowseView';
import ProfileView from './ProfileView';
import SellView from './SellView';
import SuccessView from './SuccessView';
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { Tabs } from 'expo-router';
import LandingScreen from "./landing";
import SignUpScreen from "./signup";
import LoginScreen from "./login"
import {useFonts, Lato_400Regular, Lato_700Bold} from '@expo-google-fonts/lato';

import BrowseCategoryView from './BrowseCategoryView';
import BuyView from './BuyView';

// import StockChartScreen from './components/StockChart';
import StockChartScreen from './StockChart';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();


// SecureStore token caching for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('SecureStore save item error: ', err);
    }
  },
};

// Initialize Convex Client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StocksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StocksView" component={StocksView} />
      <Stack.Screen name="StockDetailView" component={StockDetailView} />
      <Stack.Screen name="StockChart" component={StockChartScreen} />
      <Stack.Screen name="SellView" component={SellView} />
      <Stack.Screen name="BuyView" component={BuyView} />
      <Stack.Screen name="SuccessView" component={SuccessView} />
    </Stack.Navigator>
  );
}

function BrowseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrowseView" component={BrowseView} />
      <Stack.Screen name="StockDetailView" component={StockDetailView} />
      {/* <Stack.Screen name="BrowseCategoryView" component={BrowseCategoryView} /> */}
      <Stack.Screen name="SellView" component={SellView} />
      <Stack.Screen name="BuyView" component={BuyView} />
      <Stack.Screen name="SuccessView" component={SuccessView} />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        {/* Move the useAuth hook within the ClerkLoaded scope */}
        <ClerkApp />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function ClerkApp() {
  const[fontsLoaded] = useFonts({Lato_400Regular, Lato_700Bold});
  const { isSignedIn } = useAuth();

  return (
    <ConvexProvider client={convex}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      {/* {isSignedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="StocksView" component={StocksStack} options={{ headerShown: false }} />
          <Tab.Screen name="BrowseView" component={BrowseStack} options={{ headerShown: false }} />
          <Tab.Screen name="ProfileView" component={require("./ProfileView").default} options={{ headerShown: false }}/>
        </Tab.Navigator>
      ) : ( */}
      {isSignedIn ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'StocksView') {
                  iconName = faHome;
                } else if (route.name === 'BrowseView') {
                    iconName = faPlus;
                } else if (route.name === 'ProfileView') {
                  iconName = faUser;
                }

                // Return the FontAwesomeIcon component with the selected icon
                return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
              },
              tabBarLabel: () => null,
            })}
          >
            <Tab.Screen name="StocksView" component={StocksStack} options={{ headerShown: false }} />
            <Tab.Screen name="BrowseView" component={BrowseStack} options={{ headerShown: false }} />
            <Tab.Screen name="ProfileView" component={require("./ProfileView").default} options={{ headerShown: false }} />
          </Tab.Navigator>
        ) : (
        <Stack.Navigator initialRouteName="landing" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="landing" component={LandingScreen} />
          <Stack.Screen name="signup" component={SignUpScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
      )}
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}
