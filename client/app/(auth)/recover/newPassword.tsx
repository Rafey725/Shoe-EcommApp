import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'
import usePasswordReset from '@/hooks/usePasswordReset';
import NikeLineLoader from '@/components/NikeLoader';

const { width, height } = Dimensions.get('window')
const SCALE = width / 375;

const NewPasswordScreen = () => {
    const router = useRouter();

    const [newPass, setNewPass] = useState('')
    const [focusedField, setFocusedField] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showNewPass, setShowNewPass] = useState(false)

    const { mutateAsync } = usePasswordReset()

    const handlePasswordReset = async (password: string) => {
        setIsLoading(true)
        const resetToken = await SecureStore.getItemAsync('resetToken');
        const res = await mutateAsync({ resetToken: resetToken, newPass: password })
        const data = await res.json()
        console.log(data.message);
        setError('')

        if (res.status === 401) {
            setError('Invalid Token')
            return setIsLoading(false)
        }

        if (res.status === 200) {
            await SecureStore.deleteItemAsync('resetToken')
            await SecureStore.setItemAsync('token', data.token)
            router.replace('/Home')
            setIsLoading(false)
        }
    }

    return (
        <>
            {
                isLoading && (
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
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[styles.input, focusedField === 'pass' && styles.focusedField, { flex: 1 }]}
                                onFocus={() => setFocusedField('pass')}
                                onBlur={() => setFocusedField('')}
                                value={newPass}
                                onChangeText={setNewPass}
                                secureTextEntry={!showNewPass}
                            />
                            <Pressable
                                onPress={() => setShowNewPass(!showNewPass)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showNewPass ? "eye-off-outline" : "eye-outline"}
                                    size={23}
                                    color="#555"
                                />
                            </Pressable>
                        </View>
                    </View>

                    {/* Error message */}
                    {error &&
                        <View style={[styles.errorMsgCont, {}]}>
                            <Text style={[styles.errorMsgText]}>{error}</Text>
                        </View>
                    }

                    <Pressable onPress={() => handlePasswordReset(newPass)} style={styles.recoverPassButton}>
                        <Text style={styles.recoverPassText}>Continue</Text>
                    </Pressable>

                </View>
            </ScrollView>
        </>
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
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center"
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
    eyeIcon: {
        position: "absolute",
        right: 15,
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
