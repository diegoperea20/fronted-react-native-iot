import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Conection to backend flask
import { API_URL } from '@env';

function Changepassword() {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [password, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [same_password, setSame_password] = useState("");
  const [error, setError] = useState(""); // Nueva variable de estado para el mensaje de error
  const navigation = useNavigation();

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const requirements = [
      /\d/,
      /[a-z]/,
      /[A-Z]/,
      /[!@#$%^&*]/,
      /.{8,}/,
      /\S/,
    ];
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

  useEffect(() => {
    const getData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedId = await AsyncStorage.getItem('id');
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedUser && !storedId) {
        // Si no se encuentran los datos necesarios en el almacenamiento local, redirigir al inicio de sesión
        navigation.replace('/');
      } else {
        // Si se encuentran los datos, establecer el estado correspondiente
        setUser(storedUser);
        setId(storedId);
        setToken(storedToken);
        getEmail(storedId); // Llamada a la función para obtener el email
      }

      // Limpiar los datos del almacenamiento local después de obtenerlos
      await AsyncStorage.removeItem('userForChangePassword');
      await AsyncStorage.removeItem('idForChangePassword');
    };

    getData();
  }, [navigation]);

  const getEmail = async (id) => {
    const response = await fetch(`${API_URL}/loginup/${id}`);  // Cambia la URL para que coincida con la ruta de obtención de email en tu backend

    if (response.ok) {
      const user = await response.json();
      setEmail(user.email);  // Establece el estado del email obtenido
    } else {
      console.log('Error al obtener el email');
    }
  };

  const Home = () => {
    // Redireccionar a la página de cambio de contraseña
    navigation.navigate('Home');
  };

  const handleSubmit = async () => {
    if (password !== same_password) {
      window.alert("Las contraseñas no coinciden");
      return;
    }

    const response = await fetch(`${API_URL}/loginup/${id}`, {  // Cambia la URL para que coincida con la ruta de inicio de sesión en tu backend
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        email,
        password,
      }),
    });

    if (response.status === 200) {
      // La contraseña se ha modificado exitosamente
      setNewPassword("");
      setSame_password("");
      console.log('Contraseña modificada correctamente');
      window.alert('Contraseña modificada correctamente');
    } else {
      // Ocurrió un error al modificar la contraseña
      console.log('Error al modificar la contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Changepassword, {user}, ID:{id}! </Text>
      <Button title="Home" onPress={Home} />
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setNewPassword(text);
          validatePassword(text);
        }}
        value={password}
        placeholder="New Password"
        secureTextEntry
      />
      {/* Mostrar la condición de validación de la contraseña */}
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      <TextInput
        style={styles.input}
        onChangeText={(text) => setSame_password(text)}
        value={same_password}
        placeholder="Confirm New Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
      />
      <Button title="Update" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333', // Considera cambiar el color de fondo según el tema de tu aplicación
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Considera cambiar el color del texto según el tema de tu aplicación
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: '#fff',
    marginTop: 10
  },
  errorMessage: {
    color: "yellow",
    marginTop: 10,
  },
});

export default Changepassword;
