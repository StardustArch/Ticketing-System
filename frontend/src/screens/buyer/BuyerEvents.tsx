import React, { useEffect, useState } from 'react';
import { 
  View, Text, ActivityIndicator, FlatList, StyleSheet, 
  TouchableOpacity, Modal, Alert 
} from 'react-native';
import { getFutureEvents } from '../../services/eventService';
import { createTicket } from '../../services/ticketService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, Button } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';

// Função para formatar a data
const formatDate = (isoString: string) => {
  return format(new Date(isoString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};

// Definição do tipo para um evento
interface Event {
  ID: string;
  Name: string;
  Description: string;
  Location: string;
  Date: string;
}

// Componente principal
const BuyerEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado do pull-to-refresh
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Função para carregar eventos
  const loadEvents = async () => {
    setRefreshing(true); // Inicia o refresh
    try {
      const futureEvents = await getFutureEvents();
      if (Array.isArray(futureEvents)) {
        setEvents(futureEvents);
      } else {
        setEvents([]);
      }
    } catch (err) {
      setError('Não foi possível carregar os eventos. Tente novamente mais tarde.');
    } finally {
      setRefreshing(false); // Finaliza o refresh
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Função para abrir o modal de compra
  const handleBuyPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Função para confirmar a compra
  const handleConfirmPurchase = async () => {
    if (!selectedEvent) return;
    try {
      console.log('🎟️ Solicitando ticket para o evento:', selectedEvent.ID);
      const ticket = await createTicket({ event_id: selectedEvent.ID });
      Alert.alert('Sucesso', 'Seu ticket foi gerado com sucesso! Veja em Tickets...');
      console.log('🎟️ Ticket gerado:', ticket);
    } catch (err) {
      console.error('❌ Erro na compra do ticket:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao gerar seu ticket.');
    } finally {
      setModalVisible(false);
      setSelectedEvent(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.loadingText}>Carregando eventos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Eventos Disponíveis</Text>

      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.ID}
          refreshing={refreshing} // Estado do pull-to-refresh
          onRefresh={loadEvents} // Função chamada ao arrastar para baixo
          renderItem={({ item }) => (
            <Card style={styles.eventCard}>
              <Card.Title title={item.Name} titleStyle={styles.eventTitle} />
              <Card.Content>
                <Text style={styles.eventText}>{formatDate(item.Date)}</Text>
                <Text style={styles.eventText}>{item.Location}</Text>
                <Text style={styles.eventDescription}>{item.Description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="contained" 
                  buttonColor="#00ffcc"
                  textColor="#121212"
                  onPress={() => handleBuyPress(item)}
                >
                  Comprar
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
      )}

      {/* Modal de Confirmação */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Deseja confirmar a compra do ticket para o evento "{selectedEvent?.Name}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleConfirmPurchase}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔥 **Estilos Dark Mode Neon**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  noEventsText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 5,
  },
  eventTitle: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
  },
  eventDescription: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  confirmButton: {
    backgroundColor: '#00ffcc',
  },
  modalButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BuyerEvents;
