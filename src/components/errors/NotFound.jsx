import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 section-notfound"
      style={{ background: "#f3f3f3" }}
    >
      <div className="text-center">
        <p className="fs-3">
          <img
            src="assets/img/44.png"
            style={{ width: "550px", height: "auto" }}
            className="img-fluid"
            alt="404 pic"
          />
        </p>
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          {" "}
          <span className="text-danger">Oops!</span> Page not found
        </p>
        <p className="lead">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="btn btn-success">
          Go To Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
