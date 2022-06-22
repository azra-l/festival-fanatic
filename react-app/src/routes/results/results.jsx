import Navbar from "../../components/Navbar/Navbar";
import FestivalCard from "../../components/FestivalCard/FestivalCard";
import "./results.css";
import { useSelector } from "react-redux";

export default function Results() {
  const dummyFestivals = useSelector(
    (state) => state.festivals.festivals
  );
  return (
    <>
      <Navbar />
      <h2>Your results</h2>

      {dummyFestivals ? (
        dummyFestivals.map((festival) => (
          <FestivalCard festival={festival} key={festival.id} />
        ))
      ) : (
        <p>Loading or Error, No data {JSON.stringify(dummyFestivals)}</p>
      )}
    </>
  );
}
