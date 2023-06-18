import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCountriesApiCall } from "../Api/ApiCalls";
import LocationIcon from "../Assets/Icons/location.png";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const customIcon = L.icon({
  iconUrl: LocationIcon,
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
});

const MapTwo = () => {
  const [countries, setCountries] = useState([]);
  const [countryData, setCountryData] = useState("");
  const [filteredCountryData, setFilteredCountryData] = useState({ data: [] });
  const [position, setPosition] = useState([20, 77]);

  function filterChatList(searchTerm) {
    const filteredList = countries?.filter((e) => {
      console.log(e, "kkkkk");
      if (searchTerm === "") {
        return true;
      }
      const nameMatch = e.name.common.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch;
    });

    return setFilteredCountryData((v) => ({
      ...v,
      data: filteredList || ["No country found"],
    }));
  }

  const getAllCountriesApi = async () => {
    try {
      const res = await getCountriesApiCall();
      if (res.status === 200) {
        let sorted = res?.data;
        sorted.sort(function (a, b) {
          if (a.name.common < b.name.common) {
            return -1;
          }
          if (a.name.common > b.name.common) {
            return 1;
          }
          return 0;
        });
        // console.log(sorted, ">>>>>>>>>>>>>>>>");
        setCountries(sorted);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllCountriesApi();
  }, []);

  useEffect(() => {
    setFilteredCountryData({ data: countries || [] });
  }, [countries]);

  // console.log(countryData, "LLLLLLLLLLLLLLLLLLLLL");

  return (
    <div>
      <h1>World Map 2</h1>
      <div className='row'>
        <div className='col-9'>
          <MapContainer center={[0, 0]} zoom={2.5} style={{ height: "700px", width: "100%" }}>
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='Map data &copy; <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customIcon} />
          </MapContainer>
        </div>
        <div className='col-3 list-group'>
          <div className=' position-relative'>
            <input
              className='form-control w-100  ps-5 py-2 input-bg border-0  bg-light'
              placeholder='Search...'
              onChange={(e) => {
                filterChatList(e.target.value);
              }}
            />
            <i
              className='bi bi-search position-absolute h5'
              style={{ top: "10px", left: "10px", color: "#28599B" }}></i>
          </div>
          <div className='list-group' style={{ height: "320px", overflow: "hidden", overflowY: "scroll" }}>
            {filteredCountryData?.data.length > 0 &&
              filteredCountryData?.data.map((el, i) => {
                return (
                  <React.Fragment key={`${i}-country`}>
                    {/* <p>{el?.name?.common}</p> */}
                    <p
                      style={{ cursor: "pointer" }}
                      className='list-group-item list-group-item-action'
                      onClick={() => {
                        setCountryData(el);
                        setPosition(el?.latlng);
                      }}>
                      {el?.name?.common}
                    </p>
                  </React.Fragment>
                );
              })}
          </div>
          <hr />
          <div className='' style={{ height: "320px" }}>
            <h6>Selected Country Details</h6>
            {countryData ? (
              <div className='text-start'>
                <p>Country Name : {countryData?.name?.common}</p>
                <p>Capital : {countryData?.capital}</p>
                <p>Official Country Name : {countryData?.name?.official}</p>
                <p>Region : {countryData?.region}</p>
                <p>Sub-Region : {countryData?.subregion}</p>
                <p>Population : {countryData?.population}</p>
                <p>Lat and Lng : {countryData?.latlng}</p>
              </div>
            ) : (
              <div className='text-center'>No Country Selected </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTwo;
