import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window')
const SCALE = width / 375;

const NewPasswordScreen = () => {
    const router = useRouter();

    const [newPass, setNewPass] = useState('')
    const [focusedField, setFocusedField] = useState('')

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter new password for your email</Text>

                {/* New Password */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={[styles.input, focusedField === 'pass' && styles.focusedField]}
                        onFocus={() => setFocusedField('pass')}
                        onBlur={() => setFocusedField('')}
                        value={newPass}
                        onChangeText={setNewPass}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <Pressable style={styles.recoverPassButton}>
                    <Text style={styles.recoverPassText}>Continue</Text>
                </Pressable>

            </View>
        </ScrollView>
    )
}

export default NewPasswordScreen

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: "#f8f9fa",
        alignItems: "center",
        paddingBottom: 50
    },
    innerContainer: {
        width: "85%",
        maxWidth: width,
        marginTop: 60 * SCALE,
        alignItems: "center",
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 35,
    },
    title: {
        fontSize: 28 * SCALE * SCALE,
        fontWeight: "700",
        color: "#111",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16 * SCALE,
        color: "#8E8E8E",
        marginBottom: 35,
        textAlign: 'center'
    },
    inputContainer: {
        width: "100%",
        marginBottom: 25 * SCALE,
    },
    label: {
        fontSize: 13 * SCALE,
        fontWeight: "500",
        color: "#222",
        marginBottom: 8,
        marginLeft: 7
    },
    errorMsgCont: {
        backgroundColor: "#FDECEC",   // light red
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#F5A3A3",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    errorMsgText: {
        flex: 1,
        fontSize: 13 * SCALE,
        lineHeight: 18,
        color: "#B42318",
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#ffffffbe",
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14 * SCALE,
        borderWidth: 2,
        borderColor: '#3833330c',
        elevation: 0,
    },
    focusedField: {
        borderColor: '#5b9ee1',
    },
    recoverPassButton: {
        backgroundColor: "#5b9ee1",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 20,
    },
    googleIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    recoverPassText: {
        color: 'white',
        fontSize: 18 * SCALE
    }
});
