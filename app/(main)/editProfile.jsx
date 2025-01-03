import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { wp, hp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { getUserImageSrc } from '../../services/imageService'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import { useEffect } from 'react'
import Button from '../../components/Button'
import { updateUser } from '../../services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { updloadFile } from '../../services/imageService'


const EditProfile = () => {

  const {user: currentUser, setUserData} = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: '',
  });

  useEffect(() => {
    if(currentUser){
      setUser({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || null,
        address: currentUser.address || '',
        bio: currentUser.bio || '',
      });
    }
  },[currentUser])

  const onPickImage = async (isImage) => {
    const mediaConfig = {
          mediaType: isImage ? 'photo' : 'video',  // Use mediaType as 'photo' or 'video'
          allowsEditing: true,
          aspect: isImage ? [4, 3] : undefined,  // aspect ratio only for images
          quality: isImage ? 0.7 : undefined,    // quality only for images
        };
      
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if(!result.canceled){
      setUser({...user, image: result.assets[0]});
    }
  }

  const onSubmit = async () => {
    let userData = {...user};
    let {name, phoneNumber, address, image, bio} = userData;
    if(!name || !phoneNumber || !address || !bio){
      Alert.alert('Profile', "Please fill in all fields");
      return;
    }
    setLoading(true);

    if(typeof image == 'object'){
      // upload image
      let imageRes = await updloadFile('profiles', image?.uri, true);
      if(imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
      

    }
    // update user
    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);

    if(res.success){
      setUserData({...currentUser, ...userData});
      router.back();
    }
  }

  let imageSource = user.image && typeof user.image == 'object'? user.image.uri : getUserImageSrc(user.image);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input 
              icon={<Icon name="user"/>}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={value=> setUser({...user, name: value})}
            />
            <Input 
              icon={<Icon name="call"/>}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={value=> setUser({...user, phoneNumber: value})}
            />
            <Input 
              icon={<Icon name="location"/>}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={value=> setUser({...user, address: value})}
            />
            <Input 
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={value=> setUser({...user, bio: value})}
            />

            <Button title='Update' loading={loading} onPress={onSubmit}/>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
  },
  avatar: {
    height: '100%',
    width: '100%',
    borderRadius: theme.radius.xxl*1.8,
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15,
  }
})