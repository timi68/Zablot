import { useRouter } from "next/router";
import Link from "next/link";
import { PropsInterface } from "./Layout";
import dynamic from "next/dynamic";

const NotAuthenticatedLayout = (props: PropsInterface) => {
  const router = useRouter();

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <header className="main-header p-4">
          <div className="header-wrapper flex justify-between max-w-screen-xl mx-auto items-center">
            <div className="logo_container">
              <Link href={"/"} className="logo no-underline font-black">
                ZABLOT
              </Link>
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
              {!router.pathname.includes("sign-up") && (
                <Link href="/sign-up" className="link sign-up-link">
                  Sign up
                </Link>
              )}
              {!router.pathname.includes("sign-in") && (
                <Link href="/sign-in" className="link sign-in-link">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>
        {props.children}
      </div>
    </div>
  );
};

export default dynamic(async () => NotAuthenticatedLayout, { ssr: false });
