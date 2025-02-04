import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getTickets } from '../../services/ticketService';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import QRCodeSVG from 'react-native-qrcode-svg';  // Assumindo que você esteja usando esta lib


// Tipo de ticket
type Ticket = {
  Token: any;
  Event: any;
  ID: string;
  eventName: string;
  eventDate: string;
  QRCode: string;
};

const formatDate = (isoString: string) => {
  return format(new Date(isoString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};

const BuyerTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);  // Para armazenar o ticket selecionado
  const [showQRCode, setShowQRCode] = useState(false);  // Controla a visibilidade do QR Code
  const [refreshing, setRefreshing] = useState(false);  // Estado para controlar o status de refresh

  // Função para carregar tickets
  const fetchTickets = async () => {
    setRefreshing(true); // Iniciar o refresh
    try {
      const ticketsData = await getTickets();
      setTickets(ticketsData);
    } catch (err) {
      setError('Erro ao carregar os tickets');
    } finally {
      setRefreshing(false); // Finalizar o refresh
      setLoading(false);
    }
  };

  // UseEffect para carregar os tickets ao inicializar o componente
  useEffect(() => {
    fetchTickets();
  }, []);

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity onPress={() => setSelectedTicket(item)}>
      <Card style={styles.ticketCard}>
        <Card.Title title={item.Event.Name} titleStyle={styles.ticketTitle} />
        <Card.Content>
          <Text style={styles.ticketText}>📅 Data: {formatDate(item.Event.Date)}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
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
          keyExtractor={(item) => item.ID}
          refreshing={refreshing}  // Controla o estado de refresh
          onRefresh={fetchTickets}  // Ação ao realizar o pull-to-refresh
        />
      )}

      {/* Modal para exibir as informações do ticket */}
      <Modal
        visible={selectedTicket !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              {selectedTicket && (
                <>
                  <Text style={styles.modalTitle}>{selectedTicket.Event.Name}</Text>
                  <Text style={styles.modalSubtitle}>Organizado por: {selectedTicket.Event.Organizer.Name}</Text>
                  <Text style={styles.modalText}>📅 Data: {formatDate(selectedTicket.Event.Date)}</Text>
                  <Text style={styles.modalText}>📍 Local: {selectedTicket.Event.Location}</Text>
                  <Text style={styles.modalText}>📋 Descrição: {selectedTicket.Event.Description}</Text>
                </>
              )}
            </ScrollView>

            {/* Botão para abrir QR Code */}
            <TouchableOpacity
              style={styles.qrCodeButton}
              onPress={() => setShowQRCode(true)}
            >
              <MaterialIcons name="qr-code" color="black" size={24} /><Text style={styles.qrCodeButtonText}>Exibir QR Code  </Text>
            </TouchableOpacity>

            {/* Fechar Modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedTicket(null)}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para exibir o QR Code */}
      <Modal
        visible={showQRCode}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
          <Text> </Text>
          <Text> </Text>

            <View style={styles.qrCodeContainer}>
              {selectedTicket && (
                <QRCodeSVG
                  value={`data:image/png;base64,${selectedTicket.Token}`}
                  size={300}
                  color="#00ffcc"  // Cor do código
                  backgroundColor="#1e1e1e"
                />
              )}
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              </View>

            {/* Fechar Modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowQRCode(false)}>
              <Text style={styles.closeText}>Fechar QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 40,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    padding: 20,
    height: '80%'
  },
  modalContent: {
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#00ffcc',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  qrCodeButton: {
    backgroundColor: '#00ffcc',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  qrCodeButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    padding: 5,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#00ffcc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BuyerTickets;
