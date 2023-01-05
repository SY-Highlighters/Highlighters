import React from "react";

export default function LoginHeader() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-sky-500">
        <div className="container flex flex-wrap items-center justify-between px-4 mx-auto">
          <div className="relative flex justify-between w-full lg:w-auto lg:static lg:block lg:justify-start">
            <div className="flex items-center flex-shrink-0 text-white h-14">
              <span className="text-xl font-semibold tracking-tight">
                Highlighters
              </span>
            </div>
            <button
              className="block px-3 py-1 text-xl leading-none text-white bg-transparent border border-transparent border-solid rounded outline-none cursor-pointer lg:hidden focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            {/* <ul className="flex flex-col list-none lg:flex-row lg:ml-auto">
              <li className="nav-item">
                <a
                  className="flex items-center px-3 py-2 text-xs font-bold leading-snug text-white uppercase hover:opacity-75"
                  href="#pablo"
                >
                  <i className="text-lg text-white opacity-75 fab fa-face leading-lg"></i>
                  <span className="ml-2">Share</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="flex items-center px-3 py-2 text-xs font-bold leading-snug text-white uppercase hover:opacity-75"
                  href="#pablo"
                >
                  <i className="text-lg text-white opacity-75 fab fa-twitter leading-lg"></i>
                  <span className="ml-2">Tweet</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="flex items-center px-3 py-2 text-xs font-bold leading-snug text-white uppercase hover:opacity-75"
                  href="#pablo"
                >
                  <i className="text-lg text-white opacity-75 fab fa-pinterest leading-lg"></i>
                  <span className="ml-2">Pin</span>
                </a>
              </li>
            </ul> */}
          </div>
        </div>
      </nav>
    </>
  );
}
