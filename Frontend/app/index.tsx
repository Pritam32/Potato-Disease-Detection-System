import React, { useState } from 'react';
import { View,TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, Text, Button, Modal } from 'react-native';
import ImagePickerComponent from '@/components/ImagePickerComponent';
import axios from 'axios';

interface SelectedImage {
  uri: string;
  fileName?: string;
  mimeType?: string;
}

export default function HomeScreen() {
  const [image, setImage] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // New function to handle selected image
  const handleImage = async (selectedImage:SelectedImage) => {
    if (!selectedImage) return;
    setImage(selectedImage);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.uri,
      name: selectedImage.fileName || 'photo.jpg',
      type: selectedImage.mimeType || 'image/jpeg',
    } as any);

    try {
      const response = await axios.post('http://192.168.29.131:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      setResult({ error: "Upload failed. Please try again." });
    } finally {
      setLoading(false);
      setModalVisible(true); 
    }
  };

  return (
    <View style={styles.container}>
    <StatusBar hidden={true} />

    {/* Image Picker Component */}
    <ImagePickerComponent onImagePicked={handleImage} />

    {/* Loading Spinner */}
    {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

    {/* Modal to show result */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {!loading && result && (
            <View style={{ padding: 20 }}>
              {result.error ? (
                <Text style={styles.errorText}>{result.error}</Text>
              ) : (
                <View>
                  {result.class && result.confidence ? (
                    <>
                      <Text style={styles.resultText}>
                        <Text style={styles.boldText}>Predicted Class:</Text> {result.class}
                      </Text>
                      <Text style={styles.resultText}>
                        <Text style={styles.boldText}>Confidence:</Text> {result.confidence}%
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.errorText}>No valid result received from the backend.</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Retry Button */}
          {!loading && result && !result.error && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setResult(null);
                  setImage(null);
                  setModalVisible(false);  // Close modal after reset
                }}
              >
                <Text style={styles.buttonText}>Try Another Image</Text>
              </TouchableOpacity>
            )}

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10, // Android shadow
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',

  },
  resultText: {
    fontSize: 18,
    color: '#2c3e50',
    marginVertical: 8,
    lineHeight: 26,
    letterSpacing: 0.5,
    fontFamily: 'Poppins-Regular', // or 'Roboto-Regular'
  },
  boldText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'Poppins-Bold', // or 'Roboto-Bold'
  },
  
  errorText: {
    color: '#e74c3c',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});