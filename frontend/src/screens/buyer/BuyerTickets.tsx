import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getTickets } from '../../services/ticketService';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo de ticket
type Ticket = {
  id: string;
  eventName: string;
  eventDate: string;
  quantity: number;
  qrCode: string;
};

const formatDate = (isoString: string) => {
  return format(new Date(isoString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};

const BuyerTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData = await getTickets();
        setTickets(ticketsData);
      } catch (err) {
        setError('Erro ao carregar os tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const renderTicket = ({ item }: { item: Ticket }) => (
    <Card style={styles.ticketCard}>
      <Card.Title title={item.eventName} titleStyle={styles.ticketTitle} />
      <Card.Content>
        <Text style={styles.ticketText}>🎟 Quantidade: {item.quantity}</Text>
        <Text style={styles.ticketText}>📅 Data: {formatDate(item.eventDate)}</Text>
        <Text style={styles.ticketText}>🔗 QR Code: {item.qrCode}</Text>
      </Card.Content>
      <Card.Actions>
        <MaterialIcons name="qr-code" color="#00ffcc" size={24} />
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.loadingText}>Carregando seus tickets...</Text>
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
      <Text style={styles.title}>🎟 Meus Tickets</Text>

      {tickets.length === 0 ? (
        <Text style={styles.noTicketsText}>Você ainda não comprou tickets.</Text>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,  // Adicionando margem superior para distanciar do topo
  },
  ticketCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#00ffcc',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  ticketTitle: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ticketText: {
    color: '#fff',
    fontSize: 16,
  },
  noTicketsText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default BuyerTickets;
