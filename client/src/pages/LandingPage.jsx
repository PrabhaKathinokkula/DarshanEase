import { Link } from "react-router-dom";
import "./LandingPage.css";

const temples = [
  {
    id: 1,
    name: "Tirumala Tirupati",
    place: "Andhra Pradesh",
    image: "/images/tirumala.jpg"
  },
  {
    id: 2,
    name: "Srisailam",
    place: "Andhra Pradesh",
    image: "/images/Srisailam.jpg"
  },
  {
    id: 3,
    name: "Yadadri",
    place: "Telangana",
    image: "/images/Yadadri.jpg"
  }
];

function LandingPage() {
  return (
    <>
      <section className="hero">

        <div className="hero-content">

          <h1>Welcome to DarshanEase</h1>

         
          <Link to="/temples">
            <button>Explore Temples</button>
          </Link>

        </div>

      </section>

      <section className="featured">

        <h2>Popular Temples</h2>

        <div className="cards">

          {temples.map((temple) => (

            <div className="card" key={temple.id}>

              <img src={temple.image} alt={temple.name} />

              <h3>{temple.name}</h3>

              <p>{temple.place}</p>

              <Link to="/temples">
                <button>View Darshan</button>
              </Link>

            </div>

          ))}

        </div>

      </section>

      <footer>

        <h3>DarshanEase © 2026</h3>

        <p>
          Book temple darshan tickets with ease.
        </p>

      </footer>

    </>
  );
}

export default LandingPage;