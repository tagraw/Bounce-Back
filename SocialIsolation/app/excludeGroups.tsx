import React from 'react';
import { ScrollView } from 'react-native';
import { ExcludeGroups } from '../services/grouprequests';

export default function SuggestGroups () {
  return (
    <ScrollView>
      <ExcludeGroups/>
    </ScrollView>
  );
}