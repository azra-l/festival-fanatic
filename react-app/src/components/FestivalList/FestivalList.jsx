import React, { useEffect, useState } from "react";
import FestivalCard from "../FestivalCard/FestivalCard";
import "./FestivalList.css";

const FestivalList = ({ festivals }) => {
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const sortArray = (type) => {
      const types = {
        name: "name",
        date: "date",
      };
      const sortProperty = types[type];
      const sorted = [...festivals].sort((a, b) =>
        a[sortProperty].localeCompare(b[sortProperty])
      );
      setResults(sorted);
    };
    sortArray(sortBy);
  }, [festivals, sortBy]);

  return (
    <>
      <div className="sort-container">
        <label>Sort By</label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Festival name (A - Z)</option>
          <option value="date">Date (newest - oldest)</option>
          <option value="artist"> Artist name (A - Z)</option>
        </select>
      </div>

      <div className="festival-results-container">
        {results.map((result, i) => (
          <FestivalCard festival={result} key={result.id} position={i % 5} />
        ))}
      </div>
    </>
  );
};

export default FestivalList;
