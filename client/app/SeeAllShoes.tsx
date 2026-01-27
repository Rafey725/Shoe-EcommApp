import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const SeeAllShoes = () => {
    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', }} edges={['top']}>
            <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa', paddingVertical: 20 * scaleH }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20 * scaleW,
                }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image source={require('@/assets/arrow-icon.png')} />
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600'
                    }}>Best Sellers</Text>

                    <View style={{ flexDirection: 'row', columnGap: 10, alignContent: 'center' }}>
                        <TouchableOpacity onPress={() => router.push('/Cart')}>
                            <Image source={require('@/assets/filter.png')}
                                style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/Cart')}>
                            <Image source={require('@/assets/search.png')}
                                style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SeeAllShoes

const styles = StyleSheet.create({})