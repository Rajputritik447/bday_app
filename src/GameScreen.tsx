import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const HEART_SIZE = 60;
const HEART_COUNT = 15;
const WIN_SCORE = 10;

type HeartBubbleProps = {
  id: number;
  onPop: (id: number) => void;
  style: any;
};

const HeartBubble: React.FC<HeartBubbleProps> = ({ id, onPop, style }) => (
  <TouchableOpacity onPress={() => onPop(id)} style={[styles.heartTouchable, style]}>
    <Animated.View style={styles.heart}>
      <Text style={styles.heartText}>❤️</Text>
    </Animated.View>
  </TouchableOpacity>
);

type GameScreenProps = {
  onGameWin: () => void;
};

const GameScreen: React.FC<GameScreenProps> = ({ onGameWin }) => {
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<{ id: number }[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (score >= WIN_SCORE) {
      // Call the onGameWin prop to advance to the next step in App.tsx
      onGameWin();
    }
  }, [score]);

  const initializeGame = () => {
    setScore(0);
    const newHearts = Array.from({ length: HEART_COUNT }, (_, i) => ({ id: i }));
    setHearts(newHearts);

    newHearts.forEach((_, i) => {
      if (!animatedValues[i]) {
        animatedValues[i] = new Animated.Value(0);
      }
      startAnimation(i);
    });
  };

  const startAnimation = (i: number) => {
    animatedValues[i].setValue(0);
    Animated.timing(animatedValues[i], {
      toValue: 1,
      duration: 3000 + Math.random() * 2000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) startAnimation(i);
    });
  };

  const handlePop = (id: number) => {
    setScore(s => s + 1);
    animatedValues[id].stopAnimation();
    Animated.timing(animatedValues[id], { toValue: 2, duration: 200, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pop {WIN_SCORE} Hearts!</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      <View style={styles.gameArea}>
        {hearts.map((heart, i) => {
          const initialX = (width / (HEART_COUNT + 1)) * (i + 0.5);
          const translateY = animatedValues[i].interpolate({ inputRange: [0, 1], outputRange: [height, -HEART_SIZE] });
          const popScale = animatedValues[i].interpolate({ inputRange: [0, 1.9, 2], outputRange: [1, 1.5, 0] });

          return (
            <HeartBubble
              key={heart.id}
              id={heart.id}
              onPop={handlePop}
              style={{ position: 'absolute', left: initialX, transform: [{ translateY }, { scale: popScale }] }}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    color: '#f0f0f0',
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 22,
    color: '#e94560',
    marginTop: 5,
  },
  gameArea: {
    flex: 1,
    overflow: 'hidden',
  },
  heartTouchable: { width: HEART_SIZE, height: HEART_SIZE, alignItems: 'center', justifyContent: 'center' },
  heart: { width: HEART_SIZE, height: HEART_SIZE, alignItems: 'center', justifyContent: 'center' },
  heartText: { fontSize: HEART_SIZE * 0.7, textShadowColor: '#e94560', textShadowRadius: 10 },
});

export default GameScreen;