import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { blueThemeColor } from '@/constants/themeColors';
import { Image as ExpoImage } from 'expo-image';
import { setShoesDetail } from '@/Redux/shoesDetail';
import { addToCart } from '@/Redux/cart';

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

type Shoe = {
    id: string | number,
    shoe_name: string,
    badge: string,
    price: string,
    shoe_image_url: string
    description: string,
    scale: number
}

const SeeAllShoes = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { allShoes }: { allShoes: Shoe[] } = useSelector((state: RootState) => state.allShoes)
    const [isImageLoading, setIsImageLoading] = useState(true)

    const goToDetailsTab = (shoe: Shoe) => {
        const shoesDetail = {
            badge: shoe.badge,
            shoeName: shoe.shoe_name,
            price: shoe.price,
            desc: shoe.description,
            shoeImage: shoe.shoe_image_url,
            scale: shoe.scale
        }
        dispatch(setShoesDetail(shoesDetail))
        router.push('/Details')
    }

    // ADD TO CART FUNCTIONALITY
    const handleAddToCart = (shoe: Shoe) => {
        const detail = {
            shoe_name: shoe.shoe_name,
            price: shoe.price,
            shoe_image_url: shoe.shoe_image_url,
            amount: 1
        }
        dispatch(addToCart(detail))
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', }} edges={['top']}>
            <ScrollView style={{
                flex: 1, backgroundColor: '#f8f9fa', paddingVertical: 20 * scaleH, paddingHorizontal: 20 * scaleW,
            }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image source={require('@/assets/arrow-icon.png')} />
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600'
                    }}>Best Sellers</Text>

                    <View style={{ flexDirection: 'row', columnGap: 10, alignContent: 'center' }}>
                        <TouchableOpacity>
                            <Image source={require('@/assets/filter.png')}
                                style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/Cart')}>
                            <Image source={require('@/assets/search.png')}
                                style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Shoes */}
                <View style={[{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: 100 * scaleH }, allShoes
                    ? { justifyContent: 'space-between' }
                    : { justifyContent: 'center' }
                ]}>
                    {/* Popular Shoes List */}
                    {allShoes.length > 0
                        ? allShoes.map((shoe, idx) => {
                            return (
                                <Pressable
                                    key={idx}
                                    onPress={() => goToDetailsTab(shoe)}
                                    style={styles.shoeCard}>
                                    {isImageLoading &&
                                        <ActivityIndicator style={{ position: 'absolute', left: '50%', top: '20%' }} />
                                    }
                                    <ExpoImage
                                        source={{ uri: shoe.shoe_image_url }}
                                        style={[styles.cardImage, { transform: [{ scale: shoe.scale }] }]}
                                        onLoadStart={() => setIsImageLoading(true)}
                                        onLoadEnd={() => setIsImageLoading(false)}
                                        onError={() => setIsImageLoading(false)}
                                        contentFit='contain'
                                    />
                                    {shoe.badge && (
                                        <Text style={styles.badge}>{shoe.badge}</Text>
                                    )}
                                    <Text style={styles.cardTitle}>{shoe.shoe_name}</Text>
                                    <Text style={styles.price}>{shoe.price}</Text>

                                    <TouchableOpacity onPress={() => handleAddToCart(shoe)} style={styles.addButton}>
                                        <Image source={require('@/assets/plus-icon.png')} />
                                    </TouchableOpacity>
                                </Pressable>
                            )
                        })
                        : <ActivityIndicator />
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SeeAllShoes

const styles = StyleSheet.create({
    shoeCard: {
        backgroundColor: "#FFFFFF",
        width: 157 * scaleW,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginTop: 16 * scaleH,
        paddingBottom: 10 * scaleH,
    },

    cardImage: {
        width: 125,
        height: 104
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
})