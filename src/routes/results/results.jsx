import Navbar from "../../components/Navbar/Navbar";
import FestivalCard from "../../components/FestivalCard/FestivalCard";
import "./results.css";
import { dummyFestivals } from "../../utilities/festivalResultData";


export default function Results() {
  return (
    <>
      <Navbar />
      <h2>Your results</h2>
      {dummyFestivals.map((festival) => (
        <FestivalCard festival={festival} key={festival.id} />
      ))}
    </>
  );
}
