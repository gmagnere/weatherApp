import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, FlatList, ActivityIndicator, Image, ImageBackground } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const image = {uri: "https://i.stack.imgur.com/jGlzr.png"};
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [])

  // const getMovies = async () => {
  //   try {
  //     const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=8d2123a11118353aa3c434fa7e8678c5&units=metric&lang=fr');
  //     const json = await response.json();
  //     setData(json);
  //     console.log(json);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const getCity = async () => {
    //console.log(latitude)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=8d2123a11118353aa3c434fa7e8678c5&units=metric&lang=fr`)
        .then(response => response.json())
        .then(data => {
          setData(data);
          console.log(data)
          console.log(data.weather[0].description)
        });
  }

  const getForecast = async () => {
    //console.log(latitude)
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&exclude={part}&appid=8d2123a11118353aa3c434fa7e8678c5&units=metric&lang=fr`)
        .then(response => response.json())
        .then(forecast => {
          setForecast(forecast);
          console.log(forecast)
        });
  }

  const Item = ({ title }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
  )

  const renderItem = ({ item }) => (
      <View >
            <Text>
             <Item title={'Température en journée : '+item.temp.morn} />
            </Text>
              <Text>
                  <Item title={'Température l\'après-midi : '+item.temp.eve} />
              </Text>
              <Text>
                  <Item title={'Température en matinée : '+item.temp.day} />
              </Text>
              <Text>
                  <Item title={'Température en soirée : '+item.temp.night} />
              </Text>
              <Text>
                  <Item title={'Température Max : '+item.temp.max} />
              </Text>
              <Text>
                  <Item title={'Température en minimal : '+item.temp.min} />
              </Text>
      </View>
  );

  useEffect(() => {
    location && getCity();
    location && getForecast();
  }, [location]);

  let text = <ActivityIndicator size="small" color="#0000ff" />;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = <Text></Text>;
  }

  return (
      <View style={styles.container}>
          <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View style={styles.text}>
                    {data.weather && (
                        <>
                            {text}
                            <FlatList
                                data={forecast.daily}
                                renderItem={renderItem}
                                keyExtractor={item => item.dt}
                            />
                            <Text>Vous êtes à : {data.name}</Text>
                            <Text>Il fait : {data.main?.temp} c°</Text>
                            <Text>Le temps : {data.weather[0].description} </Text>
                            <Image
                                style={styles.tinyLogo}
                                source = {{ uri: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
                                    //uri: 'http://openweathermap.org/img/w/01n.png'
                                }}/>
                        </>
                    )
                    }
                </View>
            </ImageBackground>
          </View>
          );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  tinyLogo: {
    width: 50,
    height: 50,
  },

  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },

    text: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

    item: {
        backgroundColor: '#156988',
        padding: 20,
        marginTop: 30,
        marginVertical: 1,
        marginHorizontal: 16,
        flexDirection: "row",
    },
});
