import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import OnboardingScreen from '@/components/Onboarding'
import { useRouter } from 'expo-router'

const SplashScreens = () => {
    const router = useRouter();
    const [onboardingScreen, setOnboardingScreen] = useState(1)

    const onBoardingShoeImages = [
        require('../../assets/shoe-image-1.png'),
        require('../../assets/shoe-image-2.png'),
        require('../../assets/shoe-image-3.png'),
        require('../../assets/shoe-zoom-image-1.png'),
    ];

    useEffect(() => {

    }, [])


    return (
        <>
            {onboardingScreen === 1
                ? <OnboardingScreen
                    imageSrc={onBoardingShoeImages[0]}
                    zoomImg={onBoardingShoeImages[3]}
                    onboard={onboardingScreen}
                    title='Follow Latest Style Shoes'
                    subtitle='There Are Many Beautiful And Attractive Plants To Your Room'
                    buttonText='Next'
                    onPress={() => setOnboardingScreen(p => p + 1)}
                />
                : onboardingScreen === 2
                    ? <OnboardingScreen
                        imageSrc={onBoardingShoeImages[1]}
                        onboard={onboardingScreen}
                        title='Summer Shoes Nike 2022'
                        subtitle='Amet Minim Lit Nodeseru Saku Nandu sit Alique Dolor'
                        buttonText='Next'
                        onPress={() => setOnboardingScreen(p => p + 1)}
                    />
                    : <OnboardingScreen
                        imageSrc={onBoardingShoeImages[2]}
                        onboard={onboardingScreen}
                        title='Start Journey With Nike'
                        subtitle='Smart, Gorgeous & Fashionable Collection'
                        buttonText='Get Started'
                        onPress={() => router.replace('/(auth)/AuthScreens')}
                    />
            }
        </>
    )
}

export default SplashScreens

const styles = StyleSheet.create({})