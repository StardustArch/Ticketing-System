import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { getFutureEvents } from '../../services/eventService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from 'react-native-paper';

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

const BuyerEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const futureEvents = await getFutureEvents();
        setEvents(futureEvents);
      } catch (err) {
        setError('Não foi possível carregar os eventos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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
      {events.length === 0 ? (
        <Text style={styles.noEventsText}>Nenhum evento encontrado.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.ID}
          renderItem={({ item }) => (
            <Card style={styles.eventCard}>
              <Card.Title title={item.Name} titleStyle={styles.eventTitle} />
              <Card.Content>
                <Text style={styles.eventText}>{formatDate(item.Date)}</Text>
                <Text style={styles.eventText}>{item.Location}</Text>
                <Text style={styles.eventDescription}>{item.Description}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
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
    marginTop: 40,  // Adicionando margem superior para distanciar do topo

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
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    padding: 10,
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
});

export default BuyerEvents;
