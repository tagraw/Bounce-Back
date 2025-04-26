import React from 'react';
import { ScrollView } from 'react-native';
import { Conditions } from '../../services/termsAndConditions';

export default function Terms() {
  return (
    <ScrollView>
      <Conditions/>
    </ScrollView>
  );
}