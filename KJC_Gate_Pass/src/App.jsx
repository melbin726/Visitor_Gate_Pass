import Header from "./Header.jsx";
import TextImage from "./TextImage.jsx";
import LoginForm from "./LoginForm.jsx";

function App() {

  return (
    <>
      <Header />
      <div className="content">
        <TextImage />
        <LoginForm />
      </div>  
    </>
  );
}

export default App
