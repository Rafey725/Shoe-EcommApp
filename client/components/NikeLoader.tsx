// components/NikeLineLoader.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";

type NikeLineLoaderProps = {
    width?: number; // line width
    color?: string;
    background?: string; // set to "#fff" for white
    style?: ViewStyle;
};

export default function NikeLineLoader({
    width = 140,
    color = "#5b9ee1",
    background = "#FFFFFF",
    style,
}: NikeLineLoaderProps) {
    const p = useRef(new Animated.Value(0)).current;
    const animRef = useRef<Animated.CompositeAnimation | null>(null);

    const dims = useMemo(() => {
        const h = Math.max(2, Math.round(width * 0.02)); // 2–4px
        const r = 999;
        return { h, r };
    }, [width]);

    useEffect(() => {
        p.setValue(0);

        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(p, {
                    toValue: 1,
                    duration: 520,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(p, {
                    toValue: 0,
                    duration: 520,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
            { resetBeforeIteration: true }
        );

        animRef.current = loop;
        loop.start();

        return () => {
            animRef.current?.stop();
            animRef.current = null;
        };
    }, [p]);

    const scaleX = p.interpolate({
        inputRange: [0, 1],
        outputRange: [0.08, 1],
    });

    const opacity = p.interpolate({
        inputRange: [0, 0.35, 1],
        outputRange: [0.35, 0.65, 1],
    });

    const microX = p.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [-2, 2, -2],
    });

    return (
        <View
            style={[
                styles.wrapper,
                { backgroundColor: background, width: width * 1.25, height: Math.max(28, dims.h * 10) },
                style,
            ]}
            accessibilityRole="progressbar"
            accessible
        >
            <View style={[styles.track, { width, height: dims.h, borderRadius: dims.r }]} />
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width,
                        height: dims.h,
                        borderRadius: dims.r,
                        backgroundColor: color,
                        opacity,
                        transform: [{ translateX: microX as any }, { scaleX: scaleX as any }],
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    track: {
        backgroundColor: "#0B0B0D",
        opacity: 0.12,
    },
    bar: {
        position: "absolute",
    },
});
