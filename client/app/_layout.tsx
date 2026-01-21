import { router, Stack } from 'expo-router';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useGetMe from '@/hooks/useGetMe';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { isTokenExpired } from '@/hooks/isTokenExpired';
import { Provider, useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '@/Redux/store';
import { setUserData } from '@/Redux/userDataSlice';
import { ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import NikeLoader from '@/components/NikeLoader';
import { decode as atob, encode as btoa } from 'base-64';

if (!global.atob) global.atob = atob;
if (!global.btoa) global.btoa = btoa;

const RootLayout = () => {
  const dispatch = useDispatch()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const { value: isLoading } = useSelector((state: RootState) => state.isLoading)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        if (!mounted) return
        const token = await SecureStore.getItemAsync('token')
        if (!token) {
          return router.replace('/(splash)/SplashScreens');
        } else {
          router.replace('/Home')
        }


      } catch (err) {
        console.log('Error from layout: ', err);
      } finally {
        setIsAuthChecking(false)
      }
    })()
  }, [mounted])

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "ios"
        }}
      >
        <Stack.Screen name="(splash)/SplashScreens" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>

      {
        isAuthChecking && (
          <View style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}>
            <NikeLoader />
          </View>)
      }
    </>
  )
}

export default function _layout() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootLayout />
      </QueryClientProvider>
    </Provider>
  );
}