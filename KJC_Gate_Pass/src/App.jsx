import Header from "./Header.jsx";
import TextImage from "./TextImage.jsx";
import LoginForm from "./LoginForm.jsx";
import Footer from "./Footer.jsx";

function App() {
  return (
    <div className="fakeBody">
    <div className="totalContent">
      <Header />
      <div className="imageLogin">
        <TextImage />
        <LoginForm />
      </div>
      <Footer />
    </div>
    </div>
  );
}

export default App;
