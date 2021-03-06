import React, { Component } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import axios from "axios"

class Home extends Component {
  state = {
    email: "",
    password: "",
    error: "",
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      error: "",
    });
  };

  handleSubmit = (event, email, password) => {
    event.preventDefault();
    axios
      .post("/api/auth", {
        email,
        password,
      })
      .then(async (response) => {
        console.log(response.data.data);
        if (response.data.success) {
          const decoded = await jwt.verify(
            response.data.data,
            process.env.REACT_APP_SECRET_KEY
          );
          console.log(decoded);
          await sessionStorage.setItem("jwt", response.data.data);
          await this.props.checkForToken();
          await this.props.history.push(`/dashboard/${decoded.id}`);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  render() {
    return (
      <div className="container center">
        <h1 id="FFheadText"> Welcome to FriendlyFire! </h1>
        <br />
        <div className="row">
          <form className="col s12 center" onSubmit={(event)=>this.handleSubmit(event, this.state.email, this.state.password)}>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">account_circle</i>
                <input id="icon_prefix" type="text" name="email" onChange={this.handleInputChange}/>
                <label for="icon_prefix">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">sms</i>
                <input id="icon_sms" type="password" name="password" onChange={this.handleInputChange}/>
                <label for="icon_">Password</label>
              </div>
            </div>
          <div className="row">
            <button
              className="btn waves-effect waves-light"
              href="/dashboard"
              id="ButtonColor"
              type="submit"
              name="action"
            >
              Sign in!
              <i className="material-icons right">send</i>
            </button>
          </div>
          </form>
          <div className="row">
            <a
              className="waves-effect waves-light btn"
              id="ButtonColor"
              href="/createAccount"
            >
              <i className="material-icons left">cloud</i>Create a new account?
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
