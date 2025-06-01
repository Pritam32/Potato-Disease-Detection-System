import React from 'react';
import { Text,Image, View, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  onImagePicked: (img: any) => void;
}

export default function ImagePickerComponent({ onImagePicked }: Props) {
  // Function to pick an image from the gallery
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user did not cancel, pass the image data to parent component
    if (!result.canceled) {
      onImagePicked(result.assets[0]);
    } else {
      console.log("Gallery image picking cancelled");
    }
  };

  // Function to take a picture using the camera
  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      onImagePicked(result.assets[0]);
    } else {
      console.log("Camera image picking cancelled");
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
      blurRadius={3}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        
      <Image source={require('../assets/images/icon.png')} style={styles.icon}/>
        <Text style={styles.heading}>Potato Disease Detector</Text>

        {/* Button to pick image from gallery */}
        <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
          <Text style={styles.buttonText}>PICK FROM GALLERY</Text>
        </TouchableOpacity>

        {/* Button to take a photo with the camera */}
        <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
          <Text style={styles.buttonText}>TAKE A PHOTO</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // very light transparent (almost white)
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0', // very soft grey border
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#2e7d32',
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: 0, // Remove any extra padding to avoid color difference
    paddingHorizontal: 0,
    
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.85)', // deeper black shadow
    textShadowOffset: { width: 2, height: 3 }, // more spread
    textShadowRadius: 8, // blurrier for glow
    letterSpacing: 1,
  },
  
    icon: {
      width: 100,             
      height: 100,
      alignSelf: 'center',      
      marginBottom: 10,         
      marginTop: -20,           
      borderRadius: 40,         
      backgroundColor: 'rgba(255,255,255,0.2)', 
      padding: 10,              
    },
  
});
