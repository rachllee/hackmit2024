import React from 'react';
import { SafeAreaView, View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Avatar, Button, Card, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SellView({ route }) {
    const { stock } = route.params;
    const { stockPrice } = route.params;
    const { conversionRate } = route.params;
    const { stocksOwned } = route.params;
    // const stockPrice = 67;
    // const stocksOwned = 10;
    const navigation = useNavigation();
    const [text, setText] = React.useState("");

    const gems = 5550;
    // const conversionRate = 0.001;

    const numberOfStocks = parseFloat(text) || 0;
    const totalCostInUSD = numberOfStocks * stockPrice;
    const totalGems = totalCostInUSD / conversionRate;

    const handleSellPress = () => {
        if (isNaN(numberOfStocks) || numberOfStocks <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid number of stocks.");
        } else if (stocksOwned < numberOfStocks) {
            Alert.alert("Insufficient Stocks", "You don't have enough stocks to sell this many.");
        } else {
            navigation.navigate('SuccessView');
        }
    };
  
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.gemCountContainer}>
                <Text style={styles.gemCountText}>{gems} 💎</Text>
            </View>

            <Text style={styles.stockTitle}>
                Selling <Text style={{ fontWeight: 'bold', color: '#6200ee' }}>{stock}</Text>
            </Text>

            <Text style={styles.stockSubTitle}>You own {stocksOwned} {stock} stocks</Text>
            <Text style={[styles.stockSubTitle, { color: '#6200ee' }]}>How many stocks?</Text>
            <TextInput
                // label="Number of shares"
                value={text}
                onChangeText={text => setText(text)}
            />

            <View style={{ alignItems: 'center', paddingTop: 10 }}>
                <Text style={styles.gemsText}>
                = {totalCostInUSD.toFixed(2)} USD
                </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text style={styles.gemsText}>
                = {Math.round(totalGems)} 💎
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={() => handleSellPress()}
                style={styles.button}
            >
                Sell
            </Button>
        </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    gemCountContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 10,
        marginTop: 60,
    },
    gemCountText: {
        fontSize: 18,
        color: '#6200ee',
        fontWeight: 'bold',
    },
    stockTitle: {
        fontFamily: 'Lato_700Bold',
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        fontSize: 40,
        marginVertical: 10,
    },
    stockSubTitle: {
        fontFamily: 'Lato_400Regular',
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 10,
    },
    gemsText: {
        fontFamily: 'Lato_400Regular',
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    button: {
        fontFamily: 'Lato_700Bold',
        margin: 20,
        padding: 10,
        backgroundColor: '#6200ee',
    },
});

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    stockTitle: {
        fontFamily: 'Lato_700Bold',
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        fontSize: 40,
        marginVertical: 10,
    },
    stockSubTitle: {
        fontFamily: 'Lato_400Regular',
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 10,
    },
    button: {
        fontFamily: 'Lato_700Bold',
        margin: 20,
        padding: 10,
        backgroundColor: '#6200ee',
    },
});