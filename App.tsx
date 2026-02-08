
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import HomeScreen from './src/HomeScreen';
import GameScreen from './src/GameScreen';
import MemoriesScreen from './src/MemoriesScreen';
import HeartFormationScreen from './src/HeartFormationScreen';

// This type helps us manage the steps in our surprise sequence
type Step = 'home' | 'game' | 'memories' | 'heart';

const App = () => {
  const [currentStep, setCurrentStep] = useState<Step>('home');

  // Function to advance to the next step in the sequence
  const advanceTo = (step: Step) => {
    setCurrentStep(step);
  };

  // This function decides which screen to show based on the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'home':
        return <HomeScreen onStartPress={() => advanceTo('game')} />;
      
      case 'game':
        return <GameScreen onGameWin={() => advanceTo('memories')} />;

      case 'memories':
        return <MemoriesScreen onContinue={() => advanceTo('heart')} />;

      case 'heart':
        return <HeartFormationScreen onPlayAgain={() => advanceTo('home')} />;

      default:
        return <HomeScreen onStartPress={() => advanceTo('game')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});

export default App;
