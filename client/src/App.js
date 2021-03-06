import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import jwt from "jsonwebtoken";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/Persistent/Navbar";
import Footer from "./components/Persistent/Footer";
import Home from "./pages/Home/Home";
import AboutMe from "./pages/AboutMe/AboutMe";
import CA from "./pages/CA/CA";
import Dashboard from "./pages/Dashboard/Dashboard";
import FindFriend from "./pages/FindFriends/FindFriend";
import AddGame from "./pages/AddGame/AddGame";
import NoMatch from "./pages/NoMatch/NoMatch";

function App() {
  const [userObject, setUserObject] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkForToken();
  }, []);

  const checkForToken = async () => {
    const tokenFromStorage = await sessionStorage.getItem("jwt");
    if (tokenFromStorage) {
      setIsLoggedIn(true);
      try {
        const decoded = await jwt.verify(
          tokenFromStorage,
          process.env.REACT_APP_SECRET_KEY
        );
        if (decoded && decoded.email && decoded.id) {
          setUserObject(decoded);
          setIsLoggedIn(true);
        }
      } catch (e) {
        setUserObject({});
        setIsLoggedIn(false);
        sessionStorage.setItem("jwt", "");
        console.error(e);
      }
    }
  };

  const logOutUser = () => {
    setUserObject({});
    setIsLoggedIn(false);
    sessionStorage.setItem("jwt", "");
  };

  return (
    <Router>
      <header></header>
      <main>
        <div>
          <NavBar
            isLoggedIn={isLoggedIn}
            logOutUser={logOutUser}
            userObject={userObject}
          />
          <Switch>
            <Route
              exact
              path={["/", "/landing"]}
              render={(props) => (
                <Home {...props} checkForToken={checkForToken} />
              )}
            />
            <Route
              path={["/account/:id"]}
              render={(props) => <AboutMe {...props} logOutUser={logOutUser}/>}
            />
            <Route path={["/createAccount"]}
            render={(props) => <CA {...props} checkForToken={checkForToken}/>}/>
            <Route
              path={["/dashboard/:id"]}
              render={(props) => <Dashboard {...props} />}
            />
            <Route
              path={["/findfriends/:id"]}
              render={(props) => <FindFriend {...props} />}
            />
            <Route
              path={["/addgame/:id"]}
              render={(props) => <AddGame {...props} />}
            />
            <Route>
              <NoMatch exact path={["*"]} />
            </Route>
          </Switch>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </Router>
  );
}

export default App;
