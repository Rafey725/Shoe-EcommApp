import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { Ionicons } from '@expo/vector-icons';
import { blueThemeColor } from '@/constants/themeColors';

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const Profile = () => {
    const router = useRouter()
    const user = useSelector((state: RootState) => state.userData)

    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState('jjekjrf')
    const [focusedField, setFocusedField] = useState('')
    const [editing, setEditing] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', }} edges={['top']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image source={require('@/assets/arrow-icon.png')} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Profile</Text>

                    <Pressable onPress={() => setEditing(p => !p)}>
                        <Image source={require('@/assets/edit-pencil.png')} resizeMode='contain' />
                    </Pressable>
                </View>

                {/* Profile picture */}
                <View style={{
                    marginTop: 20 * scaleH,
                    alignItems: 'center'
                }}>
                    <Image
                        source={user.profile_url ? { uri: user.profile_url } : require('@/assets/profile-image.png')}
                        style={{
                            width: 90 * scaleW,
                            height: 90 * scaleH,
                            borderRadius: 500,
                            backgroundColor: 'white',
                            marginBottom: 10 * scaleH
                        }} />
                    <View style={{ width: '100%', height: 7, alignItems: 'center' }}>
                        <Image source={require('@/assets/edit-icon.png')} style={{ position: 'absolute', top: -30, zIndex: 10 }} />
                    </View>
                    <Text style={{ marginBottom: 25, fontSize: 20, fontWeight: '600' }}>{user.name}</Text>
                </View>

                {/* Full Name */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={[styles.input, focusedField === 'name' && styles.focusedField, editing ? { borderColor: '#3833330c', color: 'black' } : {
                            borderColor: '#ffffffbe', color: '#00000085'
                        }]}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        value={name}
                        onChangeText={setName}
                        keyboardType="default"
                        autoCapitalize="words"
                        editable={editing ? true : false}
                    />
                </View>

                {/* Email address */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, focusedField === 'email' && styles.focusedField, editing ? { borderColor: '#3833330c', color: 'black' } : {
                            borderColor: '#ffffffbe', color: '#00000085'
                        }]}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={editing ? true : false}
                    />
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, focusedField === 'pass' && styles.focusedField, editing ? { borderColor: '#3833330c', color: 'black' } : {
                                borderColor: '#ffffffbe', color: '#00000085'
                            }, { flex: 1 }]}
                            onFocus={() => setFocusedField('pass')}
                            onBlur={() => setFocusedField('')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            editable={editing ? true : false}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingVertical: 20 * scaleH,
        paddingHorizontal: 20 * scaleW
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTitle: {
        fontSize: 16,
        marginRight: 12,
        fontWeight: '600'
    },
    inputContainer: {
        width: "100%",
        marginBottom: 25,
    },
    label: {
        fontSize: 16 * scaleH,
        fontWeight: "600",
        color: "#222",
        marginBottom: 8,
        marginLeft: 7
    },
    input: {
        backgroundColor: "white",
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16 * scaleH,
        borderWidth: 2,
        borderColor: 'white',
        elevation: 0,
    },
    focusedField: {
        borderColor: blueThemeColor,
    },
    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
    },
})