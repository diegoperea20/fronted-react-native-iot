import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conection to backend flask
import { API_URL } from '@env';

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        password,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const token = data.token;
      const user_id = data.user_id;

      // Guardar el token y la información del usuario en el almacenamiento local
      // (puedes utilizar AsyncStorage para almacenamiento en React Native)
      // Aquí solo se muestra un ejemplo utilizando la API AsyncStorage, que es comúnmente utilizada en React Native.
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", user);
      await AsyncStorage.setItem("id", String(user_id));

      // Redireccionar a la página de inicio después de un inicio de sesión exitoso
      navigation.replace("Home"); // Asegúrate de que la pantalla 'Home' exista en tu navegación.
    } else {
      setIncorrectLogin(true);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <Text style={styles.subtitle}>Username</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUser(text)}
          value={user}
          placeholder="Username"
          autoFocus
        />

        <Text style={styles.subtitle}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          secureTextEntry
        />

        <Button title="Login" onPress={handleSubmit} />

        {incorrectLogin && <Text style={styles.errorMessage}>Incorrect username or password</Text>}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Loginup")}>
        <Text style={styles.registerLink}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333", 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // Color del texto en blanco
  },
  form: {
    width: "80%",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#fff", // Color del texto en blanco
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff", // Color del fondo del TextInput en blanco
    color: "#000", // Color del texto del TextInput en negro
  },
  errorMessage: {
    color: "yellow",
    marginTop: 10,
    
  },
  registerLink: {
    marginTop: 20,
    color: "blue",
    color: "#fff", // Color del texto del enlace en blanco
  },
});

export default Login;
