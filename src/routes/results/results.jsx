import Navbar from "../../components/Navbar/Navbar";
import FestivalCard from "../../components/FestivalCard/FestivalCard";
import "./results.css";

const dummyFestivals = [
  {
    id: 1,
    date: "2022-10-10",
    name: "Fvded in the Park",
    city: "Vancouver",
    state: "BC",
    img: "https://s1.ticketm.net/dam/a/b0d/9d8ae968-b74c-4c58-bc9f-654481699b0d_1627421_TABLET_LANDSCAPE_LARGE_16_9.jpg",
  },
  {
    id: 2,
    date: "2022-12-10",
    name: "Contact",
    city: "Vancouver",
    state: "BC",
    img: "https://www.thehomoculture.com/wp-content/uploads/2014/09/10455094_761940947181161_7482336463203741510_n.jpg",
  },
];

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
