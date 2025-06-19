import { Link } from 'react-router-dom';


export default function Header({ userId, userData }) {
  return (
    <header className="flex flex-row items-center justify-center w-full flex-shrink-0 border-b-2 border-b-accent">
      <div className="flex flex-row items-center justify-start w-full m-2">
        <img
          src={userData.profileImage}
          alt="Profile Icon"
          width="80"
          height="80"
          className="rounded-full"
        />
      </div>

      {!userId && (
        <div className="flex flex-row items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-fontColor text-md text-center w-full">
              You do not have an account. Would you like to

              <Link
                to="/auth/sign-up"
                className="ml-2 mr-2 bg-primary py-1 px-5 rounded-xl hover:underline"
              >

                Sign Up
              </Link>

              or

              <Link
                to="/auth/login"
                className="ml-2 mr-2 bg-primary py-1 px-5 rounded-xl hover:underline"
              >

                Login
              </Link>
              ?
            </p>  

            <p className="rounded-xl text-xs text-fontColor w-full text-center">
              If you do not have an account, your tasks will not be saved when you close this window
            </p>
          </div>
        </div>
      )}

      {userId && (
        <div className="flex flex-col items-center justify-center w-full m-2">
          <h1 className="font-bold text-fontColor text-2xl text-end w-full">
            {userData.username}
          </h1>

          <h3 className="italic text-fontColor text-sx text-end w-full">
            {userData.memberSince}
          </h3>
        </div>
      )}
    </header>
  );
};
