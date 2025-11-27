import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import apiService from '../services/api';

export default function ScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }: any) => {
    if (scanned) return;

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Vibration.vibrate(100);

    try {
      // Try to find product by barcode
      const response = await apiService.getProductByBarcode(data);
      
      if (response.data.success) {
        // Product found - navigate to stock movement
        navigation.navigate('StockMovement', {
          product: response.data.data,
          barcode: data,
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Product not found - offer to create new
        Alert.alert(
          'Produto não encontrado',
          'Deseja cadastrar este produto?',
          [
            {
              text: 'Cancelar',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
            {
              text: 'Cadastrar',
              onPress: () => navigation.navigate('AddProduct', { barcode: data }),
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Erro ao buscar produto');
        setScanned(false);
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color="#9CA3AF" />
        <Text style={styles.text}>Sem acesso à câmera</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code39',
            'code128',
            'qr',
          ],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setFlashOn(!flashOn)}
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={28}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        {/* Scan Area */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <Text style={styles.instructionText}>
            Posicione o código de barras dentro da área
          </Text>
        </View>

        {/* Manual Input */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="create-outline" size={24} color="#FFF" />
          <Text style={styles.manualButtonText}>Entrada Manual</Text>
        </TouchableOpacity>
      </CameraView>

      {scanned && (
        <View style={styles.scannedOverlay}>
          <View style={styles.scannedCard}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.scannedText}>Código escaneado!</Text>
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainText}>Escanear Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4F46E5',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructionText: {
    marginTop: 40,
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 60,
    gap: 8,
  },
  manualButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  scannedText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  scanAgainButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
  },
  scanAgainText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
