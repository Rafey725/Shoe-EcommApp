import useRequestOTP from '@/hooks/useRequestOTP';
import useVerifyOTP from '@/hooks/useVerifyOTP';
import { RootState } from '@/Redux/store';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    ScrollView,
    Pressable,
    TouchableOpacity,
} from 'react-native'
import { useSelector } from 'react-redux';

const OTP_LENGTH = 6

const { width, height } = Dimensions.get('window')
const scaleW = width / 375;
const scaleH = height / 802;

const OtpScreen: React.FC = () => {
    const router = useRouter()
    const { recoveryEmail } = useSelector((state: RootState) => state.recoveryEmail)
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
    const [activeIndex, setActiveIndex] = useState(0)
    const inputsRef = useRef<Array<TextInput | null>>([])

    const { data, mutateAsync: resendOtp } = useRequestOTP()
    const { mutateAsync: verifyOtp } = useVerifyOTP()

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus()
            setActiveIndex(index + 1)
        }
    }

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus()
            setActiveIndex(index - 1)
        }
    }

    // Send otp
    useEffect(() => {
        resendOtp(recoveryEmail).then((res) => {
            console.log(res.message);
        })
    }, [])

    // Resend otp
    const resendOTP = async () => {
        await resendOtp(recoveryEmail)
        setOtp(Array(OTP_LENGTH).fill(''))
        inputsRef.current[0]?.focus()
    }

    // Verify otp
    const handleOTPSubmit = async () => {
        const res = await verifyOtp({ email: recoveryEmail, otp: otp.join('') })
        const data = await res.json()

        console.log(res.status, data.message);

        if (res.status === 200) {
            await SecureStore.setItemAsync('resetToken', data.resetToken)
            router.push('/recover/newPassword')
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Enter Verification Code</Text>
                <Text style={styles.subtitle}>Please Enter a Verification Code sent to{' '}
                    <Text style={{ fontWeight: '700' }}>{recoveryEmail}</Text>
                </Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputsRef.current[index] = ref)}
                            value={digit}
                            onChangeText={(value) => handleChange(value, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleKeyPress(nativeEvent.key, index)
                            }
                            keyboardType="number-pad"
                            maxLength={1}
                            style={[
                                styles.input,
                                activeIndex === index && styles.activeInput,
                            ]}
                            onFocus={() => setActiveIndex(index)}
                        />
                    ))}
                </View>
                <Pressable onPress={resendOTP} style={{ display: 'flex', width: '100%', alignItems: 'flex-end', marginTop: 10 }}>
                    <Text style={[styles.subtitle, { fontWeight: '700', marginRight: 10 }]}>Resend otp</Text>
                </Pressable>

                <TouchableOpacity onPress={handleOTPSubmit} style={styles.submitBtn}>
                    <Text style={styles.submitText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default OtpScreen

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: "#f8f9fa",
        alignItems: "center",
        paddingBottom: 50
    },
    innerContainer: {
        width: "90%",
        maxWidth: width,
        marginTop: 60 * scaleH,
        paddingTop: 60 * scaleH,
        alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 24 * scaleW,
    },
    title: {
        fontSize: 28 * scaleW,
        fontWeight: "700",
        color: "#111",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16 * scaleW,
        color: "#8E8E8E",
        marginBottom: 5,
        textAlign: 'center'
    },
    otpContainer: {
        marginTop: 20 * scaleH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    input: {
        width: 50 * scaleW,
        height: 60 * scaleH,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#ddd',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    activeInput: {
        borderColor: '#5b9ee1',
    },
    submitText: {
        color: 'white',
        fontSize: 18 * scaleW
    },
    submitBtn: {
        backgroundColor: "#5b9ee1",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 30,
    }
})
