import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Logo from "../../../../../public/assets/images/logo.svg";
import PasswordEye from "../../../../../public/assets/icons/password-eye.svg";
import PasswordEyeFilled from "../../../../../public/assets/icons/password-eye-filled.svg";
import ErrorIcon from "../../../../../public/assets/icons/error-icon.svg";

import _classes from "./LoginForm.module.scss";
import { adminServices } from "../../../services/methods";
import Router from "next/router";
import { Spinner } from "react-bootstrap";

function LoginForm() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [_, setEmailError] = useState("");
  const [loader, setLoader] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    rememberPassword: false,
  });

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  useEffect(() => {
    if (localStorage.getItem("isLogin")) {
      Router.push("/dashboard");
    }
  }, []);

  const handleValidation = () => {
    let formIsValid = true;

    if (!inputs.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
      return formIsValid;
    } else {
      setEmailError("");
      formIsValid = true;
    }

    return formIsValid;
  };

  const loginFormHandler = async (e: any) => {
    e.preventDefault();
    const params = {
      username: e.target[0].value || inputs.email,
      password: e.target[1].value || inputs.password,
    };

    handleValidation();
    if (inputs.rememberPassword) {
      handleRememberMe(params);
    }
    try {
      setLoader(true);
      const res: any = await adminServices.postLogin(await params);
      localStorage.setItem("isLogin", res?.success);
      Router.push("/dashboard");
    } catch (error) {
      setResponseError("Something went wrong");
      setLoader(false);
    }
  };
  const handleRememberMe = (params: any) => {
    //sudocode for local storage setting values
    localStorage.setItem("isLoginItems", JSON.stringify(params));
  };
  function handleRememberme(e: any) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function handleChechbox(e: any) {
    setInputs((inputs) => ({
      ...inputs,
      rememberPassword: !inputs.rememberPassword,
    }));
  }

  return (
    <div className="Loginform-wrapper min-w-[60%] md:min-w-[85%] lg:min-w-[70%] relative">
      <Image src={Logo} className="max-w-[50%] flex self-start" alt="logo" />
      <Form className="flex flex-col" onSubmit={loginFormHandler}>
        <h5 className="text-black-1 my-4 font-medium text-md">
          Welcome to PRC.News
        </h5>
        <p className="text-gray-1 text-sm font-thin my-3">
          Please enter your credentials to login
        </p>
        {responseError && (
          <span className="text-red-2">
            <i>*{responseError}*</i>
          </span>
        )}
        <div className="hidden error-message sm:hidden items-start max-w-[450px]">
          <div className="inline-block w-8">
            <Image
              src={ErrorIcon}
              className="max-w-[100%] block leading-1 mt-1"
              alt="logo"
              height={28}
              width={18}
            />
          </div>
          <p className="text-error text-base font-thin mb-5 mt-1 ml-2 leading-7">
            Your email or password is incorrect. Try again or click forgot
            password.
          </p>
        </div>

        <FloatingLabel
          controlId="floatingInput"
          label="Email Address"
          className="mb-3 mt-3"
        >
          <Form.Control
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            autoFocus
            onChange={(e) => handleRememberme(e)}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="mt-3"
        >
          <div className="relative">
            <div className="password-eye absolute z-10 right-5 top-5">
              <Image
                src={passwordShown ? PasswordEyeFilled : PasswordEye}
                className="max-w-[50%] flex self-center cursor-pointer"
                alt="password-eye"
                onClick={togglePassword}
              />
            </div>
          </div>
          <Form.Control
            name="password"
            type={passwordShown ? "text" : "password"}
            placeholder="Password"
            required
            minLength={8}
            maxLength={20}
            onChange={(e) => handleRememberme(e)}
          />
        </FloatingLabel>

        <div className="flex items-center justify-between py-3">
          <Form.Check
            type="checkbox"
            label=" Remember me"
            id="rememberPassword"
            name="rememberPassword"
            checked={inputs.rememberPassword}
            onChange={handleChechbox}
            className={`${_classes["login-form"]} text-gray text-sm inline-flex items-center`}
          />
          <Link href="/forgotpassword">
            <div className="inline-flex items-center">
              <div className="mb-0 mr-0 inline-flex items-center">
                <span className="cursor-pointer ml-3 text-gray text-sm">
                  Forgot Password?
                </span>
              </div>
            </div>
          </Link>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="bg-primary text-sm py-3 flex items-center justify-center gap-2"
          // onClick={(e) => submitContact(e)}
        >
          {loader && <Spinner className="" size="sm" animation="border" />}
          Login
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;