
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');
const NUM_HEARTS = 40;
const HEART_SIZE = 20;
const BIG_HEART_RADIUS = width * 0.4;

// Parametric equation for a cardioid (a heart shape)
const getHeartPoint = (t) => {
  const x = BIG_HEART_RADIUS * (16 * Math.pow(Math.sin(t), 3));
  const y = -BIG_HEART_RADIUS * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x + width / 2, y: y + height / 2.5 };
};

const HeartParticle = ({ style }) => <Animated.Text style={[styles.heart, style]}>❤️</Animated.Text>;

const HeartFormationScreen = ({ onPlayAgain }) => {
  const heartAnims = useRef([...Array(NUM_HEARTS)].map(() => new Animated.ValueXY({ x: 0, y: 0 }))).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = heartAnims.map((anim, i) => {
      const randomStartX = Math.random() * width;
      const randomStartY = Math.random() * height;
      anim.setValue({ x: randomStartX, y: randomStartY });

      const t = (i / NUM_HEARTS) * 2 * Math.PI;
      const finalPos = getHeartPoint(t);

      return Animated.timing(anim, {
        toValue: finalPos,
        duration: 2500,
        delay: 500,
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start(() => {
      // After hearts form, fade in the name and then the button
      Animated.sequence([
        Animated.timing(textAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(buttonAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {heartAnims.map((anim, i) => (
        <HeartParticle key={i} style={{ transform: [{ translateX: anim.x }, { translateY: anim.y }] }} />
      ))}
      <Animated.View style={[styles.centerContent, { opacity: textAnim }]}>
        <Text style={styles.nameText}>SHREYA</Text>
        <Text style={styles.birthdayText}>Happy Birthday!</Text>
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, { opacity: buttonAnim }]}>
        <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </Animated.View>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} autoStart={true} fadeOut={true} autoStartDelay={3000} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  heart: { position: 'absolute', fontSize: HEART_SIZE, color: '#e94560', textShadowColor: '#e94560', textShadowRadius: 10 },
  centerContent: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  nameText: { fontSize: 64, fontWeight: 'bold', color: '#f0f0f0', textShadowColor: '#fff', textShadowRadius: 20 },
  birthdayText: { fontSize: 24, color: '#f0f0f0', marginTop: 10 },
  buttonContainer: { position: 'absolute', bottom: 80, alignSelf: 'center' },
  button: { backgroundColor: '#e94560', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30 },
  buttonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
});

export default HeartFormationScreen;
