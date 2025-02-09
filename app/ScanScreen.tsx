import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert, SafeAreaView, Image } from "react-native";
import { useEffect, useRef, useState} from "react";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Results from "./Results"
import { OpenAI } from "openai";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getRecipes } from "./getRecipes";

export default function Scan({ goBack } : { goBack: () => void}) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [screen, setScreen] = useState<"selection" | "camera" | "preview" | "results">("selection");
  const [labels, setLabels] = useState<{ description: string}[]>([]);
  const [recipes, setRecipes] = useState<string[]>([]);

  const openCamera = async () => {
    setScreen("camera")
  };
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });


      if(!result.canceled){
        setPhoto(result.assets[0].uri);
        setScreen("preview");
      }
      console.log(result);
    }catch (error){
      console.error("Error picking Image");
    }
  }
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
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
          setScreen("preview");
          Alert.alert("Picture taken");
        }
      } catch {
        Alert.alert("Error");
      }
    }
  };
  const goToSelection = () => {
    setScreen("selection");
    setPhoto(null);
    setLabels([]);
    setRecipes([]);
  }

  const analyzeImage = async () => {
    try {
      if(!photo){
        alert("Please select an image first!");
        return;
      }
   
      const apiKey = process.env.API_KEY;
      const openai = new OpenAI({
        apiKey,
      });
     
      const hello = await openai.models.list();
      console.log("Available models:", hello);
 


      const base64ImageData = await FileSystem.readAsStringAsync(photo, {
        encoding: FileSystem.EncodingType.Base64,
      });


      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a food expert that identifies ingredients in images." },
          {
            role: "user",
            content: [
              { type: "text", text: "What food ingredients are in this image, be as specific as possible?" },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64ImageData}`},
              },
            ],
          },
        ],
        max_tokens: 500,
      })


      if(!response.choices || response.choices.length === 0){
        alert("no response");
        return;
      }
     
      const detectedIngredients = response.choices[0]?.message?.content?.split(", ") || [];


      const formatIngredeints = detectedIngredients.map((ingredeint) => ({ description: ingredeint}));
      const recipeSuggestions = await getRecipes(formatIngredeints) || [];
      setLabels(formatIngredeints);
      setRecipes(recipeSuggestions);
      setScreen("results");
  } catch (error) {
    console.error("Error in analyzeImage error", error);


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

  
  if (screen === "selection") {
    return (
      <View style={styles.container}>
          <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
            <Text style={styles.goBackText}>← Go Home</Text>
          </TouchableOpacity>
   
          <Text style={styles.title}>Choose an Option</Text>
   
          <View style={styles.options}>
            <TouchableOpacity style={styles.button} onPress={openCamera}>
              <Text style={styles.text}>📸 Take a Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.text}>🖼️ Import from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
  }
  if (screen === "results"){
    return <Results recipes={recipes} goBack={goToSelection} />
  }
  if (screen == "camera"){
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToSelection}>
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
}
  if (screen === "preview"){
    return (
      <SafeAreaView>
        <TouchableOpacity style={styles.goBackButton} onPress={goToSelection}>
       
        <Text style={styles.goBackText}>← Go Back</Text>
        </TouchableOpacity>
        <Image style={styles.preview} source={{ uri:photo ?? "" }}/>
          <Button onPress={goToSelection} title ="Choose Another" />
          <Button onPress={analyzeImage} title ="Generate Recipes" />
      </SafeAreaView>
    )
  }


  return null;
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
    width: "80%",
    padding: 15,
  },
  text: {
    fontSize: 24,
    color:"black",
    fontWeight: 'bold',
  },
  preview: {
    alignSelf: "stretch",
    width: "100%",
    height: "84%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  goBackContainer: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 2,
  },
  goBackButton: {
    backgroundColor: "#da5050",
    padding: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  goBackText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  options: {
    flex: 1,
    width:"100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  }
});