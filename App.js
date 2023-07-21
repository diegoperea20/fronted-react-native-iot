import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


const Stack = createStackNavigator();

import Login from './screens/Login';
import Loginup from './screens/Loginup';
import Home from './screens/Home';
import Task from './screens/Task';
import ChangePassword from './screens/Changepassword';
import Show from './screens/Show';


function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Loginup" component={Loginup} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Task" component={Task} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Show" component={Show} />
      
      

    </Stack.Navigator>
  )
}
//

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  }
});