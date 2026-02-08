
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const NUM_HEARTS = 15;

const Heart = ({ style }) => {
  return <Animated.Text style={[styles.heart, style]}>❤️</Animated.Text>;
};

const Firecracker = ({ style }) => {
  return <Animated.Text style={[styles.firecracker, style]}>💥</Animated.Text>;
};

const FirecrackerAnimation = () => {
  const firecrackerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(firecrackerAnim, {
          toValue: 1,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(firecrackerAnim, {
          toValue: 0,
          duration: 500 + Math.random() * 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [firecrackerAnim]);

  const style = {
    left: Math.random() * width,
    top: Math.random() * height,
    opacity: firecrackerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        scale: firecrackerAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1.5, 0.5],
        }),
      },
    ],
  };
  return <Firecracker style={style} />;
};

interface HomeScreenProps {
  onStartPress: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartPress }) => {
  const heartAnimations = useRef([...Array(NUM_HEARTS)].map(() => new Animated.Value(0))).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [showFirecrackers, setShowFirecrackers] = useState(false);
  const [showTapToStartButton, setShowTapToStartButton] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Define the actual birthday
  const ACTUAL_BIRTHDAY_MONTH = 8; // September (0-indexed)
  const ACTUAL_BIRTHDAY_DAY = 21; 
  const ACTUAL_BIRTHDAY_HOUR = 0; // 9 PM
  const ACTUAL_BIRTHDAY_MINUTE = 0; // 36 minutes

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`Current Time: ${hours}:${minutes}:${seconds}`);

      const currentYear = now.getFullYear();

      const birthdayThisYear = new Date(currentYear, ACTUAL_BIRTHDAY_MONTH, ACTUAL_BIRTHDAY_DAY, ACTUAL_BIRTHDAY_HOUR, ACTUAL_BIRTHDAY_MINUTE, 0, 0);

      const birthdayNextYear = new Date(currentYear + 1, ACTUAL_BIRTHDAY_MONTH, ACTUAL_BIRTHDAY_DAY, ACTUAL_BIRTHDAY_HOUR, ACTUAL_BIRTHDAY_MINUTE, 0, 0);

      let targetDate = birthdayThisYear;
      let isEventTimePassed = false;

      // Check if the event time for this year's birthday has passed
      if (now.getTime() >= birthdayThisYear.getTime()) {
        isEventTimePassed = true;
      }

      // If the event time for this year's birthday has passed, target next year's birthday
      if (isEventTimePassed) {
        targetDate = birthdayNextYear;
      }

      const timeUntilTarget = targetDate.getTime() - now.getTime();

      // Check if it's the actual birthday date
      const isTodayBirthday = (now.getDate() === ACTUAL_BIRTHDAY_DAY && now.getMonth() === ACTUAL_BIRTHDAY_MONTH);

      if (isTodayBirthday && isEventTimePassed) { // It's the birthday and past the specified time
        setIsBirthday(true);
        setShowFirecrackers(true);
        setShowTapToStartButton(true);
        setCountdown('Happy Birthday! Siyu 🎉🎂');
      } else if (timeUntilTarget > 0) { // Countdown to birthday or specified time of birthday
        setIsBirthday(isTodayBirthday); // Set isBirthday only if it's the actual date
        setShowFirecrackers(false);
        setShowTapToStartButton(false);

        const days = Math.floor(timeUntilTarget / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeUntilTarget % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeUntilTarget % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((timeUntilTarget % (1000 * 60)) / 1000);

        let countdownString = '';
        if (days > 0) {
          countdownString += `${days}d `;
        }
        countdownString += `${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`;

        setCountdown(`Birthday: ${countdownString}`);

        // Special case: if it's the birthday, but not yet the specified time
        if (isTodayBirthday) {
          setCountdown(`Time until ${ACTUAL_BIRTHDAY_HOUR}:${ACTUAL_BIRTHDAY_MINUTE} PM: ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`);
        }

      } else { // Birthday has passed for this year and it's not the birthday anymore
        setIsBirthday(false);
        setShowFirecrackers(false);
        setShowTapToStartButton(false);
        setCountdown(''); // Or a message like 'Birthday passed!'
      }
    };

    calculateCountdown(); // Initial call

    const interval = setInterval(calculateCountdown, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animations = heartAnimations.map((anim, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
        ])
      );
    });
    Animated.parallel(animations).start();
  }, [heartAnimations]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      {heartAnimations.map((anim, i) => {
        const inputRange = [0, 0.5, 1];
        const initialX = Math.random() * width;
        const initialY = height + 200;

        const style = {
          left: initialX,
          opacity: anim.interpolate({ inputRange, outputRange: [0.5, 1, 0.5] }),
          transform: [
            {
              translateY: anim.interpolate({ inputRange, outputRange: [initialY, initialY - 400, initialY - 800] }),
            },
            {
              translateX: anim.interpolate({ inputRange, outputRange: [0, (i % 2 === 0 ? 50 : -50), 0] }),
            },
            {
              scale: anim.interpolate({ inputRange, outputRange: [0.5, 1, 0.5] }),
            },
          ],
        };
        return <Heart key={i} style={style} />;
      })}

      {showFirecrackers && isBirthday && (
        <>
          {[...Array(10)].map((_, i) => (
            <FirecrackerAnimation key={i} />
          ))}
        </>
      )}

      <View style={styles.contentContainer}>
        {/* <Text style={styles.currentTimeText}>{currentTime}</Text> */}
        {countdown !== '' && <Text style={styles.countdownText}>{countdown}</Text>}
        <Text style={styles.title}>A Birthday Surprise</Text>
        <Text style={styles.subtitle}>Just for you</Text>
        {showTapToStartButton && isBirthday && (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={onStartPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
              <Text style={styles.buttonText}>Tap to Start</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure content is above the hearts
  },
  heart: {
    position: 'absolute',
    fontSize: 30,
    textShadowColor: '#e94560',
    textShadowRadius: 10,
  },
  firecracker: {
    position: 'absolute',
    fontSize: 40,
    textShadowColor: '#ffcc00',
    textShadowRadius: 15,
  },
  title: {
    fontSize: 47,
    fontWeight: 'bold',
    color: '#f0f0f0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 23,
    color: '#f0f0f0',
    marginTop: 10,
    marginBottom: 80,
  },
  countdownText: {
    fontSize: 20,
    color: '#f0f0f0',
    marginBottom: 20,
  },
  currentTimeText: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
