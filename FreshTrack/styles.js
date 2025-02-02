import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#ECFFDC',
    paddingHorizontal: 30,
    paddingTop: 25,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#388E3C',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'sans-serif-condensed',
  },
  item1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#A5D6A7',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
    transform: [{ scale: 1.05 }],
  },
  item2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEB3B',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
    transform: [{ scale: 1.05 }],
  },
  item3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF7043',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
    transform: [{ scale: 1.05 }],
  },
  item4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E5AA70',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
    transform: [{ scale: 1.05 }],
  },
  itemInfo: {
    flex: 1,
    paddingLeft: 15,
  },
  itemName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C6B28',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  itemDays: {
    fontSize: 16,
    color: '#388E3C',
    opacity: 0.85,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: "#A5D6A7",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
},
buttonText: {
    color: "#2C6B28",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    
},
submitButton: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 68,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
},
imageContainer: {
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
},
errorText: {
    color: "red",
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
},
textBox: {
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#34C759",
    borderRadius: 8,
    textAlign: "center",
    alignSelf: "center",
},
image: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
},
datePicker: {
    width: "80%",
    alignSelf: "center",
},


  
});

export default styles;
