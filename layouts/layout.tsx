import React, { FunctionComponent } from "react";

const Layout: FunctionComponent = ({ children }) => {
  return (
    <>
      <header>
        <section className="w-screen h-80 flex items-center justify-center shadow-md">
          <h1 className="text-white text-24 font-semibold">Ulysse tech test</h1>
        </section>
      </header>
      <main className="w-screen flex-1">{children}</main>
    </>
  );
};

export default Layout;
