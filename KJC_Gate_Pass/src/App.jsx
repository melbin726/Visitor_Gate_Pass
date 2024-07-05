import Header from "./Header.jsx";
import TextImage from "./TextImage.jsx";
import LoginForm from "./LoginForm.jsx";

function App() {

  return (
    <div className="bodyMain">
      <Header />
      <div className="textImageLoginForm">
        <TextImage />
        <LoginForm />
      </div>
    </div>
  );
}

export default App
