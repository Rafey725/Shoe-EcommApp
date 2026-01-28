import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { blueThemeColor, grayText, lightGrayThemeColor } from '@/constants/themeColors';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const Cart = () => {
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(true)

  const { cartItems } = useSelector((state: RootState) => state.cart)
  console.log(cartItems);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', }} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={require('@/assets/arrow-icon.png')} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Cart</Text>
          <View />
        </View>

        {/* Shoes in cart */}

        {cartItems &&
          cartItems.map((item, idx) => {
            return (
              <View key={item?.shoe_name ?? idx}
                style={{ marginTop: 20 * scaleH, flexDirection: 'row', columnGap: 15 * scaleW, height: 100 }}>
                <View style={{ backgroundColor: 'white', width: 110, justifyContent: 'center', borderRadius: 16 }}>
                  <ExpoImage
                    source={{ uri: item?.shoe_image_url }}
                    style={[styles.cardImage]}
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                    contentFit='contain'
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                  <View style={{ justifyContent: 'space-between', height: '100%', paddingBottom: 5 * scaleH }}>
                    <View>
                      <Text style={{ width: 130 * scaleW }}>{item?.shoe_name}</Text>
                      <Text style={{ width: 130 * scaleW }}>{item?.price}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 90 * scaleW }}>
                      <Pressable>
                        <Entypo name='minus' size={18} color={grayText} />
                      </Pressable>
                      <Text>{item?.amount}</Text>
                      <Pressable style={{ backgroundColor: blueThemeColor, width: 24 * scaleW, height: 24 * scaleH, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                        <Image source={require('@/assets/plus-icon.png')} style={{ width: 10 * scaleW, height: 10 * scaleH }} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 * scaleH }}>
                    <Text style={{ fontWeight: '600' }}>L</Text>
                    <Pressable>
                      <Image source={require('@/assets/delete-bin.png')} style={{ width: 18 * scaleW, height: 21 * scaleH }} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )
          })
        }


      </View>
    </SafeAreaView>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 20 * scaleH,
    paddingHorizontal: 20 * scaleW,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 40 * scaleW
  },
  cardImage: {
    width: 105,
    height: 104
  },
})

