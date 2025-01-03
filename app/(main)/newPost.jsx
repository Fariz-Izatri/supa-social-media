import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdateUser } from '../../services/postService'

const NewPost = () => {

  const {user} = useAuth();
  const bodyRef = useRef();
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFiles] = useState(file);

  const onPick = async (isImage) => {
    const mediaConfig = {
      mediaType: isImage ? 'photo' : 'video',  // Use mediaType as 'photo' or 'video'
      allowsEditing: true,
      aspect: isImage ? [4, 3] : undefined,  // aspect ratio only for images
      quality: isImage ? 0.7 : undefined,    // quality only for images
    };
  
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
  
    if (!result.canceled) {
      setFiles(result.assets[0]);
    }
  };
  

  const isLocalFile = file => {
    if(!file) return null;
    if(typeof file == 'object') return true;

    return false;
  }

  const getFileType = file => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type; // directly return file type
    }
  
    // Check MIME type or file extension (could be more robust)
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      return 'image';
    }
  
    return 'video';  // default to 'video' if not an image
  };
  

  const getFileUri = file => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  }
  const onSubmit = async () => {
    if(!bodyRef.current && !file){
      Alert.alert('Post', 'Please add a post body or media');
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    }

    // create post
    setLoading(true);
    let res = await createOrUpdateUser(data);
    setLoading(false);
    if(res.success){
      setFiles(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    }else{
      Alert.alert('Post', res.msg);
    }
  }
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{gap: 20}}>
          {/* avatar */}
          <View style={styles.header}>
            <Avatar 
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{gap: 2}}>
              <Text style={styles.username}>{user && user.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>

          {/* text editor */}
          <View style={styles.textEditor}>
            <RichTextEditor editorRef={editorRef} onChange={body=> bodyRef.current = body}/>
          </View>

          {
            file && (
              <View style={styles.file}>
                { 
                  getFileType(file) == 'video'? (
                    <Video
                      source={{uri: getFileUri(file)}}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode="cover"
                      shouldPlay
                      isLooping
                      style={{ flex: 1 }}
                      useNativeControls
                    />
                  ):(
                    <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{ flex: 1 }} />
                  )
                }

                <Pressable style={styles.closeIcon} onPress={()=> setFiles(null)}>
                  <Icon name="delete" size={20} color="white" />
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={()=> onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{height: hp(6.2)}}
          title="Post"
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1
  },
  textEditor: {
    // marginTop: 10,
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  video: {

  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0,0.6)',
    padding: 7,
    borderRadius: 50,
  }
})