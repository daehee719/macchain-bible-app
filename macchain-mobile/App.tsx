import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { NavigationContainerRef } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import Header from './src/components/Header'
import './src/global.css'

// Screens
import LoginScreen from './src/screens/LoginScreen'
import DashboardScreen from './src/screens/DashboardScreen'
import ReadingPlanScreen from './src/screens/ReadingPlanScreen'
import AIAnalysisScreen from './src/screens/AIAnalysisScreen'
import CommunityScreen from './src/screens/CommunityScreen'
import StatisticsScreen from './src/screens/StatisticsScreen'
import SettingsScreen from './src/screens/SettingsScreen'

const Stack = createNativeStackNavigator()

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retry: 1,
    },
  },
})

function AppContent() {
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null)
  const { isLoggedIn } = useAuth()
  const [currentRoute, setCurrentRoute] = React.useState<string>('Login')

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const route = navigationRef.current?.getCurrentRoute()
        setCurrentRoute(route?.name || 'Login')
      }}
      onStateChange={() => {
        const route = navigationRef.current?.getCurrentRoute()
        setCurrentRoute(route?.name || 'Login')
      }}
    >
      {currentRoute !== 'Login' && <Header />}
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ReadingPlan" component={ReadingPlanScreen} />
        <Stack.Screen name="AIAnalysis" component={AIAnalysisScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
