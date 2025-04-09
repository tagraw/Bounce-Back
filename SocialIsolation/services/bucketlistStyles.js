import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';

export default StyleSheet.create({
  text: {
    fontFamily: 'Baloo-Regular',
    fontSize: 24,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100vw',
    maxWidth: '100%',
    marginHorizontal: 0,
    //alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffff',
    fontFamily: 'Baloo-Regular',
    paddingTop: 40,
  },

  bucketListNames: {
    fontFamily: 'Solway-Regular',
    fontSize: 7,
    backgroundColor: '#FFD5D5',
    color: '#333',
    borderRadius: 20,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    overflow: 'hidden',
    marginTop: 4,
    alignSelf: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    width: 110,
  },

  bucketlistContainer: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 110,
    position: 'relative',  // Ensures the positioning of the image on top of the square
  },

  bucketlistImage: {
    position: 'absolute',  // Position the image on top of the gray square
    width: 110,
    height: 110,
    borderRadius: 12,
    top: -8,
  },

  defaultSquare:{
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#cccccc', // light gray
  },

  nextButton: {
    backgroundColor: '#FFD5D5',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 20,
  },

  nextButtonText: {
    fontFamily: 'Baloo-Regular',
    fontSize: 18,
    color: '#333',
  }
});