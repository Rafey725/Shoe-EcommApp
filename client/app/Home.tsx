import { ActivityIndicator, Animated, Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { useRouter } from 'expo-router'
import useGetMe from '@/hooks/useGetMe'
import * as SecureStore from 'expo-secure-store'
import { setUserData } from '@/Redux/userDataSlice'
import NikeLineLoader from '@/components/NikeLoader'
import { useQueryClient } from '@tanstack/react-query'
import { blueThemeColor, whiteText } from '@/constants/themeColors'
import { grayText } from '@/constants/themeColors'
import { setShoesDetail } from '@/Redux/shoesDetail'
import useGetShoes from '@/hooks/useGetShoes'

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const Home = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const qc = useQueryClient()

  const { name, email, profile_url } = useSelector((state: RootState) => state.userData)
  const { data, isLoading, isPending, error } = useGetMe();
  const [isAuthChecking, setIsAuthChecking] = useState(false)
  const [menuBarOpen, setMenuBarOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const profileItems = [
    { icon: require('@/assets/user.png'), title: 'Profile', link: '/Profile' as const },
    { icon: require('@/assets/home.png'), title: 'Home Page', link: '/Home' as const },
    { icon: require('@/assets/cart.png'), title: 'My Cart', link: '/Cart' as const },
    { icon: require('@/assets/fav.png'), title: 'Favorite', link: '/Fav' as const },
    { icon: require('@/assets/orders.png'), title: 'Orders', link: '/Orders' as const },
    { icon: require('@/assets/notifications.png'), title: 'Notifications', link: '/Notifications' as const },
  ]

  useEffect(() => {
    if (data?.data) {
      dispatch(setUserData(data?.data))
    }
  }, [data])

  // const user = data?.data

  useEffect(() => {
    if (error?.message === 'TOKEN_EXPIRED') {
      (async () => {
        await SecureStore.deleteItemAsync('token')
        dispatch(setUserData({ name: null, email: null, profile_url: null }))
        qc.clear()
        router.replace('/(auth)/')
      })()
    }
  }, [error, qc])

  const logout = async () => {
    setIsAuthChecking(true)
    await SecureStore.deleteItemAsync('token')
    dispatch(setUserData({ name: null, email: null, profile_url: null }))
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

  const [selectedBrand, setSelectedBrand] = useState('nike')

  // Brands
  const brands = [
    {
      logo: require('@/assets/nike-logo.png'),
      title: 'Nike',
      brandName: 'nike',
      width: 90
    },
    {
      logo: require('@/assets/puma-logo.png'),
      title: 'Puma',
      brandName: 'puma',
      width: 95
    },
    {
      logo: require('@/assets/under-armour-logo.png'),
      title: 'Under Armour',
      brandName: 'under-armour',
      width: 150
    },
    {
      logo: require('@/assets/addidas-logo.png'),
      title: 'Addidas',
      brandName: 'addidas',
      width: 110
    },
    {
      logo: require('@/assets/converse-logo.png'),
      title: 'Converse',
      brandName: 'converse',
      width: 110
    }
  ]

  const brandAnimations = useRef(
    brands.reduce<Record<string, Animated.Value>>((acc, brand) => {
      acc[brand.brandName] = new Animated.Value(0);
      return acc
    }, {})
  ).current;

  useEffect(() => {
    brands.forEach(brand => {
      Animated.spring(brandAnimations[brand.brandName], {
        toValue: brand.brandName === selectedBrand ? 1 : 0,
        friction: 7,
        tension: 60,
        useNativeDriver: false
      }).start()
    })
  }, [selectedBrand])

  // Popular shoes
  type Shoe = {
    id: string;
    shoe_name: string;
    badge?: string;
    price: string;
    description: string,
    shoe_image_url: string;
    scale: number
  };

  const [isImageLoading, setIsImageLoading] = useState(true)
  const { data: shoes, isLoading: isShoesLoading, isPending: isShoesPending, isError } = useGetShoes()

  const [popularShoes, setPopularShoes] = useState<Shoe[]>([])

  useEffect(() => {
    setPopularShoes(shoes?.shoes)
  }, [shoes])


  // const popularShoes: Shoe[] = [
  //   {
  //     id: "1",
  //     name: "Nike Jordan",
  //     price: "$493.00",
  //     badge: "BEST SELLER",
  //     desc: 'Air Jordan is an American brand of basketball shoes athletic, casual, and style clothing produced by Nike....',
  //     image: require('@/assets/Popular-Shoes/nike-jordan-upscayl.png'),
  //     scale: 1
  //   },
  //   {
  //     id: "2",
  //     name: "Nike Air Max",
  //     price: "$897.99",
  //     badge: "BEST SELLER",
  //     desc: 'Air Jordan is an American brand of basketball shoes athletic, casual, and style clothing produced by Nike....',
  //     image: require('@/assets/Popular-Shoes/nike-air-max-upscayl.png'),
  //     scale: 1
  //   },
  // ];

  const goToDetailsTab = (shoe: Shoe) => {
    const shoesDetail = {
      badge: shoe.badge,
      shoeName: shoe.shoe_name,
      price: shoe.price,
      desc: shoe.description,
      shoeImage: shoe.shoe_image_url
    }
    dispatch(setShoesDetail(shoesDetail))
    router.push('/Details')
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

      <View style={[{ flex: 1 }, menuBarOpen ? { backgroundColor: '#142627' } : { backgroundColor: '#f8f9fa' }]}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <ScrollView style={{ flex: 1 }}>
            {/* Profile screen */}
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
                <Image
                  source={profile_url ? { uri: profile_url } : require('@/assets/profile-image.png')}
                  style={{
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
                      <Pressable key={idx}
                        onPress={() => {
                          item.link !== '/Home' && router.push(item.link);
                          toggleMenu()
                        }
                        }
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%',
                          columnGap: 22 * scaleW
                        }}>
                        <Image source={item.icon} style={{ width: 20 * scaleW, height: 20 * scaleH }} />
                        <Text style={{ color: whiteText, fontSize: 16 }}>{item.title}</Text>
                      </Pressable>
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

            {/* Main screen */}
            <Animated.View
              style={{
                height: height,
                width: width,
                position: 'absolute',
                zIndex: 100,
                transform: [
                  { translateX: Animated.multiply(width, slide) },
                  { rotate: rotate },
                  { scale: scale },
                ],
                backgroundColor: '#f8f9fa',
                paddingVertical: 20 * scaleH,
                paddingHorizontal: 20 * scaleW,
                borderRadius: radius,
                overflow: 'hidden'
              }}>
              {/* Top bar */}
              <View style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5 * scaleH
              }}>
                <Pressable onPress={toggleMenu}>
                  <Image source={require('@/assets/menu-icon.png')}
                    style={{ width: 35, height: 35, transform: [{ scale: 1.3 }] }} />
                </Pressable>

                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 * scaleW, color: grayText }}>Store Location</Text>
                  <View style={{ display: 'flex', columnGap: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('@/assets/location.png')} />
                    <Text style={{ fontSize: 14 * scaleW, fontWeight: '600' }}>Karachi, Pakistan</Text>
                  </View>
                </View>

                <Pressable onPress={() => router.push('/Cart')}>
                  <Image source={require('@/assets/my-cart.png')}
                    style={{ width: 35, height: 35, transform: [{ scale: 1.3 }] }} />
                </Pressable>
              </View>

              {/* Search bar */}
              <View style={{
                marginVertical: 20,
                width: '100%',
                height: 48,
                backgroundColor: 'white',
                borderRadius: 50,
                paddingHorizontal: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 15
              }}>
                <Image source={require('@/assets/search-icon.png')} style={{ width: 17, height: 17 }} />
                <TextInput style={{
                  paddingRight: 30,
                }}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder='Looking for shoes'
                />
              </View>

              {/* Brands */}
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {brands.map((brand, idx) => {
                  const anim = brandAnimations[brand.brandName]

                  return (
                    <Pressable key={idx}
                      onPress={() => setSelectedBrand(brand.brandName)}
                    >
                      <Animated.View
                        style={[{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          columnGap: 7,
                          overflow: 'hidden',
                          borderRadius: 42
                        },
                        selectedBrand === brand.brandName ? {
                          width: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [42 * scaleW, brand.width * scaleW]
                          }),
                          height: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [42 * scaleH, 42 * scaleH]
                          }),
                          backgroundColor: blueThemeColor,
                        } : null
                        ]}>
                        <Animated.Image source={brand.logo} style={[{
                          width: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [42, 32]
                          }),
                          height: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [42, 32]
                          }),
                          marginLeft: 5 * scaleW,
                        }
                        ]} />

                        {selectedBrand === brand.brandName &&
                          <Text style={{ color: 'white', fontSize: 14, flexWrap: 'wrap' }}>{brand.title}</Text>
                        }
                      </Animated.View>
                    </Pressable>
                  )
                })}
              </View>

              {/* Popular Shoes */}
              <View style={[styles.container, {}]}>
                {/* Popular Shoes Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Popular Shoes</Text>
                  <Pressable onPress={() => router.push('/SeeAllShoes')}>
                    <Text style={styles.seeAll}>See all</Text>
                  </Pressable>
                </View>

                <View style={[{ display: 'flex', flexDirection: 'row' }, popularShoes
                  ? { justifyContent: 'space-between' }
                  : { justifyContent: 'center' }
                ]}>
                  {/* Popular Shoes List */}
                  {popularShoes
                    ? popularShoes.map((shoe, idx) => {
                      return (
                        <Pressable
                          key={idx}
                          onPress={() => goToDetailsTab(shoe)}
                          style={styles.shoeCard}>
                          {isImageLoading &&
                            <ActivityIndicator style={{ position: 'absolute', left: '50%', top: '20%' }} />
                          }
                          <Image
                            source={{ uri: shoe.shoe_image_url }}
                            style={[styles.cardImage, { transform: [{ scale: shoe.scale }] }]}
                            onLoadStart={() => setIsImageLoading(true)}
                            onLoadEnd={() => setIsImageLoading(false)}
                            onError={() => setIsImageLoading(false)} />

                          {shoe.badge && (
                            <Text style={styles.badge}>{shoe.badge}</Text>
                          )}

                          <Text style={styles.cardTitle}>{shoe.shoe_name}</Text>
                          <Text style={styles.price}>{shoe.price}</Text>

                          <TouchableOpacity style={styles.addButton}>
                            <Image source={require('@/assets/plus-icon.png')} />
                          </TouchableOpacity>
                        </Pressable>
                      )
                    })
                    : <ActivityIndicator />
                  }
                </View>
              </View>

              {/* New Arrivals */}
              <View style={{ marginTop: 20 }}>
                {/* New Arrivals Header */}
                <View style={[styles.header]}>
                  <Text style={styles.headerTitle}>New Arrivals</Text>
                  <Pressable onPress={() => router.push('/SeeAllShoes')}>
                    <Text style={styles.seeAll}>See all</Text>
                  </Pressable>
                </View>

                {/* New Arrival Card */}
                <View style={styles.newArrivalCard}>
                  <View>
                    <Text style={styles.newArrivalCardBadge}>BEST CHOICE</Text>
                    <Text style={styles.newArrivalCardTitle}>Nike Air Jordan</Text>
                    <Text style={styles.newArrivalCardPrice}>$849.69</Text>
                  </View>

                  <Image
                    source={require('@/assets/Popular-Shoes/nike-air-jordan-upscayl.png')}
                    style={[styles.newArrivalCardImage, { transform: [{ translateY: 10 }] }]}
                  />
                </View>
              </View>

              {/* Bottom tabs bar */}
              <ImageBackground source={require('@/assets/tabs-bg.png')} style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: width,
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Pressable onPress={() => router.push('/Cart')}
                  style={{ height: 56, width: 56, borderRadius: 200, backgroundColor: blueThemeColor, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: [{ translateY: -5 }] }}>
                  <Image source={require('@/assets/white-cart.png')} />
                </Pressable>

                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  transform: [
                    { translateY: -25 }
                  ]
                }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%', paddingLeft: 30, paddingRight: 60 }}>
                    <Pressable>
                      <Image source={require('@/assets/blue-home.png')} />
                    </Pressable>
                    <Pressable onPress={() => router.push('/Fav')}>
                      <Image source={require('@/assets/fav.png')} />
                    </Pressable>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%', paddingRight: 30, paddingLeft: 60 }}>
                    <Pressable onPress={() => router.push('/Notifications')}>
                      <Image source={require('@/assets/notifications.png')} />
                    </Pressable>
                    <Pressable onPress={() => router.push('/Profile')}>
                      <Image source={require('@/assets/user.png')} />
                    </Pressable>
                  </View>
                  <View></View>
                </View>
              </ImageBackground>
            </Animated.View>
          </ScrollView>
        </SafeAreaView >
      </View >
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  seeAll: {
    fontSize: 14,
    color: blueThemeColor,
  },

  shoeCard: {
    backgroundColor: "#FFFFFF",
    width: 157 * scaleW,
    height: 200 * scaleH,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginTop: 16 * scaleH,
  },

  cardImage: {
    width: 125,
    height: 104,
    resizeMode: "contain",
  },

  badge: {
    fontSize: 12,
    color: blueThemeColor,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  price: {
    marginTop: 5 * scaleH,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  addButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: blueThemeColor,
    width: 34,
    height: 34,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  newArrivalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16 * scaleW,
    paddingVertical: 16 * scaleH,
    marginTop: 16 * scaleH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  newArrivalCardBadge: {
    color: blueThemeColor,
    fontWeight: "600",
    fontSize: 12,
  },

  newArrivalCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 3,
    color: "#1A1A1A",
  },

  newArrivalCardPrice: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    color: "#1A1A1A",
  },

  newArrivalCardImage: {
    width: 160,
    height: 100,
    resizeMode: "cover",
  },
})