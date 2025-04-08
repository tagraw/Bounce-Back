import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ccc',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_400Regular',
          fontSize: 11,
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2C5F2D', // deep green to match Figma
          height: 70,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingBottom: 10,
          paddingTop: 5,
          borderTopWidth: 0,
          elevation: 8, // optional shadow for iOS/Android
        }
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="addbucketitems"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="mybucketlist"
        options={{
          title: 'My List',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} color={color} size={22} />
          ),
        }}
        
      />
      <Tabs.Screen
        name="groupmembers"
        options={{
          title: 'group',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="singularbucketitem"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={22} />
          ),
          tabBarButton: () => null, // Hide from tab bar navigation
        }}
      />
      
    </Tabs>
  );
}
