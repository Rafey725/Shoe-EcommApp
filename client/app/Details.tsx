
import { blueThemeColor, grayText } from '@/constants/themeColors'
import { RootState } from '@/Redux/store'
import { Image as ExpoImage } from 'expo-image'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ImageSourcePropType,
    ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const sizes = [38, 39, 40, 41, 42, 43]

const galleryImages: any = [
    require('@/assets/Popular-Shoes/nike-air-max.png'),
    require('@/assets/Popular-Shoes/nike-jordan.png'),
    require('@/assets/Popular-Shoes/nike-air-jordan.png'),
]

export default function Details() {
    const { badge, shoeName, price, desc, shoeImage, scale } = useSelector((state: RootState) => state.shoesDetail.detail)
    const [selectedSize, setSelectedSize] = useState<number>(40)
    const [isImageLoading, setIsImageLoading] = useState(true)

    console.log(shoeName, scale);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', }} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image source={require('@/assets/arrow-icon.png')} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Men’s Shoes</Text>

                    <TouchableOpacity onPress={() => router.push('/Cart')}>
                        <Image source={require('@/assets/my-cart.png')}
                            style={{ width: 35, height: 35, transform: [{ scale: 1.3 }] }} />
                    </TouchableOpacity>
                </View>

                {/* Shoe Image */}
                <View style={styles.imageWrapper}>
                    {isImageLoading &&
                        <ActivityIndicator style={{ position: 'absolute', left: '45%', top: '20%' }} />
                    }
                    <ExpoImage
                        source={shoeImage}
                        style={[styles.mainImage, { transform: [{ scale: scale }] }]}
                        onLoadStart={() => setIsImageLoading(true)}
                        onLoadEnd={() => setIsImageLoading(false)}
                        onError={() => setIsImageLoading(false)}
                        contentFit='contain'
                    />

                    {/* Slider Indicator */}
                    <Image source={require('@/assets/shoe-frame.png')} style={{
                        width: '75%', transform: [{ translateY: -40 * scaleH }]
                    }}
                        resizeMode='contain'
                    />
                </View>

                {/* Content Card */}
                <View style={styles.card}>
                    <Text style={styles.bestSeller}>{badge}</Text>

                    <Text style={styles.title}>{shoeName}</Text>

                    <Text style={styles.oldPrice}>{price}</Text>

                    <Text style={styles.description}>{desc}</Text>

                    {/* Gallery */}
                    <Text style={styles.sectionTitle}>Gallery</Text>
                    <View style={styles.gallery}>
                        {galleryImages.map((img: ImageSourcePropType, index: number) => (
                            <View key={index} style={styles.galleryItem}>
                                <Image source={img} style={styles.galleryImage} />
                            </View>
                        ))}
                    </View>

                    {/* Size */}
                    <View style={styles.sizeHeader}>
                        <Text style={styles.sectionTitle}>Size</Text>
                        <Text style={styles.sizeType}>EU   US   UK</Text>
                    </View>

                    <View style={styles.sizeRow}>
                        {sizes.map(size => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedSize(size)}
                                style={[
                                    styles.sizeBox,
                                    selectedSize === size && styles.sizeBoxActive
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.sizeText,
                                        selectedSize === size && styles.sizeTextActive
                                    ]}
                                >
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Bottom Bar */}
                    <View style={styles.bottomRow}>
                        <View>
                            <Text style={styles.priceLabel}>Price</Text>
                            <Text style={styles.price}>{price}</Text>
                        </View>

                        <TouchableOpacity style={styles.addBtn}>
                            <Text style={styles.addBtnText}>Add To Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        // height: height,
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingVertical: 20 * scaleH
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20 * scaleW,
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '600'
    },

    imageWrapper: {
        alignItems: 'center',
        marginTop: 40 * scaleH
    },

    mainImage: {
        width: 233,
        aspectRatio: 1.8
    },

    slider: {
        transform: [
            { translateY: 20 }
        ],
        alignItems: 'center',
        justifyContent: 'center'
    },

    sliderLine: {
        width: width * 0.7,
        height: 2,
        backgroundColor: '#CDE2FF',
        borderRadius: 1
    },

    sliderDot: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4A90E2',
        alignItems: 'center',
        justifyContent: 'center'
    },

    sliderArrow: {
        color: '#FFF',
        fontSize: 18
    },

    card: {
        height: height,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20 * scaleW,
        paddingVertical: 18 * scaleH,
        transform: [
            { translateY: -10 * scaleH }
        ]
    },

    bestSeller: {
        color: blueThemeColor,
        fontSize: 12,
        fontWeight: '600'
    },

    title: {
        fontSize: 24 * scaleH,
        fontWeight: '600',
        marginTop: 3
    },

    oldPrice: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 4
    },

    description: {
        fontSize: 14,
        color: grayText,
        marginTop: 6,
        lineHeight: 20,
        width: '90%'
    },

    sectionTitle: {
        fontSize: 18 * scaleH,
        fontWeight: '600',
        marginTop: 10
    },

    gallery: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12
    },

    galleryItem: {
        width: 46,
        height: 46,
        backgroundColor: '#F4F4F4',
        borderRadius: 16,
        alignItems: 'flex-end'
    },

    galleryImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },

    sizeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    sizeType: {
        fontSize: 12,
        color: grayText
    },

    sizeRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14
    },

    sizeBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F1F1',
        alignItems: 'center',
        justifyContent: 'center'
    },

    sizeBoxActive: {
        backgroundColor: blueThemeColor
    },

    sizeText: {
        fontSize: 14,
        color: '#555'
    },

    sizeTextActive: {
        color: '#FFF',
        fontWeight: '600'
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 45 * scaleH,
    },

    priceLabel: {
        fontSize: 14,
        color: grayText
    },

    price: {
        fontSize: 20,
        fontWeight: '700'
    },

    addBtn: {
        backgroundColor: blueThemeColor,
        paddingHorizontal: 28 * scaleW,
        paddingVertical: 12 * scaleH,
        borderRadius: 30
    },

    addBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600'
    }
})
