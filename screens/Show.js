import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// Importar el módulo react-native-svg
import Svg, { Line } from 'react-native-svg';

// Conection to backend flask
import { API_URL } from '@env';

function Show() {
  const [code, setCode] = useState("");
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [node, setNode] = useState([]);
  // table pretty
  const [startIndex, setStartIndex] = useState(0); // Declare startIndex here
  

  // graph
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const storedCode = await AsyncStorage.getItem('code');
      const storedUser = await AsyncStorage.getItem('user');
      const storedId = await AsyncStorage.getItem('id');
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedUser && !storedId) {
        // Si no se encuentra el nombre de usuario en el almacenamiento local, redirigir al inicio de sesión
        navigation.replace('Login');
      } else {
        // Si se encuentra el nombre de usuario, establecer el estado del usuario
        setUser(storedUser);
        setId(storedId);
        setCode(storedCode);
      }
    };

    getData();
  }, [navigation]);

  const getNode = async (code) => {
    const response = await fetch(`${API_URL}/tablecode/${code}`);
    const data = await response.json();
    setNode(data);
  };

  useEffect(() => {
    getNode(code);
  }, [code]);

  // graph
  useEffect(() => {
    if (node.length > 0) {
      const temperatureData = node.map((parameter) => parseFloat(parameter.temperature)).filter(value => !isNaN(value));
      const humidityData = node.map((parameter) => parseFloat(parameter.humidity)).filter(value => !isNaN(value));
      const labels = node.map((parameter) => parameter.id);

      setTemperatureData(temperatureData);
      setHumidityData(humidityData);
      setLabels(labels);
    }
  }, [node]);

  const home = () => {
    navigation.navigate('Home');
  };

  const nodes_page = () => {
    navigation.goBack();
  };

  // table with style and pretty
  const handleClickNext = () => {
    setStartIndex(startIndex + 5);
  };

  const handleClickPrevious = () => {
    setStartIndex(startIndex - 5);
  };

  const visibleData = node.slice(startIndex, startIndex + 5);
  const data = {
    labels: labels,
    datasets: [
      {
        data: temperatureData,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // red color for temperature
      },
      {
        data: humidityData,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // blue color for humidity
      },
    ],
  };
  
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    strokeWidth: 5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.5,
  };

  
  function Legends({ data }) {
    return (
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: data[0].color(0.8) }]} />
          <Text style={styles.legendText}>Temperature</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: data[1].color(0.8) }]} />
          <Text style={styles.legendText}>Humidity</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show {code}</Text>
      <Button title="Home" onPress={home} />
      <Button title="Back" onPress={nodes_page} />

      <View style={styles.tableContainer}>
        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.header}>Temperature °C</Text>
              <Text style={styles.header}>Humidity</Text>
            </View>
            {visibleData.map((parameter) => (
              <View style={styles.row} key={parameter.id}>
                <Text style={styles.column}>{parameter.temperature}</Text>
                <Text style={styles.column}>{parameter.humidity}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.pagination}>
          <Button title="Previous" onPress={handleClickPrevious} disabled={startIndex === 0} />
          <Button title="Next" onPress={handleClickNext} disabled={startIndex + 5 >= node.length} />
        </View>
      </View>

      <View style={styles.chartContainer}>
        {temperatureData.length > 0 && humidityData.length > 0 && labels.length > 0 ? (
          <LineChart
          data={data}
          width={350}
          height={200}
          withVerticalLines={false}
          withHorizontalLines={false}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withShadow={true}
          chartConfig={chartConfig}
          bezier
        />
        ) : (
          <Text>Loading chart...</Text>
        )}
         {temperatureData.length > 0 && humidityData.length > 0 && labels.length > 0 && (
          <Legends data={data.datasets} />
        )}

        

      </View>
      </View >
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#333',
  },
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
  tableContainer: {
    flex: 0.8,
    marginBottom: 10,
    marginLeft: 90,
    marginTop: 20
  },
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    color: '#fff',
    fontWeight: 'bold',
  },
  column: {
    flex: 1,
    color: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 70,
  },
  chartContainer: {
    height: 200,
    marginLeft: 10,
    
    
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: '#fff',
  },
});

export default Show;

//npx expo install react-native-svg
