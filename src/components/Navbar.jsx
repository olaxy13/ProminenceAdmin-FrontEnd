import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: 16 }}>
        Home
      </Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
