import TextInputBox from "./TextInputBox.jsx";

function LoginForm(){
    return(
        <>
            <div className="loginForm">
                <TextInputBox />
                <button>Log in</button>
                <p id="forgetPwd"><a href="">Forget your password?</a></p>
            </div>
        </>
    );
}

export default LoginForm;