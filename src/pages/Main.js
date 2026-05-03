import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const regiaoInicial = {
  latitude: -14.235,
  longitude: -51.9253,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function Main() {
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  async function cadastrarUsuario() {
    if (!nome || !rua || !numero || !cidade || !estado) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const enderecoCompleto = `${rua.trim()}, ${numero.trim()}, ${cidade.trim()}, ${estado.trim()}, Brasil`;

    try {
      const permissao = await Location.requestForegroundPermissionsAsync();

      if (permissao.status !== "granted") {
        Alert.alert("Atenção", "Permissão de localização negada.");
        return;
      }

      const resultado = await Location.geocodeAsync(enderecoCompleto);

      if (!resultado || resultado.length === 0) {
        Alert.alert("Atenção", "Endereço não encontrado.");
        return;
      }

      if (resultado[0].latitude == null || resultado[0].longitude == null) {
        Alert.alert("Atenção", "Não foi possível obter latitude e longitude.");
        return;
      }

      const novoUsuario = {
        id: String(Date.now()),
        nome,
        rua,
        numero,
        cidade,
        estado,
        latitude: resultado[0].latitude,
        longitude: resultado[0].longitude,
      };

      setUsuarios((listaAtual) => [...listaAtual, novoUsuario]);

      setNome("");
      setRua("");
      setNumero("");
      setCidade("");
      setEstado("");
    } catch (error) {
      Alert.alert("Atenção", "Erro ao buscar a localização.");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Text style={styles.titulo}>Localiza</Text>
        <Text style={styles.subtitulo}>
          Adicione usuários e veja onde eles estão localizados no mapa!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={rua}
          onChangeText={setRua}
        />
        <TextInput
          style={styles.input}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade}
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
        />

        <Button title="Cadastrar" onPress={cadastrarUsuario} color="#FF7A00" />

        <Text style={styles.subtitulo}>
          Usuários cadastrados: {usuarios.length}
        </Text>
      </ScrollView>

      <MapView
        key={usuarios.length}
        style={styles.map}
        initialRegion={
          usuarios.length > 0
            ? {
                latitude: usuarios[0].latitude,
                longitude: usuarios[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : regiaoInicial
        }
      >
        {usuarios.map((usuario) => (
          <Marker
            key={usuario.id}
            coordinate={{
              latitude: usuario.latitude,
              longitude: usuario.longitude,
            }}
            title={usuario.nome}
            description={`${usuario.rua}, ${usuario.numero} - ${usuario.cidade}/${usuario.estado}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  formContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF7A00",
    marginBottom: 8,
    marginTop: 20,
    textAlign: "center",
  },
  subtitulo: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 16,
    color: "#333333",
  },
  exemplo: {
    marginBottom: 12,
    fontSize: 14,
    color: "#666666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF7A00",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  map: {
    height: 350,
  },
});
