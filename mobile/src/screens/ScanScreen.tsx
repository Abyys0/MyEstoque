import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useCameraDevices, Camera, type Code } from 'react-native-vision-camera';

export default function ScanScreen() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Câmera não disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={{
            codeTypes: ['code-128', 'code-39', 'ean-13', 'ean-8'],
            onCodeScanned: (codes: Code[]) => {
              if (codes.length > 0) {
                setScannedCode(codes[0].value || '');
                Alert.alert('Código Lido', `Código: ${codes[0].value}`);
              }
            },
          }}
        />
      </View>

      <View style={styles.resultContainer}>
        {scannedCode && (
          <>
            <Text style={styles.label}>Último Código:</Text>
            <Text style={styles.code}>{scannedCode}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 3,
    backgroundColor: '#000',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
