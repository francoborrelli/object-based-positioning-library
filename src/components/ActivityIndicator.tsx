import React, { FC } from 'react';
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';

interface ActivityIndicatorProps {}

const CustomActivityIndicator: FC<ActivityIndicatorProps> = (props) => {
  return (
    <View style={[styles.container]}>
      <ActivityIndicator {...props} />
      <Text style={{ textAlign: 'center', marginTop: 10 }}>Inicializando cámara...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CustomActivityIndicator;
