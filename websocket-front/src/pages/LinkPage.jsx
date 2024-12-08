import { Link } from "react-router";

const LinkPage = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        fontSize: "20px",
        flexDirection: "column",
      }}
    >
      <Link to="/websocket">websocket</Link>
      <Link to="/stomp">stomp</Link>
    </div>
  );
};

export default LinkPage;
