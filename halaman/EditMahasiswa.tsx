import { useEffect } from "react";
import { Text, View } from "react-native"

const EditMahasiswa = ({data, index} : {
    data: {
        nim: string,
        nama: string,
        jurusan: string,
        semester: string
    }
    index: number
}) => {
    
    useEffect(() => {
        console.log(data);
        console.log(index);
    }, [data, index]);
    return (
        <View>
            <Text>Halaman Edit Mahasiswa</Text>
            <Text>{index}</Text>
        </View>
    )
}

export default EditMahasiswa;