import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React, { FC, useCallback } from "react";
import { StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ColorPickerProps = LinearGradientProps & {
  colors: string[];
  maxWidth: number;
  onColorChanged?: (color: string | number) => void;
};

const CIRCLE_PICKER_SIZE = 45;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

const ColorPicker: FC<ColorPickerProps> = ({
  maxWidth,
  colors,
  onColorChanged,
  ...props
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const ajustedTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      maxWidth - CIRCLE_PICKER_SIZE
    );
  });

  const onEnd = useCallback(() => {
    "worklet";
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
  }, []);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_, context) => {
      context.x = ajustedTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd,
  });

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (event) => {
        translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
        scale.value = withSpring(1.2);
        translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
      },
      onEnd,
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: ajustedTranslateX.value },
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const outputRange = colors.map(
      (_, index) => (index / colors.length) * maxWidth
    );
    const backgroundColor = interpolateColor(
      translateX.value,
      outputRange,
      colors
    );
    onColorChanged?.(backgroundColor);
    return {
      backgroundColor,
    };
  });

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={{ justifyContent: "center" }}>
            <LinearGradient colors={colors} {...props} />
            <Animated.View style={[styles.picker, rStyle]}>
              <Animated.View
                style={[styles.internalPicker, rInternalPickerStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  picker: {
    position: "absolute",
    backgroundColor: "#fff",
    height: CIRCLE_PICKER_SIZE,
    width: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  internalPicker: {
    height: INTERNAL_PICKER_SIZE,
    width: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
});

export default ColorPicker;
