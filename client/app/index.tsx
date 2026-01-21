import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import NikeLineLoader from '@/components/NikeLoader'

const index = () => {
    return (
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
            <NikeLineLoader />
        </View>
    )
}

export default index

const styles = StyleSheet.create({})