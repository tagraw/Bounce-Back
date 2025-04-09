import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';  

export default StyleSheet.create({
    text: {
        fontFamily: 'Baloo-Regular', // Make sure the font is loaded properly
        fontSize: 24,
      },
      container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100vw',
        maxWidth: '100%',
        paddingHorizontal: '20vw',
        marginHorizontal: 0,
        paddingTop: 30,
        //alignItems: 'center',
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Baloo-Regular',
        paddingTop: 40,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#508E5F', // Green text
        marginBottom: 5,
        fontFamily: 'Baloo-Regular', 
      },
      subtext: {
        fontSize: 12,
        color: '#777',
        marginBottom: 20,
        fontFamily: 'Baloo-Regular', 
        paddingBottom: 20,
      },
      input: {
        width: '100%',
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#FCFBE5',
        borderRadius: 25,
        fontSize: 12,
        fontFamily: 'Baloo-Regular', 
        height: 40,
      },
      rememberMe: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      
      button: {
        backgroundColor: '#FFD5D5',
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 20,
        height: 40,
        alignItems: 'center',  // center horizontally 
        justifyContent: 'center',  // center vertically
        fontFamily: 'Baloo-Regular', 
      },
      buttonText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Baloo-Regular', 
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      footerText: {
        fontSize: 14,
        color: '#777',
        fontFamily: 'Baloo-Regular', 
      },
      signUpText: {
        fontSize: 14,
        color: '#555',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontFamily: 'Baloo-Regular', 
      },
    });
    