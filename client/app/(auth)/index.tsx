import React, { Dispatch, useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import useGetMe from "@/hooks/useGetMe";
import useAuthPost from "@/hooks/useAuthPost";
// import {* as SecureStore} from 'expo-secure-store';
import * as SecureStore from 'expo-secure-store'
import { useDispatch } from "react-redux";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import useGoogleAuth from "@/hooks/useGoogleAuth";

const { width, height } = Dimensions.get('window')
const SCALE = width / 375;

export default function Signin() {

  // Configure google sign in
  GoogleSignin.configure({
    webClientId: '131468131675-a4mpdaplunden2pdkbm4p02mrp9oajjl.apps.googleusercontent.com',
  })

  const router = useRouter();
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState('')
  const [error, setError] = useState('')

  const { data, mutateAsync: loginMutateAsync, isPending, isError } = useAuthPost();
  const { mutateAsync: googleMutateAsync } = useGoogleAuth()

  // const [userInfo, setUserInfo] = useState<any>(null)

  const handleSubmit = async () => {
    try {
      const res = await loginMutateAsync({ endpoint: 'login', data: { email: email, password: password } })
      const data = await res.json()

      if (data.token) {
        SecureStore.setItemAsync('token', data.token)
        console.log('Token stored');
      }

      console.log(data.message);
      if (res.status === 401) { return setError('Invalid email or password') }
      else { setError('') }
      setEmail("");
      setPassword("");
      router.replace('/Home')
    } catch (err) {
      console.log('Something is wrong', err);
    }
  }

  const handeGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signOut()
      const res = await GoogleSignin.signIn()
      if (isSuccessResponse(res)) {
        const response = await googleMutateAsync({ endpoint: 'google_signin', idToken: res.data.idToken })
        const data = await response.json()
        console.log(data.message);

        console.log(res.data.user.photo);
        
        if (data.token) {
          SecureStore.setItemAsync('token', data.token)
          console.log('Token stored');
        }

        if (response.status === 401) { return setError('Invalid email or password') }
        else { setError('') }
        
        router.replace('/Home')
      } else {
        console.log('Sign in is cancelled by user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.log("ERROR CODE:", error.code);
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign in is in progress")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Play services not available")
            break;
          default:
        }
      } else {
        Alert.alert("An error that's not related to google sign in occurred")
      }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>

        <Text style={styles.title}>Hello Again!</Text>
        <Text style={styles.subtitle}>Welcome Back You’ve Been Missed!</Text>

        {/* Email address */}
        <View style={[styles.inputContainer, { marginBottom: 25, }]}>
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
          <Pressable onPress={() => router.push('/recover/')}>
            <Text style={styles.recoveryText}>Recover Password</Text>
          </Pressable>
        </View>

        {/* Error message */}
        {error &&
          <View style={[styles.errorMsgCont, {}]}>
            <Text style={[styles.errorMsgText]}>{error}</Text>
          </View>
        }

        {/* Sign in button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.signinButton}>
          <Text style={styles.signinText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign in with google button */}
        <TouchableOpacity onPress={handeGoogleSignin} style={styles.googleButton}>
          <Image
            source={require('@/assets/google-logo.png')}
            style={styles.googleIcon}
          />

          <Text style={styles.googleText}>Sign in with google</Text>
        </TouchableOpacity>

      </View>
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}>
        <Text style={styles.footerText}>
          Don’t Have An Account?
        </Text>
        <Pressable onPress={() => router.push('/Signup')}>
          <Text style={styles.signupForFreeText}> Sign Up For Free</Text>
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
    paddingBottom: 60 * SCALE
  },
  innerContainer: {
    width: "85%",
    maxWidth: width,
    marginTop: 60 * SCALE,
    // alignItems: "center",
    paddingTop: 60 * SCALE,
  },
  title: {
    fontSize: 28 * SCALE,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6 * SCALE,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16 * SCALE,
    color: "#8E8E8E",
    marginBottom: 35 * SCALE,
    textAlign: 'center'
  },
  inputContainer: {
    width: "100%",
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
  focusedField: {
    borderColor: '#5b9ee1',
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  recoveryText: {
    alignSelf: "flex-end",
    marginTop: 10,
    fontSize: 14 * SCALE,
    color: "#A1A1A1",
  },
  signinButton: {
    backgroundColor: "#5b9ee1",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
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
    color: 'white',
    fontSize: 18 * SCALE
  },
  signupForFreeText: {
    color: 'black',
    fontWeight: "700",
    fontSize: 14 * SCALE
  },
});
