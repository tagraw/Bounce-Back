import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MyBucketList from '../(tabs)/mybucketlist';
const Stack = createNativeStackNavigator();
import SingleBucketItem from '../screens/singularbucketitem';

export default function StackNavigator() {
  return (
    <NavigationContainer>
        <Stack.Screen name="MyBucketList" component={MyBucketList} />
        <Stack.Screen name="SingularBucketList" component ={SingleBucketItem} />
    </NavigationContainer>
  );
}