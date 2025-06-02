"use strict";
import React, { useState, useEffect } from 'react';
import ListMahasiswa from './halaman/ListMahasiswa';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TambahMahasiswa from './halaman/TambahMahasiswa';
import EditMahasiswa from './halaman/EditMahasiswa';
const Stack = createNativeStackNavigator();
export default function Application() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={ListMahasiswa}
          options={{
            title: 'Aplikasi Daftar Mahasiswa',
          }}
        />
        <Stack.Screen 
          name="Tambah" 
          component={TambahMahasiswa} 
          options={{title: "Tambah Mahasiswa"}}
        />
        <Stack.Screen 
          name="Edit" 
          component={EditMahasiswa} 
          options={{title: "Edit Data Mahasiswa"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
