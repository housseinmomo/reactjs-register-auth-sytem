import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

// REGEX 
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register" 

const Register = () => {
  
  const userRef = useRef();
  const errRef = useRef();

  // Pour chaque champ se trouvant dans notre formulaire, on lui definie 3 etats 
  // 1. le contenus 
  // 2. la validite 
  // 3. le traitement en temps reel 
  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  // Quand l'utilisateur saisie le champs username; on verifie si ce texte saisie est correcte via notre expression regex 
  // Pour ce faire on utilise la methode setValidName et on met le test entre ()
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  // A chaque fois que l'utilisateur saisie dans les champs password ou confirmPassword :
  useEffect(() => {
    // 1. On verifie si le password saisie correspond au regex definie et on met le validPwd (true ou false) selon le resultat de la verification
    setValidPwd(PWD_REGEX.test(pwd));
    // 2. On verifie si les deux password sont identiques 
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  // Quand l'utilisateur est entrain de modifier [user, pwd, match], on efface le message d'erreur 
  // On part du principe que ce dernier est entrain de corriger ses erreurs 
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry")
      return 
    }

    // try {
    //   const response = await axios.post(REGISTER_URL,
    //     JSON.stringify({user, pwd}), 
    //     {
    //       headers: {'Content-Type': 'application/json'},
    //       withCredentials: true
    //     })
      
    //   console.log(response.data)
    //   console.log(response.accessToken)
    //   console.log(JSON.stringify(response))
    //   setSuccess(true)
    //   // clear input fields 
    // }catch(err){
    //   if(!err?.response){
    //     setErrMsg("No Server Response")
    //   } else if (err.response?.status === 409) {
    //     setErrMsg("Username Taken")
    //   } else {
    //     setErrMsg("Registration Failed")
    //   }
    //   errRef.current.focus()
    // }

    console.log(user, pwd)
    setSuccess(true)
  }

  return (
    <>
      {success ? (
        <section>
          <h1>Success</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ): (
    <section>
      <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {/** Username Field */}
        <label htmlFor="username">
          Username :
          <span className={validName ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validName || !user ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input 
          type="text" 
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          required
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote" // cette prop va nous permettre d'afficher un message d'insctruction a l'utilisateur lors du saisie 
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />
        
        {/** si  l'utilisateur est sur le champs de saisie, et le champs n'est pas vide et que champs n'est pas valide */}
        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          4 to 24 characters. <br/>
          Must begin with a letter. <br/>
          Letters, numbers, underscores, hyphens allowed.  
        </p>

        {/** Password Field */}
        <label htmlFor="password">
          Password : 
          <span className={validPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validPwd || !pwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>

        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          aria-invalid= {validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />

        <p id="pwdnote" className={pwdFocus && !validPwd && pwd ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters. <br/>
          Must include uppercase ans lowercase letters, a number and a special character. <br/> 
          Allowed special characters: 
          <span aria-label="exclamation mark">!</span>
          <span aria-label="at symbol">@</span> 
          <span aria-label="hastag">#</span>
          <span aria-label="dollar sign">$</span>
          <span aria-label="percent">%</span> 
        </p>


        {/** Confirm Password Field */}
        <label htmlFor="confirm_pwd">
          Confirm : 
          <span className={validMatch && matchPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>

        <input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          required
          aria-invalid= {validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />

        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Must  match the first password input.
        </p>
 
        {/** Submit Button Field */}

        <button 
          type="submit"
          disabled= {!validName || !validPwd || !validMatch ? true : false}>
            Sign Up
          </button>
      </form>
      <p>
        Already registered <br/>
        <span className="line">
          {/** oyt router link here */}
          <a href="#">Sign In</a>
        </span>
      </p>
    </section>)}
    </>
  )
}

export default Register