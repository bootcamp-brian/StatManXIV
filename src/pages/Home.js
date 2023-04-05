
import { useOutletContext } from "react-router-dom";
import Spreadsheet from "../components/Spreadsheet";
import { useState, useEffect } from "react";
import { getStatics } from "../proxy";

const Home = () => {
    const [statics, setStatics] = useState([]);
    const [token, setToken] = useOutletContext();

    const renderStatics = async () => {
      const fetchedStatics = await getStatics(token);
      setStatics(fetchedStatics.statics);
    }
  
    useEffect(() => {
      renderStatics();
    }, [])

    return <>
      {
        statics && statics.length > 0 &&
        statics.map(staticInfo => {
          return <Spreadsheet key={staticInfo.id} staticInfo={staticInfo} renderStatics={renderStatics} />
        })
      }
    </>
}

export default Home;