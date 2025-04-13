import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolate,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

interface CardDetailProps {
  card: {
    id: string;
    name: string;
    imageUrl: string;
  };
  onClose: () => void;
  cardPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function CardDetail({ card, onClose, cardPosition }: CardDetailProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const isVisible = useSharedValue(0);

  useEffect(() => {
    isVisible.value = withSpring(1, SPRING_CONFIG);
  }, []);

  const handleClose = () => {
    isVisible.value = withSpring(0, SPRING_CONFIG, () => {
      runOnJS(onClose)();
    });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -windowHeight * 0.7);
    })
    .onEnd(() => {
      const shouldSnap = translateY.value < -windowHeight * 0.3;
      translateY.value = withSpring(
        shouldSnap ? -windowHeight * 0.7 : 0,
        SPRING_CONFIG
      );
    });

  const closeGesture = Gesture.Tap().onEnd(() => {
    runOnJS(handleClose)();
  });

  const rDetailsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [-windowHeight * 0.7, 0],
      [0.7, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const rOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-windowHeight * 0.7, 0],
      [0.8, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: interpolate(
        isVisible.value,
        [0, 1],
        [0, opacity],
        Extrapolate.CLAMP
      ),
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: isVisible.value,
      transform: [
        {
          scale: interpolate(
            isVisible.value,
            [0, 1],
            [0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, rContainerStyle]}>
      <Animated.View style={[styles.overlay, rOverlayStyle]} />
      
      <View style={styles.header}>
        <GestureDetector gesture={closeGesture}>
          <View style={styles.closeButton}>
            <X color="#fff" size={24} />
          </View>
        </GestureDetector>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.imageContainer, rImageStyle]}>
          <Image
            source={{ uri: card.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
            pointerEvents="none"
          />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.detailsContainer, rDetailsStyle]}>
            <View style={styles.handle} />
            <View style={styles.details}>
              <Text style={styles.name}>{card.name}</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Rarity</Text>
                  <Text style={styles.statValue}>Mythic Rare</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Set</Text>
                  <Text style={styles.statValue}>Alpha</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Price</Text>
                  <Text style={styles.statValue}>$250,000</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '70%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  details: {
    gap: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});