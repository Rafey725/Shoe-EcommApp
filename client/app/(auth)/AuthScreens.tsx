import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Signin from '@/components/auth/Signin'
import Signup from '@/components/auth/Signup'
import RecoverPassword from '@/components/auth/RecoverPassword'

const AuthScreens = () => {
    const [mode, setMode] = useState<'signin' | 'signup' | 'recover'>('signin')

    return (
        <View>
            {mode === 'signin'
                ? <Signin onGoSignup={() => setMode('signup')} onGoRecovery={() => setMode('recover')} />
                : mode === 'signup'
                    ? <Signup onGoSignin={() => setMode('signin')} />
                    : <RecoverPassword onGoSignin={() => setMode('signin')} />
            }
        </View>
    )
}

export default AuthScreens

const styles = StyleSheet.create({})