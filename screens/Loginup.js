import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// Conection to backend flask
import { API_URL } from "@env";

function Loginup() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [same_password, setSame_password] = useState("");

  const [error, setError] = useState(""); // Nueva variable de estado para el mensaje de error

  const navigation = useNavigation();

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const requirements = [/\d/, /[a-z]/, /[A-Z]/, /[!@#$%^&*]/, /.{8,}/, /\S/];
    const errorMessages = [
      "Debe incluir al menos un número.",
      "Debe incluir al menos una letra minúscula.",
      "Debe incluir al menos una letra mayúscula.",
      "Debe incluir al menos un carácter especial.",
      "La longitud de la contraseña debe ser igual o mayor a 8 caracteres.",
      "No debe contener espacios en blanco.",
    ];

    const errors = [];
    for (let i = 0; i < requirements.length; i++) {
      if (!requirements[i].test(value)) {
        errors.push(errorMessages[i]);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== same_password) {
      window.alert("Las contraseñas no coinciden");
      return;
    }
    if (email === "" || user === "" || password === "") {
      window.alert("Completa todos los campos");
      return;
    }
    

    

    const response = await fetch(`${API_URL}/loginup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        password,
        email,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      // Registro exitoso, restablecer los campos y borrar el mensaje de error
      setUser("");
      setEmail("");
      setPassword("");
      setError("");
      setSame_password("");
      alert('Usuario creado');
      navigation.navigate('Login');
    } else {
      // Mostrar el mensaje de error en caso de que ocurra un error en el registro
      setError(data.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login UP</Text>
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
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
          value={password}
          placeholder="Password"
          secureTextEntry
        />

        {/* Mostrar la condición de validación de la contraseña */}
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <Text style={styles.subtitle}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setSame_password(text)}
          value={same_password}
          placeholder="Validation Password"
          secureTextEntry
        />

        <Text style={styles.subtitle}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
        />

        <Button
          disabled={error.length > 0 && error !== "User already exists"}
          title="Register"
          onPress={handleSubmit}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.registerLink}>Login In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333", // Considera cambiar el color de fondo según el tema de tu aplicación
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // Considera cambiar el color del texto según el tema de tu aplicación
  },
  form: {
    width: "80%",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#fff", // Considera cambiar el color del texto según el tema de tu aplicación
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff", // Considera cambiar el color de fondo del cuadro de entrada según el tema de tu aplicación
  },
  errorMessage: {
    color: "yellow", // Considera cambiar el color del texto según el tema de tu aplicación
    marginTop: 10,
  },
  registerLink: {
    marginTop: 20,
    color: "white", // Considera cambiar el color del texto según el tema de tu aplicación
  },
});

export default Loginup;
