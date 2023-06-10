/* eslint-disable @next/next/no-img-element */
import React from "react";

function SignInPage() {
  return (
    <div className="container auth login-content">
      <header className="main-header auth-header">
        <div className="logo_container">
          <a href="/" className="logo" style={{ textDecoration: "none" }}>
            ZABLOT
          </a>
        </div>
        <div className="header-center">
          <div className="link">
            <a href="/about-us" className="about-us">
              About us
            </a>
          </div>
          <div className="link">
            <a href="/learn-more" className="about-us">
              Learn more
            </a>
          </div>
        </div>
        <div className="header-right">
          <div className="signup-link">
            <a href="/register" className="link signup-link">
              Sign up
            </a>
          </div>
        </div>
      </header>
      <div className="wrapper sign_in">
        <div className="wrapper-flex">
          <form action="#" className="auth_form" data-name="login">
            <div className="form_group_wrapper sign_in_wrapper">
              {/* <%- include("validation") -%> */}
              <div className="secondary-text">
                Let’s get you on track with your learning
              </div>
              <div className="form-group" id="userEmail">
                <input
                  type="text"
                  name="userEmail"
                  className="form-control user-email"
                  placeholder="Enter your Email"
                />
                <div className="invalid-feedback">
                  Email is invalid or empty*
                </div>
              </div>
              <div className="form-group" id="userPassword">
                <input
                  type="password"
                  id="user-password"
                  name="userPassword"
                  placeholder="Enter your password"
                  className="user-password form-control"
                />
                <div className="password-toggle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="24"
                    height="24"
                    id="visible"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="#369298"
                      d="M396 512a112 112 0 1 0 224 0a112 112 0 1 0-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3c7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176s176 78.8 176 176s-78.8 176-176 176z"
                    />
                  </svg>
                </div>
                <div className="password-toggle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="24"
                    height="24"
                    id="hide"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="#545454"
                      d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43zm370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32zM332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.09 175.09 0 0 1 332 512z"
                    />
                    <path
                      fill="#545454"
                      d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5z"
                    />
                  </svg>
                </div>
                <div className="invalid-feedback">Password is required*</div>
              </div>
              <button type="submit" className="btn submit_btn auth-log">
                SIGN IN
              </button>
              <p className="register-link">
                Do not have an account?
                <a href="/register" className="Create">
                  Create One
                </a>
              </p>
            </div>
            <a
              href="/api/auth/login/federated/google"
              id="google"
              className="google"
            >
              <img src="/svgs/google.svg" alt="google" />
              <span>Sign in with Google</span>
            </a>
          </form>
          <div className="svg-container">
            <div className="image-wrap">
              <img src="/images/graduation-hat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
