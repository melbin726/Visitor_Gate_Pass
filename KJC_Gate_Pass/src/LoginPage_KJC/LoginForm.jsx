import TextInputBox from "./TextInputBox.jsx";

function LoginForm(){

    const handleClick = () => window.location.href = 'mainDashboard.html';

    return(
        <>
            <div className="loginForm">
                <TextInputBox />
                <button onClick={handleClick}>Log in</button>
                <p id="forgetPwd"><a href="mainDashboard.html">Forget your password?</a></p>
            </div>
        </>
    );
}

export default LoginForm;