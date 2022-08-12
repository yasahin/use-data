import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// or less ideally
import { Button, Table } from "react-bootstrap";
import { render } from "@testing-library/react";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [capitalSearch, setCapitalSearch] = useState("");
  const [renderList, setRenderList] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v2/all")
      .then((response) => setCountries(response.data))
      .catch((error) => console.log({ error }));
  }, []);

  // render logic
  useEffect(() => {
    // case: search & no capital search
    if (search && capitalSearch === "") {
      const list = searchAll(search);
      return setRenderList(list);
    }

    // case: search & capital search
    if (search && capitalSearch) {
      const list = searchAll(search);
      const list2 = list.filter((country) =>
        (country.capital || "")
          .toLowerCase()
          .includes(capitalSearch.toLowerCase())
      );
      return setRenderList(list2);
    }

    // case: no search & capital search
    if (search === "" && capitalSearch) {
      const list = countries.filter((country) =>
        (country.capital || "")
          .toLowerCase()
          .includes(capitalSearch.toLowerCase())
      );
      return setRenderList(list);
    }

    // case: no search & no capital search
    if (search === "" && capitalSearch === "") {
      return setRenderList(countries);
    }
  }, [search, countries, capitalSearch]);

  const searchAll = (searchTerm) => {
    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.capital || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        country.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  return (
    <div style={{ backgroundColor: "#2C3034" }}>
      <input
        type="text"
        placeholder="Search..."
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        className="all-search"
      />
      <input
        type="text"
        placeholder="Capital Search..."
        onChange={(event) => {
          setCapitalSearch(event.target.value);
        }}
        className="capital-search"
      />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Country</th>
            <th>Capital</th>
            <th>Region</th>
            <th>Flag</th>
          </tr>
        </thead>
        {renderList.map((country, key) => {
          return (
            <tbody key={key}>
              <tr style={{ width: "100%" }}>
                <td>{country.name}</td>
                <td>{country.capital}</td>
                <td>{country.region}</td>
                <td>
                  <img
                    style={{ width: "100px", backgroundColor: "black" }}
                    src={country.flag}
                  />
                </td>
              </tr>
            </tbody>
          );
        })}
      </Table>
    </div>
  );
}

export default App;
