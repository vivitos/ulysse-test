import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetcher, getApiUrl } from "../utils";
import TravelInfosCard from "../components/travelInfosCard";
import { SWRConfig } from "swr";
import TravelForm from "../components/travelForm";
interface PageProps {
  fallback?: { [key: string]: string };
  origin: string;
  destination: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const origin =
    typeof context.query.origin === "string" ? context.query.origin : "FR";
  const destination =
    typeof context.query.destination === "string"
      ? context.query.destination
      : "JP";

  const API_URL = getApiUrl(origin, destination);

  try {
    const repoInfo = await fetcher(API_URL);
    return {
      props: {
        origin,
        destination,
        fallback: {
          [API_URL]: repoInfo,
        },
      },
    };
  } catch (err) {
    console.log("err =>", err);
    return {
      props: {
        origin,
        destination,
      },
    };
  }
};

const Home: NextPage<PageProps> = ({
  fallback,
  origin: initialOrigin,
  destination: initialDestination,
}) => {
  const router = useRouter();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);

  useEffect(() => {
    router.push(
      {
        pathname: "/",
        query: { origin, destination },
      },
      undefined,
      { shallow: true }
    );
  }, [origin, destination]);

  return (
    <>
      <Head>
        <title>Ulysse tech test</title>
      </Head>
      <section className="p-32">
        <TravelForm
          origin={origin}
          destination={destination}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />
        <div className="mt-20 flex justify-center">
          <SWRConfig value={fallback ? { fallback } : {}}>
            <TravelInfosCard origin={origin} destination={destination} />
          </SWRConfig>
        </div>
      </section>
    </>
  );
};

export default Home;
