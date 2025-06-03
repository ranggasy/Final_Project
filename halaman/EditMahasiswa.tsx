import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";

type Mahasiswa = {
  nama: string;
  nim: string;
  jurusan: string;
  semester: string;
};

const EditMahasiswaScreen = ({ route, navigation }: any) => {
  const { index } = route.params;
  const [formData, setFormData] = useState<Mahasiswa>({
    nama: "",
    nim: "",
    jurusan: "",
    semester: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("mahasiswa");
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed[index]) {
            setFormData(parsed[index]);
          } else {
            Alert.alert("Error", "Data tidak ditemukan.");
          }
        }
      } catch (error) {
        console.error("Gagal load data:", error);
      }
    };

    loadData();
  }, [index]);

  const menuUbah = (field: keyof Mahasiswa, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const simpanEdit = async () => {
    if (
      !formData.nama.trim() ||
      !formData.nim.trim() ||
      !formData.jurusan.trim() ||
      !formData.semester.trim()
    ) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      const data = await AsyncStorage.getItem("mahasiswa");
      let dataArray: Mahasiswa[] = [];
      if (data) {
        dataArray = JSON.parse(data);
        if (Array.isArray(dataArray)) {
          dataArray[index] = formData; 
        }
      }
      await AsyncStorage.setItem("mahasiswa", JSON.stringify(dataArray));
      Alert.alert("Berhasil", "Data berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal simpan data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Mahasiswa</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={formData.nama}
        onChangeText={(text) => menuUbah("nama", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="NIM"
        value={formData.nim}
        onChangeText={(text) => menuUbah("nim", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Jurusan"
        value={formData.jurusan}
        onChangeText={(text) => menuUbah("jurusan", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Semester"
        keyboardType="numeric"
        value={formData.semester}
        onChangeText={(text) => menuUbah("semester", text)}
      />
      <Button title="Simpan Perubahan" onPress={simpanEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});

export default EditMahasiswaScreen;
