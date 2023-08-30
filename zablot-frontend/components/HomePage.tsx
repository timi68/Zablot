export default function HomePage() {
  return (
    <div className="landing-page">
      <div className="section-front max-w-screen-xl mx-auto flex justify-around flex-wrap-reverse">
        <div className="board-text-wrapper">
          <div className="big-text primary-text">
            Solving the intelligence easily.
          </div>
          <div className="secondary-text">
            Solely based on making education virtual and helping in education.
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
      <section className="swiper-container my-32 swiper section-objectives">
        <div className="swiper-wrapper flex flex-wrap justify-center gap-10 items-center">
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
                  <div className="card-text">Get you set for your exams</div>
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
                  <img src="/images/friends.png" alt="" className="image" />
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
      </section>
    </div>
  );
}
