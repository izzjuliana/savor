import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert, SafeAreaView, Image } from "react-native";
import { useEffect, useRef, useState} from "react";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

export default function Scan({ goBack } : { goBack: () => void}) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (cameraRef.current){
      try {
        const newPhoto = await cameraRef.current.takePictureAsync();

        if(newPhoto?.uri){
          setPhoto(newPhoto.uri);
          Alert.alert("Picture taken");
        }
      } catch {
        Alert.alert("Error");
      }
    } 
  };
    
  const renderPicture = () => {
    return (
      <SafeAreaView>
        <Image style={styles.preview} source={{ uri:photo ?? "" }}/>
          <Button onPress={() => setPhoto(null)} title ="Take another picutre" />
      </SafeAreaView>
    )
  };

  const renderCamera = () => {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Pic</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );


  }

  return (
    <View style={styles.container}>
      {photo ? renderPicture() : renderCamera()}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    alignSelf: "stretch",
    width: "100%",
    height: "90%",
    borderRadius: 10,
    resizeMode: "contain",
  }
})