import { Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { useFocusEffect, useRouter } from 'expo-router'
import useGetMe from '@/hooks/useGetMe'
import * as SecureStore from 'expo-secure-store'
import { setUserData } from '@/Redux/userDataSlice'
import NikeLineLoader from '@/components/NikeLoader'
import { useQueryClient } from '@tanstack/react-query'
import { whiteText } from '@/constants/themeColors'

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const Home = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const qc = useQueryClient()

  const { name, email } = useSelector((state: RootState) => state.userData)
  const { data, isLoading, isPending, error } = useGetMe();
  const [isAuthChecking, setIsAuthChecking] = useState(false)
  const [menuBarOpen, setMenuBarOpen] = useState(false)

  const profileItems = [
    { icon: require('@/assets/user.png'), title: 'Profile' },
    { icon: require('@/assets/home.png'), title: 'Home Page' },
    { icon: require('@/assets/cart.png'), title: 'My Cart' },
    { icon: require('@/assets/fav.png'), title: 'Favorite' },
    { icon: require('@/assets/orders.png'), title: 'Orders' },
    { icon: require('@/assets/notifications.png'), title: 'Notifications' },
  ]

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
    qc.clear();
    router.replace('/(auth)/')
    setIsAuthChecking(false)
  }

  // Animation making...
  const progress = useRef(new Animated.Value(0)).current

  const slide = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.56]
  })

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82]
  })

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-7deg']
  })

  const radius = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25]
  })

  const toggleMenu = () => {
    const toValue = menuBarOpen ? 0 : 1;
    Animated.timing(progress, {
      toValue,
      duration: 400,
      useNativeDriver: true
    }).start();
    setMenuBarOpen(p => !p)
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

      <View style={[{ flex: 1 }, menuBarOpen && { backgroundColor: '#142627' }]}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{
              height: height,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#142627'
            }}>
              <View style={{
                height: 640 * scaleH,
                width: 165 * scaleW,
                paddingLeft: 15
              }}>
                <View style={{
                  width: 60 * scaleW,
                  height: 60 * scaleH,
                  borderRadius: 500,
                  backgroundColor: 'white',
                  marginBottom: 10 * scaleH
                }} />

                <Image source={require('@/assets/hey.png')} style={{
                  transform: [{ scale: 0.9 * scaleW }],
                  marginBottom: 3
                }} />

                <Text style={{ color: whiteText, fontSize: 22 * scaleW }}>{name}</Text>

                <View style={{ marginTop: 35 * scaleH, display: 'flex', rowGap: 25 * scaleH }}>
                  {profileItems.map((item, idx) => {
                    return (
                      <View key={idx} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        columnGap: 22 * scaleW
                      }}>
                        <Image source={item.icon} style={{ width: 20 * scaleW, height: 20 * scaleH }} />
                        <Pressable>
                          <Text style={{ color: whiteText, fontSize: 16 }}>{item.title}</Text>
                        </Pressable>
                      </View>
                    )
                  })}
                </View>

                <View style={{ backgroundColor: '#2D3B48', width: 147 * scaleW, height: 1, marginVertical: 45 * scaleH }} />

                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  columnGap: 22 * scaleW
                }}>
                  <Image source={require('@/assets/sign-out.png')} style={{ width: 20 * scaleW, height: 20 * scaleH }} />
                  <Pressable onPress={logout}>
                    <Text style={{ color: whiteText, fontSize: 16 * scaleW }}>Sign Out</Text>
                  </Pressable>
                </View>

              </View>
            </View>

            <Animated.View style={{
              height: height,
              width: width,
              position: 'absolute',
              zIndex: 100,
              transform: [
                { translateX: Animated.multiply(width, slide) },
                { rotate: rotate },
                { scale: scale },
              ],
              backgroundColor: 'white',
              paddingVertical: 20 * scaleH,
              paddingHorizontal: 20 * scaleW,
              borderRadius: radius
            }}>
              <Pressable onPress={toggleMenu}>
                <Image source={require('@/assets/menu-icon.png')} style={{ width: 35, height: 35, transform: [{ scale: 1.6 }] }} />
              </Pressable>

              <Text>This is second</Text>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </View >
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  }
})

