import React, { useState, useEffect } from "react";

const initialLocationState = {
  latitude: null,
  longitude: null,
  speed: null
};
// To prevent memory leaks from API listeners that cannot be unmounted
let mounted = true;
const App = () => {
  const [count, setCount] = useState(0);
  const [isOn, setIsOn] = useState(false);

  const [mousePosition, setMousePosition] = useState({
    x: null,
    y: null
  });

  const [status, setStatus] = useState(navigator.online);

  const [{ latitude, longitude, speed }, setLocation] = useState(
    initialLocationState
  );

  /*
   * The effect function is the function inside the useEffect call
   * The effect function is called after every render
   */

  useEffect(() => {
    document.title = `Clicked ${count} times`;
    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    navigator.geolocation.getCurrentPosition(handleGeolocation);
    const watchId = navigator.geolocation.watchPosition(handleGeolocation);

    // Clean up function that runs after evey render
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.geolocation.clearWatch(watchId);
      mounted = false;
    };
  }, [count]); // Dependencies for running the effect function

  const handleMouseMove = event => {
    setMousePosition({
      x: event.pageX,
      y: event.pageY
    });
  };

  const handleOnline = () => {
    setStatus(true);
  };

  const handleOffline = () => {
    setStatus(false);
  };

  const handleGeolocation = event => {
    mounted &&
      setLocation({
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
        speed: event.coords.speed
      });
  };

  return (
    <>
      <h2>Counter</h2>
      <button
        onClick={() => {
          setCount(prevCount => prevCount + 1);
        }}
      >
        I have been clicked {count} times
      </button>

      <h2>Light switch</h2>
      <img
        src={
          isOn
            ? "https://icon.now.sh/highlight/fd0"
            : "https://icon.now.sh/highlight/aaa"
        }
        onClick={() => {
          setIsOn(prevIsOn => !prevIsOn);
        }}
        style={{
          width: "50px",
          height: "50px"
        }}
        alt={"Icon"}
      />

      <h2>Mouse Position</h2>
      <div> X position: ${mousePosition.x}</div>
      <div> Y position: ${mousePosition.y}</div>

      <h2>Network Status</h2>
      <p>You are {status ? "online" : "offline"}</p>

      <h2>GeoLocation</h2>
      <p>Latitude is {latitude}</p>
      <p>Longitude is {longitude}</p>
      <p>Speed is {speed ? speed : "0"}</p>
    </>
  );
};

export default App;
