import React, { FunctionComponent, useState } from "react";
import useSWR from "swr";
import { fetcher, getApiUrl } from "../utils";
import { formatDistanceToNow } from "date-fns";

interface TravelInfosCard {
  origin: string;
  destination: string;
}

// Different travel infomartions types
enum InfosType {
  Restriction = "RESTRICTION",
  Procedure = "PROCEDURE",
}

/**
 * Travel infos item
 * @param {object} props.item The travel info item
 * @param {string} props.itemInfoType Info item type
 */
const TravelInfosItem: FunctionComponent<{
  item: any;
  itemInfoType: InfosType;
}> = ({ item, itemInfoType }) => {
  const textColor = itemInfoType === InfosType.Restriction ? "red" : "gray";

  return (
    <div key={item.id} className="text-justify mb-8">
      <a
        target="_blank"
        href={item.attributes.source.url}
        className={`text-${textColor} font-semibold text-14 hover:underline`}
        rel="noreferrer"
      >
        {item.attributes.description}
      </a>
      <p className={`text-${textColor} text-12`}>
        (Last update :&nbsp;
        {formatDistanceToNow(new Date(item.attributes.lastUpdatedAt))}
        &nbsp;ago)
      </p>
    </div>
  );
};

/**
 * Travel infos list
 * @param {object} props.travelInfos Array of travel infos item
 */
const TravelInfosList: FunctionComponent<{ travelInfos: Array<any> }> = ({
  travelInfos,
}) => {
  const [moreAboutProcedures, setMoreAboutProcedures] = useState(false);

  // This approach is less optimized than using because you have to go through the array twice
  // Using a mag would have been better but less readable (cf TravelInfosCard component)
  const travelRestrictions = travelInfos.filter(
    (item) => item.type === InfosType.Restriction
  );

  const travelProcedures = travelInfos.filter(
    (item) => item.type === InfosType.Procedure
  );

  return (
    <div className="flex items-center flex-col">
      <ul className="flex-grow">
        {travelRestrictions.map((item: any) => (
          <TravelInfosItem
            key={item.id}
            item={item}
            itemInfoType={InfosType.Restriction}
          />
        ))}
      </ul>
      <button
        className="my-12 text-gray-60 underline"
        onClick={() => setMoreAboutProcedures(!moreAboutProcedures)}
      >
        {moreAboutProcedures
          ? "Less about procedures"
          : "More about procedures"}
      </button>
      {moreAboutProcedures && (
        <ul>
          {travelProcedures.map((item: any) => (
            <TravelInfosItem
              key={item.id}
              item={item}
              itemInfoType={InfosType.Procedure}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * Travel infos card
 * @param {string} props.origin Origin's IATA code
 * @param {string} props.destination Destination's IATA code
 */
const TravelInfosCard: FunctionComponent<TravelInfosCard> = ({
  origin,
  destination,
}) => {
  const { data, error } = useSWR(getApiUrl(origin, destination), fetcher);

  const infosMapByCountry = new Map([
    [origin, [] as any[]],
    [destination, [] as any[]],
  ]);

  data?.included?.forEach((item: any) => {
    if (item.attributes.country === data.origin.data.id)
      infosMapByCountry.get(origin)!.push(item);

    if (item.attributes.country === data.destination.data.id)
      infosMapByCountry.get(destination)!.push(item);
  });

  if (error || !data) return null;

  if (
    !infosMapByCountry.get(origin)!.length &&
    !infosMapByCountry.get(destination)!.length
  ) {
    <section className="bg-white w-full py-12 px-20 rounded-10 shadow-md max-w-lg">
      <h2 className="font-semibold text-20 text-center text-primary mb-15">
        Don&apos;t need anything except your sunscreen !
      </h2>
    </section>;
  }

  return (
    <section className="bg-white w-full flex-col md:flex-row flex py-12 px-20 rounded-10 shadow-md">
      {!!infosMapByCountry.get(destination)!.length && (
        <div
          className={
            !!infosMapByCountry.get(origin)!.length
              ? "border-b-2 box-border md:border-b-0 md:border-r-2 border-gray-60 pb-10 md:pb-0 md:pr-20 flex-1"
              : ""
          }
        >
          <h2 className="font-semibold text-20 text-center text-primary mb-15">
            Good to know before departure
          </h2>
          <TravelInfosList travelInfos={infosMapByCountry.get(destination)!} />
        </div>
      )}
      {!!infosMapByCountry.get(origin)!.length && (
        <div
          className={
            !!infosMapByCountry.get(destination)!.length
              ? "pt-20 md:pt-0 md:pl-20 flex-1"
              : ""
          }
        >
          <h2 className="font-semibold text-20 text-center text-primary mb-15">
            Good to know before arrival
          </h2>
          <TravelInfosList travelInfos={infosMapByCountry.get(origin)!} />
        </div>
      )}
    </section>
  );
};

export default TravelInfosCard;
