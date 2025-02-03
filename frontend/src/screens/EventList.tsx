import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { getEvents, updateEvent, deleteEvent, addEvent } from '../services/eventService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, FAB, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Ícones modernos

// Função para formatar a data
const formatDate = (isoString: string) => {
  return format(new Date(isoString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};

const Events = () => {
  const [events, setEvents] = useState<{ ID: string; Name: string; Date: string; Location: string; Description: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados para o novo evento
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null); // Estado para hover nos cards

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    console.log('🔵 fetchEvents iniciado...');
    setLoading(true);
    try {
      const data = await getEvents();
      console.log('✅ fetchEvents sucesso:', data);
      setEvents(data);
    } catch (err: any) {
      setError('Falha ao carregar eventos');
      console.error('❌ fetchEvents erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar evento
  const handleAddEvent = async () => {
    const event = {
      Name: newEventName,
      Description: newEventDescription,
      Location: newEventLocation,
      Date: newEventDate,
    };

    try {
      await addEvent(event);  // Chama o método addEvent do seu service
      fetchEvents(); // Atualiza a lista de eventos após adicionar
      setNewEventDate("")
      setNewEventDescription("")
      setNewEventLocation("")
      setNewEventName("")
      setModalVisible(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };

 // Função para editar evento
const handleEditEvent = async (eventID: string) => {
  setEditModalVisible(true); // Exibe o modal de edição
  setNewEventName(''); // Limpa o campo de entrada

  const handleSaveEdit = async () => {
    if (newEventName.trim()) {
      try {
        await updateEvent(eventID, { Name: newEventName });
        Alert.alert('Sucesso', 'Evento atualizado!');
        fetchEvents();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o evento.');
      }
    } else {
      Alert.alert('Erro', 'O nome do evento não pode estar vazio.');
    }
    setEditModalVisible(false); // Fecha o modal após salvar
  };

  return (
    <>
      {/* Modal de Edição */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Evento</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Nome do Evento"
              value={newEventName}
              onChangeText={setNewEventName}
            />
            <Button mode="contained" onPress={handleSaveEdit} style={styles.modalButton}>
              Salvar
            </Button>
            <Button mode="text" onPress={() => setEditModalVisible(false)} color="red">
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Função para deletar evento
const handleDeleteEvent = async (eventID: string) => {
  Alert.alert('Confirmar Exclusão', 'Tem certeza que deseja excluir este evento?', [
    { text: 'Cancelar', style: 'cancel' },
    {
      text: 'Excluir',
      style: 'destructive',
      onPress: async () => {
        try {
          await deleteEvent(eventID);
          Alert.alert('Sucesso', 'Evento excluído!');
          fetchEvents();
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível excluir o evento.');
        }
      },
    },
  ]);
};
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
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
      <Text style={styles.heading}>Meus Eventos</Text>
      {events.length === 0 ? (
        <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.ID}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.eventCard,
                hoveredCard === item.ID && styles.cardHovered, // Aplica o estilo de hover
              ]}
              key={item.ID}
              onPointerEnter={() => setHoveredCard(item.ID)} // Quando o mouse entra
              onPointerLeave={() => setHoveredCard(null)} // Quando o mouse sai
            >
              <Card.Title title={item.Name} titleStyle={styles.eventTitle} />
              <Card.Content>
                <Text style={styles.eventText}>{formatDate(item.Date)}</Text>
                <Text style={styles.eventText}>{item.Location}</Text>
                <Text style={styles.eventDescription}>{item.Description}</Text>
              </Card.Content>
              <Card.Actions>
                <MaterialIcons name="edit" color="#00ffcc" size={24} onPress={() => handleEditEvent(item.ID)} />
                <MaterialIcons name="delete" color="red" size={24} onPress={() => handleDeleteEvent(item.ID)} />

              </Card.Actions>
            </Card>
          )}
        />
      )}

      {/* Botão Flutuante */}
      <FAB style={styles.fab} icon="plus" onPress={() => setModalVisible(true)} />

      {/* Modal para adicionar evento */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Evento</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Evento"
              placeholderTextColor="#aaa"
              value={newEventName}
              onChangeText={setNewEventName}
            />

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#aaa"
              value={newEventDescription}
              onChangeText={setNewEventDescription}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Local"
              placeholderTextColor="#aaa"
              value={newEventLocation}
              onChangeText={setNewEventLocation}
            />

            <TextInput
              style={styles.input}
              placeholder="Data (ex: 2025-03-01T12:00:00Z)"
              placeholderTextColor="#aaa"
              value={newEventDate}
              onChangeText={setNewEventDate}
            />

            <Button mode="contained" onPress={handleAddEvent} style={styles.modalButton}>
              Adicionar
            </Button>

            <Button mode="text" onPress={() => setModalVisible(false)} color="red">
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos Neon
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
  noEventsText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHovered: {
    elevation: 15, // Efeito de flutuação (shadow mais forte)
    shadowRadius: 15, // Aumenta a sombra
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#00ffcc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    color: '#fff',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#00ffcc',
    width: '100%',
    marginBottom: 10,
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
  }
});

export default Events;
