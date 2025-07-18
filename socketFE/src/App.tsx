import { useEffect, useState } from "react";
import "./App.css";

type BackendData = {
  message: string;
};

function App() {
  const [data, setData] = useState<BackendData | null>(null);

  useEffect(() => {
    // Example of fetching data from the backend
    fetch("http://localhost:8888/")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Data fetched from backend:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <p>{data?.message}</p>
    </>
  );
}

export default App;
