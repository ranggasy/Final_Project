import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export default function ListMahasiswa() {
  const navigation = useNavigation();
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [taskList]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    console.log({data});
    if (data) setTaskList(JSON.parse(data));
  }

  const saveTasks = async () => {
    console.log({taskList});
    await AsyncStorage.setItem('tasks', JSON.stringify(taskList));
  }


  const toggleDone = ({index}:{
    index:number;
  }) => {
    const updated = [...taskList];
    updated[index].done = !updated[index].done;
    setTaskList(updated);
  }

  const deleteTask = ({index}:{
    index:number;
  }) => {
    const updated = [...taskList];
    updated.splice(index, 1);
    setTaskList(updated);
  }

  return (
    <View style={styles.container}>
        <Button title="Tambah Mahasiswa" onPress={ ()=> navigation.navigate('Tambah')}/>
      <FlatList
        data={taskList}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={item.done ? styles.doneText : styles.normalText}>
              {item.done ? '✔️' : '⬜'} {item.text}
            </Text>
            <View style={styles.buttonGroup}>
              <Button title={item.done ? 'Batal' : 'Selesai'} onPress={() => toggleDone({index: index})} />
              <Button title="Hapus" onPress={() => deleteTask({index: index})} />
            </View>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, flex: 1, borderRadius: 6,
  },
  taskItem: {
    marginVertical: 10, padding: 10, borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  doneText: { textDecorationLine: 'line-through', color: 'green' },
  normalText: { color: 'black' },
});