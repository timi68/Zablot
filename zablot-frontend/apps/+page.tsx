import React from "react";

function HomePage() {
  return (
    <html lang="en">
      <body>
        <div className="main_container">
          <div className="main_wrapper">
            <header className="main-header">
              <div className="logo_container">
                <p className="logo">ZABLOT</p>
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
                <div className="signin-link">
                  <a href="/login" className="link signin-link">
                    Login
                  </a>
                </div>
              </div>
            </header>
            <div className="section-front flex-wrap-reverse">
              <div className="board-text-wrapper">
                <div className="big-text primary-text">
                  Solving the intelligence easily.
                </div>
                <div className="secondary-text">
                  Solely based on making education virtual and helping in
                  education.
                </div>
                <div className="btn-wrap">
                  <a href="/dashboard" className="btn btn-explore">
                    Explore
                  </a>
                </div>
              </div>
              <div className="svg_container">
                <div className="svg-wrap">
                  <img src="./images/atom.png" alt="" className="svg" />
                </div>
              </div>
            </div>
            <div className="swiper-container swiper section-objectives">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="card objective">
                    <div className="card-wrapper">
                      <div className="card-image">
                        <img
                          src="/images/collection_tools.png"
                          alt=""
                          className="image"
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-text">
                          Get you set for your exams
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card objective">
                    <div className="card-wrapper">
                      <div className="card-image">
                        <img
                          src="./images/online-study.png"
                          alt=""
                          className="image"
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-text">
                          Help make test to your student anywhere in the world
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card objective">
                    <div className="card-wrapper">
                      <div className="card-image">
                        <img
                          src="/images/friends.png"
                          alt=""
                          className="image"
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-text">
                          Meet new friends to learn with
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default HomePage;
