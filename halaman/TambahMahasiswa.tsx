import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native"

const TambahMahasiswa = () => {
    const [nama, setNama] = useState('');
    const [nim, setNim] = useState('');
    const [jurusan, setJurusan] = useState('');
    const [semester, setSemester] = useState('');
    const [dataMahasiswa, setDatamahasiswa] = useState([]);

    const loadMahasiswa = async () => {
        const data = await AsyncStorage.getItem('mahasiswa');
        console.log('Data Mahasiswa:', 'Yang Tersimpan Di Memory');
        console.log({ data });
        if (data) setDatamahasiswa(JSON.parse(data));
    }

    useEffect(() => {
        loadMahasiswa();
    }, []);

    useEffect(() => {
        saveMahasiswa();
    }, [dataMahasiswa]);

    const saveMahasiswa = async () => {
        console.log({ dataMahasiswa });
        await AsyncStorage.setItem('mahasiswa', JSON.stringify(dataMahasiswa));
    }
    useEffect(() => {
        console.log('Nama:', nama);
        console.log('NIM:', nim);
        console.log('Jurusan:', jurusan);
        console.log('Semester:', semester);
    }, [nama, nim, jurusan, semester]);


    const simpanDataMahasiswa = () => {
        if (nama.trim() && nim.trim() && jurusan.trim() && semester.trim()) {
            console.log({ nama, nim, jurusan, semester });
            console.log('Data Mahasiswa:', 'DISIMPAN DALAM VARIABLE LIST dataMahasiswa');
            setDatamahasiswa([
                ...dataMahasiswa,
                {
                    nama: nama,
                    nim: nim,
                    jurusan: jurusan,
                    semester: semester,
                    done: false
                }
            ]);
            setNama('');
            setNim('');
            setJurusan('');
            setSemester('');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Form Tambah Mahasiswa</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Nama Lengkap"
                    value={nama}
                    onChangeText={setNama}
                />
            </View>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Nomor Induk Mahasiswa"
                    value={nim}
                    onChangeText={setNim}
                />
            </View>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Jurusan"
                    value={jurusan}
                    onChangeText={setJurusan}
                />
            </View>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Semester"
                    value={semester}
                    onChangeText={setSemester}
                />
            </View>
            <Button title="Simpan Data" onPress={() => simpanDataMahasiswa()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 12 },
    header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
    inputRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
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
export default TambahMahasiswa;