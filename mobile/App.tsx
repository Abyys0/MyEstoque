import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { productService, Product as APIProduct } from './services/api';

type Screen = 'menu' | 'scanner' | 'inventory' | 'add' | 'reports';

interface Product {
  id?: string;
  barcode: string;
  name: string;
  quantity: number;
  category?: string;
  price?: number;
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    barcode: '', 
    name: '', 
    quantity: '',
    category: 'Geral',
    price: ''
  });

  // Carregar produtos ao iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Aviso', 'Não foi possível conectar ao servidor. Trabalhando offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);
    
    try {
      // Buscar produto na API
      const existingProduct = await productService.getByBarcode(data);
      
      if (existingProduct) {
        Alert.alert(
          '✅ Produto Encontrado!',
          `Nome: ${existingProduct.name}\nCódigo: ${data}\nEstoque: ${existingProduct.quantity} unidades`,
          [
            { text: 'Escanear Outro', onPress: () => { setScanned(false); setLoading(false); }},
            { text: 'Voltar ao Menu', onPress: () => { setCurrentScreen('menu'); setScanned(false); setLoading(false); }}
          ]
        );
      } else {
        Alert.alert(
          '🆕 Produto Novo!',
          `Código: ${data}\nProduto não encontrado no estoque.`,
          [
            { text: 'Adicionar Produto', onPress: () => {
              setNewProduct({ ...newProduct, barcode: data });
              setCurrentScreen('add');
              setScanned(false);
              setLoading(false);
            }},
            { text: 'Escanear Outro', onPress: () => { setScanned(false); setLoading(false); }},
            { text: 'Voltar', onPress: () => { setCurrentScreen('menu'); setScanned(false); setLoading(false); }}
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível verificar o produto. Tente novamente.');
      setScanned(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.barcode || !newProduct.name || !newProduct.quantity) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      const product: any = {
        barcode: newProduct.barcode,
        name: newProduct.name,
        description: '',
        category: newProduct.category || 'Geral',
        unit: 'UN',
        minStock: 0,
        currentStock: parseInt(newProduct.quantity),
      };

      const response = await productService.create(product);
      
      if (response.success) {
        await loadProducts(); // Recarregar lista
        
        setNewProduct({ barcode: '', name: '', quantity: '', category: 'Geral', price: '' });
        Alert.alert('✅ Sucesso!', 'Produto adicionado com sucesso!', [
          { text: 'OK', onPress: () => setCurrentScreen('menu') }
        ]);
      } else {
        Alert.alert('Erro', response.error || 'Erro ao adicionar produto');
      }
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      const message = error.response?.data?.error || 'Não foi possível adicionar o produto';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.subtitle}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.errorText}>❌ Sem acesso à câmera</Text>
        <Text style={styles.subtitle}>
          Precisamos de permissão para escanear códigos de barras
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Renderizar tela de scanner
  if (currentScreen === 'scanner') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <View style={styles.container}>
          <Text style={styles.scannerTitle}>📱 Aponte para o código de barras</Text>
          
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
              }}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame} />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={() => {
              setCurrentScreen('menu');
              setScanned(false);
            }}
          >
            <Text style={styles.buttonText}>❌ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar tela de estoque
  if (currentScreen === 'inventory') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.title}>📋 Estoque</Text>
            <Text style={styles.subtitle}>{products.length} produtos cadastrados</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 20 }} />
            ) : products.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>📦</Text>
                <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
                <Text style={styles.emptySubtitle}>Adicione produtos escaneando ou manualmente</Text>
              </View>
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id || item.barcode}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productBarcode}>Código: {item.barcode}</Text>
                    <Text style={styles.productQuantity}>Estoque: {item.quantity} unidades</Text>
                    {item.category && <Text style={styles.productCategory}>Categoria: {item.category}</Text>}
                    {item.price && <Text style={styles.productPrice}>Preço: R$ {item.price.toFixed(2)}</Text>}
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                loadProducts();
                setCurrentScreen('menu');
              }}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>🔄 Atualizar e Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar tela de adicionar produto
  if (currentScreen === 'add') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.title}>➕ Adicionar Produto</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Código de Barras</Text>
              <TextInput
                style={styles.input}
                value={newProduct.barcode}
                onChangeText={(text) => setNewProduct({...newProduct, barcode: text})}
                placeholder="7891234567890"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                placeholder="Ex: Arroz 5kg"
              />

              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                style={styles.input}
                value={newProduct.quantity}
                onChangeText={(text) => setNewProduct({...newProduct, quantity: text})}
                placeholder="Ex: 50"
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.button} onPress={addProduct}>
                <Text style={styles.buttonText}>✅ Adicionar Produto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  setNewProduct({ barcode: '', name: '', quantity: '', category: 'Geral', price: '' });
                  setCurrentScreen('menu');
                }}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar tela de relatórios
  if (currentScreen === 'reports') {
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const avgQuantity = totalProducts > 0 ? (totalQuantity / totalProducts).toFixed(1) : 0;

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.title}>📊 Relatórios</Text>

            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Total de Produtos</Text>
              <Text style={styles.reportValue}>{totalProducts}</Text>
            </View>

            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Quantidade Total</Text>
              <Text style={styles.reportValue}>{totalQuantity} unidades</Text>
            </View>

            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Média por Produto</Text>
              <Text style={styles.reportValue}>{avgQuantity} unidades</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setCurrentScreen('menu')}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>⬅️ Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar menu principal
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>📦 MyStock</Text>
          <Text style={styles.subtitle}>Sistema de Gerenciamento de Estoque</Text>

          {loading && (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginVertical: 20 }} />
          )}

          <View style={styles.menu}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => setCurrentScreen('scanner')}
              >
                <Text style={styles.buttonIcon}>📸</Text>
                <Text style={styles.buttonText}>Escanear Produto</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setCurrentScreen('inventory')}
              >
                <Text style={styles.buttonIcon}>📋</Text>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Ver Estoque
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setCurrentScreen('add')}
              >
                <Text style={styles.buttonIcon}>➕</Text>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Adicionar Manual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setCurrentScreen('reports')}
              >
                <Text style={styles.buttonIcon}>📊</Text>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Relatórios
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>v1.0.0 • MyEstoque</Text>
              <Text style={styles.footerText}>Backend: localhost:3000</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  menu: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  buttonDanger: {
    backgroundColor: '#EF4444',
    marginTop: 16,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#4F46E5',
  },
  scannerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#4F46E5',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  productBarcode: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  productQuantity: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4F46E5',
    alignItems: 'center',
    width: '100%',
  },
  reportTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  reportValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
});
