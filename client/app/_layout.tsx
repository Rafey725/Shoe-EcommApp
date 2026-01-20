import { router, Stack } from 'expo-router';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useGetMe from '@/hooks/useGetMe';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { isTokenExpired } from '@/hooks/isTokenExpired';
import { Provider, useDispatch } from 'react-redux'
import { store } from '@/Redux/store';
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
  const { data, isLoading, isPending, isFetched, refetch } = useGetMe()
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('token')
        if (!token) return router.replace('/(splash)/SplashScreens')
        const isExpired = isTokenExpired(token)
        if (isExpired) {
          await SecureStore.deleteItemAsync('token')
          console.log('Token expired and deleted from layout');
          dispatch(setUserData({ name: null, email: null }))
          router.replace('/(splash)/SplashScreens')
        }
        else {
          const res = await refetch();
          dispatch(setUserData(res.data.data))
          router.replace('/')
        }
      } catch (err) {
        console.log('Error: ', err);
      } finally {
        setIsAuthChecking(false)
      }
    })()
  }, [])

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="(splash)/SplashScreens" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/AuthScreens" options={{ headerShown: false }} />
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
          </View>
        )
      }
    </>
  )
}

export default function _layout() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootLayout />
      </QueryClientProvider>
    </Provider>
  );
}