import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export default function ListMahasiswa() {
  const navigation = useNavigation();
  const [datamahasiswa, setDatamahasiswa] = useState([]);
  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [datamahasiswa]);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('mahasiswa');
    console.log({data});
    if (data) setDatamahasiswa(JSON.parse(data));
  }

  const saveTasks = async () => {
    console.log({datamahasiswa});
    await AsyncStorage.setItem('mahasiswa', JSON.stringify(datamahasiswa));
  }


  const toggleDone = ({index}:{
    index:number;
  }) => {
    const updated = [...datamahasiswa];
    updated[index].done = !updated[index].done;
    setDatamahasiswa(updated);
  }

  const deleteTask = ({index}:{
    index:number;
  }) => {
    const updated = [...datamahasiswa];
    updated.splice(index, 1);
    setDatamahasiswa(updated);
  }

  return (
    <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Button title="Refresh" onPress={ loadTasks } color={`red`}/>
          <Button title="Tambah Mahasiswa" onPress={ ()=> navigation.navigate('Tambah')}/>
        </View>
      <FlatList
        data={datamahasiswa}
        renderItem={({ item, index }) => (
          <CardListItem 
            dataitem={item} 
            onStatusChange={()=> toggleDone({index: index})}
            onDelete={()=> deleteTask({index: index})}
            pindahHalaman={()=> navigation.navigate('Edit', {
              data: {
                nma: item.nama,
                nim: item.nim,
                jurusan: item.jurusan,
                semester: item.semester,
                done: item.done,
              },
              index: index,
            })}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}


const CardListItem = ({dataitem,  onStatusChange, onDelete, pindahHalaman} : {
  dataitem:{
    nama:string;
    nim:string;
    jurusan:string;
    semester:string;
    done:boolean;
  },
  onStatusChange: () => void,
  onDelete: () => void,
  pindahHalaman: () => void, // Tambahkan parameter ini untuk fungsi pindah halaman edit dat
}) => {
  return (
    <View style={{
      marginVertical: 10, 
      padding: 10, 
      borderRadius: 6,
      backgroundColor: dataitem.done ? 'green' : 'grey',
    }}>
      <View>
        <Text style={dataitem.done ? styles.doneText : styles.normalText}>
          {dataitem.done ? '✔️' : '⬜'}
        </Text>
        <View style={{
          marginVertical: 10,
          padding: 10,
          marginLeft: 16,
          borderRadius: 6,
          backgroundColor: 'white',
        }}>
         <Text>Nama : {dataitem.nama}</Text>
         <Text>Nim : {dataitem.nim}</Text> 
         <Text>Jurusan : {dataitem.jurusan}</Text>  
         <Text>Semester : {dataitem.semester}</Text>
        </View>
      </View>
        
        <View style={styles.buttonGroup}>
          <Button title={dataitem.done ? 'Batal' : 'Selesai'} onPress={onStatusChange} />
          <Button title="Edit" onPress={pindahHalaman} />
          <Button title="Hapus" onPress={onDelete} />
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 12 },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', gap: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
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