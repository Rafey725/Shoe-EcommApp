import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { useFocusEffect, useRouter } from 'expo-router'
import useGetMe from '@/hooks/useGetMe'
import * as SecureStore from 'expo-secure-store'
import { setUserData } from '@/Redux/userDataSlice'
import { isTokenExpired } from '@/hooks/isTokenExpired'
import NikeLineLoader from '@/components/NikeLoader'

const Home = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { name, email } = useSelector((state: RootState) => state.userData)

  const { data, isLoading, isPending, isFetched, refetch } = useGetMe()
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useFocusEffect(
    useCallback(
      () => {
        let isActive = true;

        const fetch = async () => {
          try {
            const token = await SecureStore.getItemAsync('token')
            if (!token) return router.replace('/(splash)/SplashScreens')
            const isExpired = isTokenExpired(token)
            if (isExpired) {
              await SecureStore.deleteItemAsync('token')
              console.log('Token expired and deleted from home tab');
              router.replace('/(splash)/SplashScreens')
              return
            }
            else {
              if (isActive) {
                const res = await refetch();
                dispatch(setUserData(res.data.data))
              }
            }
          } catch (err) {
            console.log('Error: ', err);
          } finally {
            setIsAuthChecking(false)
          }
        }

        fetch()

        return () => isActive = false
      }, [dispatch],
    )
  )

  return (
    <>
      {
        isAuthChecking && (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",

          }}>
            {/* <ActivityIndicator size={'large'} color={'#5b9ee1'}/> */}
            <NikeLineLoader />
          </View>
        )
      }
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black' }}>Welcome {name && name}{email && `(${email})`}</Text>
      </View>
    </>
  )
}

export default Home

const styles = StyleSheet.create({})

