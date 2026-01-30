import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      // Ity API ity dia tsy mamoaka afa-tsy ny isActivated: false ihany
      const res = await axios.get("https://fianarana-api.onrender.com/api/admin/pending-payments");
      setPendingOrders(res.data);
    } catch (err) {
      console.log("Erreur de chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollId) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous activer ce cours ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "VALIDER", 
          onPress: async () => {
            try {
              // Mandefa ny ID mankany amin'ny Backend hanovana azy ho true
              const res = await axios.post(`https://fianarana-api.onrender.com/api/admin/approve-payment`, { enrollId });
              
              if (res.data.success) {
                Alert.alert("Succès", "Cours activé !");
                // REFRESH: Esory eo amin'ny lisitra avy hatrany ilay vao avy nekena
                setPendingOrders(prev => prev.filter(item => item._id !== enrollId));
              }
            } catch (err) {
              Alert.alert("Erreur", "L'activation on a échoué.");
            }
          } 
        }
      ]
    );
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#330867" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Validations Paiements</Text>
        <Pressable onPress={fetchPendingOrders}>
          <Ionicons name="refresh" size={24} color="#330867" />
        </Pressable>
      </View>

      <FlatList
        data={pendingOrders}
        keyExtractor={(item) => item._id} // Ampiasao foana ny _id
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.userEmail}>{item.userEmail}</Text>
              <Text style={styles.courseName}>{item.courseTitle}</Text>
              <Text style={styles.refText}>Réf: {item.transactionRef} ({item.method})</Text>
            </View>
            
            {/* Ity bokotra ity dia mipoitra raha mbola isActivated: false ihany */}
            <Pressable style={styles.approveBtn} onPress={() => handleApprove(item._id)}>
              <Ionicons name="checkmark-circle" size={40} color="#2ecc71" />
              <Text style={styles.btnLabel}>Valider</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>Aucun paiement en attente.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  orderInfo: { flex: 1 },
  userEmail: { fontWeight: 'bold', color: '#330867' },
  courseName: { color: '#666', fontSize: 13 },
  refText: { fontSize: 11, color: '#999', marginTop: 5 },
  approveBtn: { alignItems: 'center', paddingLeft: 10 },
  btnLabel: { fontSize: 10, color: '#2ecc71', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  empty: { color: '#999' }
});