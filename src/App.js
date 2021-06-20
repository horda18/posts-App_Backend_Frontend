import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { Switch, Route, Link } from "react-router-dom";

import AddPost from "./components/Post/AddPost";
import Post from "./components/Post/Post";
import PostsList from "./components/Post/PostsList";
import NavBar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div>
      <NavBar/>
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/posts"]} component={PostsList} />
          <Route exact path="/add" component={AddPost} />
          <Route path="/posts/:id" component={Post} />
        </Switch>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
