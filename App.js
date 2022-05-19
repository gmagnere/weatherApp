import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

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

  useEffect(() => {
    location && getCity();
  }, [location]);

  let text = <ActivityIndicator size="small" color="#0000ff" />;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = <Text></Text>;
  }

  return (
      <View style={styles.container}>
        {data.weather && (
            <>
              {text}
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

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
