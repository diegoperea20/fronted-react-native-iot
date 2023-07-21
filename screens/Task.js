import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Conection to backend flask
import { API_URL } from '@env';

function Task() {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [editing, setEditing] = useState(false);
  const [id_node, setId_node] = useState('');

  const [allnodes, setAllnodes] = useState([]);
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

  const handleSubmit = async () => {
    if (code === '') {
      alert('code is required');
      return;

    }
    if (!editing) {
      const response = await fetch(`${API_URL}/allnode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          code,
          name,
        }),
      });

      if (response.status === 200) {
        setName('');
        setCode('');
      } else if (response.status === 409) {
        alert('code already exists');
      }

      const response_table = await fetch(`${API_URL}/tablecode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      if (response_table.status !== 201) {
        alert('code already exists tablecode');
      }
    } else {
      const response = await fetch(`${API_URL}/allnode/${id_node}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (response.status === 200) {
        setEditing(false);
        setId_node('');
        setName('');
        setCode('');
      }
    }

    await getNodes();
  };

  const getNodes = async (user) => {
    const response = await fetch(`${API_URL}/allnode/${user}`);
    const data = await response.json();
    setAllnodes(data);
  };

  useEffect(() => {
    getNodes(user);
  }, );

  const deleteNode = async (id_node, code) => {
    const response = await fetch(`${API_URL}/allnode/${id_node}`, {
      method: "DELETE",
    });
    
    const response_delete = await fetch(`${API_URL}/tablecode/${code}`, {
      method: "DELETE",
    });

    await getNodes(user);
  };

  const editTask = async (id_node, user) => {
    const response = await fetch(`${API_URL}/allnode/${id_node}/${user}`);
    const data = await response.json();
    
    // Verifica que la respuesta contenga al menos un objeto
    if (data.length > 0) {
      const task = data[0];

      // Captura el id y title desde el objeto task
      const name = task.name || '';
      const code = task.code || '';

      setEditing(true);
      setId_node(id_node);
      setName(name);
      setCode(code || ''); // Asegurar que el valor esté definido
    }
  };

  const canceledit = () => {
    setEditing(false);
    setName('');
    setCode('');
  };

  const show = async (code) => {
    console.log(code);
    AsyncStorage.setItem('code', code);
    navigation.navigate('Show');
  };
  const handleChangeText = (text) => {
    // Convertir el texto ingresado a minúsculas
    const lowerCaseText = text.toLowerCase();
    setCode(lowerCaseText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nodes</Text>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Add a name"
        autoFocus
      />
      <TextInput
        style={styles.input}
        onChangeText={handleChangeText}
        value={code}
        placeholder="Add a code"
        editable={!editing}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editing ? "Update" : "Create"}</Text>
      </TouchableOpacity>
      {editing && (
        <TouchableOpacity style={styles.button} onPress={canceledit}>
          <Text style={styles.buttonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <View>
        <FlatList
          data={allnodes}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.column}>{item.name}</Text>
              <Text style={styles.column}>{item.code}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.updateButton} onPress={() => editTask(item.id, item.user)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNode(item.id, item.code)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.showButton} onPress={() => show(item.code)}>
                  <Text style={styles.buttonText}>Show</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    color: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  updateButton: {
    backgroundColor: "#2ecc71",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  showButton: {
    backgroundColor: "#9b59b6",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
});

export default Task;
