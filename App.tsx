import { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ColorPicker from "./components/ColorPicker";

const { width } = Dimensions.get("window");
const PICKER_WIDTH = width * 0.9;
const CIRCLE_SIZE = width * 0.8;

const COLORS = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];

export default function App() {
  const pickedColor = useSharedValue<string | number>(COLORS[0]);

  const onColorChanged = useCallback((color: string | number) => {
    "worklet";
    pickedColor.value = color;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, rStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          maxWidth={PICKER_WIDTH}
          colors={COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          onColorChanged={onColorChanged}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    height: 50,
    width: PICKER_WIDTH,
    borderRadius: PICKER_WIDTH / 2,
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});
