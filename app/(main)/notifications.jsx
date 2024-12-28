import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Credit Project</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Kelompok: 7</Text>
        <Text style={styles.text}>Fariz Ghifari Izatri - 2081010240</Text>
        <Text style={styles.text}>Nakata Day - 22081010228</Text>
        <Text style={styles.text}>Fajar Chandra Aditya - 22081010090</Text>
        <Text style={styles.text}>Muhammad Randy O. - 22081010153</Text>
      </View>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: wp(4),
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: hp(2),
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  text: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginBottom: hp(1),
    textAlign: 'center',
  },
});
