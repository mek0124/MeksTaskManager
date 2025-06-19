import { useState } from "react";
import { useAuth } from '../../hooks/authContext';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [resultText, setResultText] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleErrorSuccess = (message, error) => {
    if (!error) {
      setResultText(message);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setResultText('');

        return navigate("/");
      }, 3000);
    } else {
      setResultText(message);
      setIsError(true);

      setTimeout(() => {
        setIsError(false);
        return setResultText('');
      }, 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      loginData.username.trim() === "" ||
      loginData.password.trim() === ""
    ) {
      return handleErrorSuccess("All Inputs Are Required!", true);
    };

    try {
      const response = await login(loginData);

      if (response.status === 200) {
        return handleErrorSuccess(response.data.message, false);
      } else if (response.status === 500) {
        return handleErrorSuccess(response.message, true);
      } else {
        return handleErrorSuccess(response.data.message, true);
      };
    } catch (err) {
      console.error(err);
      return handleErrorSuccess(err.response?.data?.message || "An error occurred during signup", true);
    };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-secondary via-primary to-primary">
      <div className="flex flex-col items-center justify-center w-full flex-shrink-0 mb-10">
        <h3 className="font-bold italic text-2xl text-center w-full text-fontColor">
          Login To Continue...
        </h3>
      </div>

      <form 
        className="flex flex-col items-center justify-center w-full" 
        onSubmit={handleSubmit}>

        <div className="flex flex-col items-center justify-evenly w-1/3 h-96 bg-secondary rounded-xl shadow-xl shadow-accent mb-10">
          <div className="flex flex-row items-center justify-center w-[80%]">
            <label
              htmlFor="username"
              className="font-bold text-xl text-fontColor w-full">
              Username
            </label>

            <input
              type="text"
              className="bg-accent py-2 w-full rounded-2xl outline-none hover:outline-none focus:outline-none hover:bg-gray-500 text-black hover:text-fontColor text-center"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              title="Username can only use the 26-Letter English Alphabet, Numbers 0-9, and Special Characters: Underscore '_' or Hyphen '-'"
            />
          </div>

          <div className="flex flex-row items-center justify-center w-[80%]">
            <label
              htmlFor="password"
              className="font-bold text-xl text-fontColor w-full">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="bg-accent py-2 w-full rounded-2xl outline-none hover:outline-none focus:outline-none hover:bg-gray-500 text-black hover:text-fontColor text-center"
              value={loginData.password}
              onChange={handleChange}
              title="Password can only use the 26-Letter English Alphabet, Numbers 0-9, and Special Characters: !,@,#,$,%,^,&,*,_,-"
            />
          </div>

          {isError && (
            <div className="register-error-message">
              {resultText}
            </div>
          )}

          {isSuccess && (
            <div className="register-success-message">
              {resultText}
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-evenly w-[30%]">
          <button
            type="button"
            className="w-[35%] border-accent border-2 py-2 px-5 bg-secondary rounded-2xl outline-none hover:outline-none focus:outline-none hover:bg-gray-500 text-black hover:text-fontColor font-bold hover:shadow-xl hover:shadow-accent hover:scale-105"
            onClick={() => navigate("/")}>

            Cancel
          </button>

          <button
            type="submit"
            className="w-[35%] border-accent border-2 py-2 px-5 bg-secondary rounded-2xl outline-none hover:outline-none focus:outline-none hover:bg-gray-500 text-black hover:text-fontColor font-bold hover:shadow-xl hover:shadow-accent hover:scale-105">

            Create
          </button>
        </div>
      </form>
    </div>
  );
};
