import React from 'react';
import { Modal, View, Pressable, Text, ScrollView, StyleSheet } from 'react-native';

const ModalComponent = ({ modalVisible, closeModal, navigation, handleLogout }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            <Pressable onPress={() => navigation.navigate('ProblemList')} style={styles.modalOption}>
              <Text style={[styles.modalOptionText]}>Ver meus problemas</Text>
            </Pressable>
            <Pressable onPress={handleLogout} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, {color: 'blue'}]}>Fazer Logoff</Text>
            </Pressable>
            <Pressable onPress={closeModal} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, {color: 'red'}]}>Fechar Menu</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ModalComponent;
