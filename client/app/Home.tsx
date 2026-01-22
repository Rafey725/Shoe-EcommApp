import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { useFocusEffect, useRouter } from 'expo-router'
import useGetMe from '@/hooks/useGetMe'
import * as SecureStore from 'expo-secure-store'
import { setUserData } from '@/Redux/userDataSlice'
import { isTokenExpired } from '@/hooks/isTokenExpired'
import NikeLineLoader from '@/components/NikeLoader'
import { useQueryClient } from '@tanstack/react-query'

const Home = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const qc = useQueryClient()

  const { name, email } = useSelector((state: RootState) => state.userData)
  const { data, isLoading, isPending, error } = useGetMe();
  const [isAuthChecking, setIsAuthChecking] = useState(false)
  
  useEffect(() => {
    if (data?.data) {
      dispatch(setUserData(data?.data))
    }
  }, [data])

  const user = data?.data

  useEffect(() => {
    if (error?.message === 'TOKEN_EXPIRED') {
      (async () => {
        await SecureStore.deleteItemAsync('token')
        dispatch(setUserData({ name: null, email: null }))
        qc.clear()
        router.replace('/(auth)/')
      })()
    }
  }, [error, qc])

  const logout = async () => {
    setIsAuthChecking(true)
      await SecureStore.deleteItemAsync('token')
      dispatch(setUserData({ name: null, email: null }))
      console.log('User logged out');
      router.replace('/(auth)/')
      setIsAuthChecking(false)
  }

  return (
    <>
      {
        (isLoading || isPending || isAuthChecking) && (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",

          }}>
            <NikeLineLoader />
          </View>
        )
      }
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black' }}>{user ? `Welcome ${user.name} (${user.email})` : 'Loading...'}</Text>

        <TouchableOpacity onPress={() => router.push('/Details')} style={{ marginTop: 30, borderWidth: 2, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text>Go to details tab</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={{ marginTop: 30, borderWidth: 2, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Home

const styles = StyleSheet.create({})

