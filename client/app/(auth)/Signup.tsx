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
import useAuthPost from "@/hooks/useAuthPost";

const { width, height } = Dimensions.get('window')
const SCALE = width / 375;

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState('')

  const { data, mutateAsync, isPending, isError } = useAuthPost();

  const handleSubmit = async () => {
    const data = { name: name, email: email, password: password };
    const res = await mutateAsync({ endpoint: 'signup', data: data })
    const response = await res.json()
    console.log(response.message);

    setName('')
    setEmail("");
    setPassword("");
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Let’s Create Account Together</Text>

        {/* Full name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={[styles.input, focusedField === 'name' && styles.focusedField]}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
            value={name}
            onChangeText={setName}
            keyboardType="default"
            autoCapitalize="words"
          />
        </View>

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

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, focusedField === 'pass' && styles.focusedField, { flex: 1 }]}
              onFocus={() => setFocusedField('pass')}
              onBlur={() => setFocusedField('')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={23}
                color="#555"
              />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={handleSubmit} style={styles.signupButton}>
          <Text style={styles.signupText}>Sign In</Text>
        </Pressable>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}>
        <Text style={styles.footerText}>
          Already Have An Account?
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.signinText}> Sign In</Text>
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
    paddingBottom: 60
  },
  innerContainer: {
    width: "85%",
    maxWidth: width,
    marginTop: 60 * SCALE,
    // alignItems: "center",
    paddingTop: 60 * SCALE,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  title: {
    fontSize: 28 * SCALE,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16 * SCALE,
    color: "#8E8E8E",
    marginBottom: 35,
    textAlign: 'center'
  },
  inputContainer: {
    width: "100%",
    marginBottom: 25,
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  signupButton: {
    backgroundColor: "#5b9ee1",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#fff",
    fontSize: 15 * SCALE,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#ffffffbe",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#3833330c',
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  googleText: {
    color: "#000",
    fontSize: 14 * SCALE,
    fontWeight: "500",
  },
  footerText: {
    fontSize: 12 * SCALE,
    color: "#8E8E8E",
  },
  signinText: {
    color: 'black',
    fontWeight: "700",
  },
});
