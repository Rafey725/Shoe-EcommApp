import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Pressable, ImageSourcePropType } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image as ExpoImage } from 'expo-image'
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const SCALE = width / 375
const clamp = (v: number, min: number, max: number) => Math.min((Math.max(v, min), max))

interface SlideProps {
    onboard: number,
    imageSrc: ImageSourcePropType,
    zoomImg?: ImageSourcePropType,
    title: string;
    subtitle: string;
    buttonText: string;
    onPress: () => void;
}

const Onboarding: React.FC<SlideProps> = ({ onboard, imageSrc, zoomImg, title, subtitle, buttonText, onPress }) => {
    return (
        <LinearGradient
            colors={["#e7f2fb", "#FFFFFF"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.container}>

                <View style={{
                    // marginHorizontal: 20,
                    marginTop: 50,
                    position: 'relative',
                    zIndex: 50,
                    flex: 1,
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'space-evenly'
                }}>
                    {/* <View style={{ flex: 1, justifyContent: 'center' }}> */}
                    <View style={{ marginTop: 50 * SCALE, marginBottom: 80 * SCALE, backgroundColor: '' }}>
                        <View style={{
                            width: 16,
                            height: 16,
                            borderRadius: 50,
                            backgroundColor: '#A4CDF6',
                            position: 'absolute',
                            top: 10,
                            left: 35
                        }} />

                        <Text style={{ fontSize: 145 * SCALE, fontWeight: 'bold', color: '#9494940e', position: 'absolute', textAlign: 'center' }}>NIKE</Text>

                        <ExpoImage source={imageSrc} style={{
                            position: 'relative',
                            width: 320 * SCALE,
                            height: 200 * SCALE
                        }} transition={0} />

                        <ExpoImage source={zoomImg} style={{
                            position: 'absolute',
                            bottom: -45,
                            right: 30,
                            zIndex: 100,
                            width: 130 * SCALE,
                            height: 120 * SCALE
                        }} transition={0} />

                        <View style={{
                            width: 16,
                            height: 16,
                            borderRadius: 50,
                            backgroundColor: '#5594d3',
                            position: 'absolute',
                            bottom: -20,
                            right: 35
                        }} />
                        <View style={{
                            width: 16,
                            height: 16,
                            borderRadius: 50,
                            backgroundColor: '#5594d3',
                            position: 'absolute',
                            bottom: -60,
                            left: 35
                        }} />
                    </View>
                    {/* </View> */}

                    <View style={{}}>
                        <Text style={{ fontSize: 45 * SCALE, fontWeight: '600', lineHeight: 46 * SCALE }}>{title}</Text>
                        <Text style={{ fontSize: 19 * SCALE, fontWeight: '600', lineHeight: 28 * SCALE, marginTop: 15 }}>{subtitle}</Text>
                    </View>
                </View>

                {/* Bottom bar */}
                <View style={{
                    marginTop: 10 * SCALE,
                    marginBottom: 15 * SCALE,
                    maxWidth: 325 * SCALE,
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <View style={{ display: 'flex', flexDirection: 'row', columnGap: 3, }}>
                        <View style={[onboard === 1 ? { backgroundColor: '#5594d3', width: 30 } : { backgroundColor: '#E5EEF7', width: 8 }, { height: 5, borderRadius: 50 }]} />
                        <View style={[onboard === 2 ? { backgroundColor: '#5594d3', width: 30 } : { backgroundColor: '#E5EEF7', width: 8 }, { height: 5, borderRadius: 50 }]} />
                        <View style={[onboard === 3 ? { backgroundColor: '#5594d3', width: 30 } : { backgroundColor: '#E5EEF7', width: 8 }, { height: 5, borderRadius: 50 }]} />
                    </View>

                    <Pressable onPress={onPress} style={[
                        buttonText === 'Get Started' ? { width: 165 } : { width: 105 },
                        {
                            backgroundColor: '#5594d3',
                            borderRadius: 50,
                            height: 54,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }]}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{buttonText}</Text>
                    </Pressable>
                </View>

            </SafeAreaView>
        </LinearGradient>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
