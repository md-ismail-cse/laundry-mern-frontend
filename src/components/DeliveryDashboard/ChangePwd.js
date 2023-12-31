import React, { useEffect, useState } from "react";
// import Modal from 'react-modal';
// import { useReactToPrint } from 'react-to-print';
import { Col, Container, Row } from "reactstrap";
import "./dashboard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Profile from "./Profile";
import Loader from "../loader/Loader";

const ChangePwd = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentThumb, setThumb] = useState("");

  // GET CUSTOMER DETAILS
  const id = localStorage.getItem("dID");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fatchCustomer = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + `/api/admin/delivery-men/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("dToken"),
          },
        }
      );
      setThumb(data.thumb);
      setEmail(data.email);
      setLoading(true);
    };
    fatchCustomer();
  }, [id]);

  const update = (e) => {
    e.preventDefault();
    if (newPassword === conPassword) {
      let updateData = {
        oldPassword,
        newPassword,
        email,
        thumb: currentThumb,
      };
      axios
        .put(
          process.env.REACT_APP_SERVER +
            `/api/admin/delivery-men/${id}?cthumb=${currentThumb}`,
          updateData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("dToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Something wrong.") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data.message,
            });
          } else if (response.data.message === "Old password doesn't match.") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data.message,
            });
          } else {
            Swal.fire({
              icon: "success",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1000,
            }).then(() => (window.location.href = "/delivery"));
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Update field!",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "Confirm password doesn't match.",
      });
    }
  };

  if (!localStorage.getItem("dToken")) {
    window.location.href = "/delivery-login";
  } else {
    return (
      <>
        <Container>
          <div className="d-flex justify-content-center mb-4">
            <h2 className="text-danger head-title mt-5">Settings</h2>
          </div>
          <Row>
            <Col md={4} className="mb-5">
              <Profile />
            </Col>
            <Col md={8}>
              <div className="settings">
                {loading ? (
                  <form className="sign-up-form">
                    <h3
                      className="title"
                      style={{
                        fontFamily: "Handlee, cursive",
                        color: "#ff3636",
                      }}
                    >
                      Change Password
                    </h3>

                    <div className="input-field">
                      <FontAwesomeIcon icon={faUser} className="input-fieldi" />
                      <input
                        type="password"
                        name="old-name"
                        id="old-password"
                        autoComplete="off"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Old password"
                      />
                    </div>

                    <div className="input-field">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="input-fieldi"
                      />
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        autoComplete="off"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                      />
                    </div>
                    <div className="input-field">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="input-fieldi"
                      />
                      <input
                        type="password"
                        name="con-password"
                        id="con-password"
                        autoComplete="off"
                        value={conPassword}
                        onChange={(e) => setConPassword(e.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>

                    <button
                      className="btnz"
                      type="submit"
                      name="signup"
                      id="signup"
                      value="register"
                      onClick={update}
                    >
                      Update
                    </button>
                  </form>
                ) : (
                  <Loader />
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};

export default ChangePwd;
