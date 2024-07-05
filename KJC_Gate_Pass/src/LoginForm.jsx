import TextInput from './TextInput.jsx'

function LoginForm(){
    return(
        <div className="loginForm">
            <TextInput texts='email'/>
            <TextInput texts='password'/>
        </div>
    );
}

export default LoginForm;