import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Conection to backend flask
import { API_URL } from '@env';

function Home() {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedId = await AsyncStorage.getItem('id');
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedUser && !storedId) {
        // Si no se encuentra el nombre de usuario en el almacenamiento local, redirigir al inicio de sesión
        navigation.replace('/');
      } else {
        // Si se encuentra el nombre de usuario, establecer el estado del usuario
        setUser(storedUser);
        setId(storedId);
        setToken(storedToken);
      }
    };

    getData();
  }, [navigation]);

  const handleLogout = async () => {
    // Eliminar el token y el nombre de usuario del almacenamiento local al cerrar sesión
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Redireccionar al inicio de sesión después de cerrar sesión
    navigation.replace('Login');
  };

  const changePassword = () => {

    // Redireccionar a la página de cambio de contraseña
    navigation.navigate('ChangePassword');
  };

  const deleteAccount = async (id, user) => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Desea eliminar la cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
      const response = await fetch(`${API_URL}/loginup/${id}`, {
        method: "DELETE",
      });
      
      const deleteAlltables = await fetch(`${API_URL}/tablecodeall/${user}`, {
        method: "DELETE",
      });

      const deleteAll = await fetch(`${API_URL}/allnodeaccount/${user}`, {
        method: "DELETE",
      });

      if (response.status === 200 && deleteAll.status === 200 && deleteAlltables.status === 200) {
        // La cuenta se ha eliminado correctamente
        alert('Cuenta eliminada correctamente');
        navigation.replace('Login');
      } else {
        // Ocurrió un error al eliminar la cuenta
        console.log('Error al eliminar la cuenta');
                Alert.alert('Error al eliminar la cuenta');
              }
            } catch (error) {
              console.log('Error:', error);
            }
    },
      },
    ],
    );
  };

  const task = () => {
    navigation.navigate('Task');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome: {user} ! ,  ID:{id}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <TouchableOpacity onPress={changePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteAccount(id, user)}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={task}>
        <Text style={styles.buttonText}>Create Nodes</Text>
      </TouchableOpacity>
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
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Considera cambiar el color del texto según el tema de tu aplicación
    marginVertical: 10,
    backgroundColor: '#00AEFF', 
    borderRadius: 5,
    padding: 10,
  },
});

export default Home;
