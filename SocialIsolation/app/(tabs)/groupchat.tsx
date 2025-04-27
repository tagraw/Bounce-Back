import React from 'react';
import { ScrollView } from 'react-native';
import { MessagesScreen } from '../../services/groupchat';

export default function Index() {
  return (
    <ScrollView>
      <MessagesScreen/>
    </ScrollView>
  );
}


