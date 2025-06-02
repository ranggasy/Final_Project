import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
export default function Application() {
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

  const addTask = () => {
    if (task.trim()) {
      console.log({task});
      setTaskList([...taskList, { text: task, done: false }]);
      setTask('');
    }
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
    <NavigationContainer>
    <View style={styles.container}>
      <Text style={styles.header}>📝 To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Tulis tugas..."
          value={task}
          onChangeText={setTask}
        />
        <Button title="Tambah" onPress={addTask} />
      </View>
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
    </NavigationContainer>
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