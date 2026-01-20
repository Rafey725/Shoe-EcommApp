import React, { Dispatch, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window')
const SCALE = width / 375;

export default function RecoverPassword({ onGoSignin }: { onGoSignin: () => void }) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedField, setFocusedField] = useState('')

    const handleSubmit = () => {
        console.log(email);
        console.log(password);
        setEmail("");
        setPassword("");
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={onGoSignin}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.title}>Recover Password</Text>
                <Text style={styles.subtitle}>Please Enter Your Email Address To Recieve a Verification Code</Text>

                {/* Email address */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, focusedField === 'email' && styles.focusedField]}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <Pressable onPress={handleSubmit} style={styles.recoverPassButton}>
                    <Text style={styles.recoverPassText}>Continue</Text>
                </Pressable>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: "#f8f9fa",
        alignItems: "center",
        justifyContent: 'space-between',
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
