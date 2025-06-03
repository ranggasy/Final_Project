import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, 
  Dimensions, StatusBar, RefreshControl, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');

export default function ListMahasiswa() {
  const navigation = useNavigation();
  const [datamahasiswa, setDatamahasiswa] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadTasks();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [datamahasiswa]);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem('mahasiswa');
      console.log({data});
      if (data) setDatamahasiswa(JSON.parse(data));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const saveTasks = async () => {
    try {
      console.log({datamahasiswa});
      await AsyncStorage.setItem('mahasiswa', JSON.stringify(datamahasiswa));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setTimeout(() => setRefreshing(false), 1000);
  }

  const toggleDone = ({index}: {index: number}) => {
    const updated = [...datamahasiswa];
    updated[index].done = !updated[index].done;
    setDatamahasiswa(updated);
  }

  const deleteTask = ({index}: {index: number}) => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus data mahasiswa ini?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            const updated = [...datamahasiswa];
            updated.splice(index, 1);
            setDatamahasiswa(updated);
          }
        }
      ]
    );
  }

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>Belum Ada Data Mahasiswa</Text>
      <Text style={styles.emptySubtitle}>Tambahkan mahasiswa pertama Anda!</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{datamahasiswa.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {datamahasiswa.filter(item => item.done).length}
            </Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {datamahasiswa.filter(item => !item.done).length}
            </Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('Tambah')}
          >
            <Text style={styles.addButtonText}>+ Tambah Mahasiswa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List Section */}
      <FlatList
        data={datamahasiswa}
        renderItem={({ item, index }) => (
          <CardListItem 
            dataitem={item} 
            onStatusChange={() => toggleDone({index: index})}
            onDelete={() => deleteTask({index: index})}
            pindahHalaman={() => navigation.navigate('Edit', {
              data: {
                nma: item.nama,
                nim: item.nim,
                jurusan: item.jurusan,
                semester: item.semester,
                done: item.done,
              },
              index: index,
            })}
            index={index}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
      />
    </Animated.View>
  );
}

const CardListItem = ({dataitem, onStatusChange, onDelete, pindahHalaman, index}: {
  dataitem: {
    nama: string;
    nim: string;
    jurusan: string;
    semester: string;
    done: boolean;
  },
  onStatusChange: () => void,
  onDelete: () => void,
  pindahHalaman: () => void,
  index: number
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <Animated.View style={[
      styles.cardContainer,
      {
        transform: [{scale: scaleAnim}],
        backgroundColor: dataitem.done ? '#dcfce7' : '#ffffff'
      }
    ]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          {backgroundColor: dataitem.done ? '#16a34a' : '#f59e0b'}
        ]}>
          <Text style={styles.statusText}>
            {dataitem.done ? '✅ Selesai' : '⏳ Aktif'}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.cardContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {dataitem.nama.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[
                styles.studentName,
                dataitem.done && styles.completedText
              ]}>
                {dataitem.nama}
              </Text>
              <Text style={styles.studentNim}>NIM: {dataitem.nim}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🎓 Jurusan:</Text>
              <Text style={styles.detailValue}>{dataitem.jurusan}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📚 Semester:</Text>
              <Text style={styles.detailValue}>{dataitem.semester}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.statusButton,
              {backgroundColor: dataitem.done ? '#fbbf24' : '#10b981'}
            ]}
            onPress={onStatusChange}
          >
            <Text style={styles.actionButtonText}>
              {dataitem.done ? '↩️ Batal' : '✅ Selesai'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={pindahHalaman}
          >
            <Text style={styles.actionButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.actionButtonText}>🗑️ Hapus</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  refreshButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  refreshButtonText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 2,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 20,
  },
  profileInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  studentNim: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#16a34a',
  },
  detailsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusButton: {
    // backgroundColor set dynamically
  },
  editButton: {
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});