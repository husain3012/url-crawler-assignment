import Image from "next/image";
import {
  checkStatusOfURLs,
  extractURLFromWebPage,
  fetchWebpageAndExtractURLs,
} from "@/helpers/parser";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LinksList from "@/components/LinksList/indext";
import { bytesToHumanReadable, statusToColor } from "@/helpers/utils";

async function getData(url: string) {
  "use server";

  const res = await fetchWebpageAndExtractURLs(url);

  return res;
}

export default async function Summary({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const url = searchParams?.url as string;
  const data = await getData(url);

  const pageSize = bytesToHumanReadable(data.contentLength || 0);
  const statusColor = statusToColor(data.status);

  return (
    <div className=" min-h-screen flex flex-col">
      <div className="card w-full bg-base-200 shadow-xl">
        <figure>
          {/* <img src={` `} className="w-full h-72"></img> */}
          <iframe src={url} className="w-full h-72"></iframe>
        </figure>
        <div className="card-body">
          <div className="flex sm:justify-between justify-center gap-3 flex-wrap ">
            <div className="sm:w-2/3">
              {" "}
              <h2 className="card-title">{data.title || "Untitled"}</h2>
              <p>{data.desc || "No description provided"}</p>
            </div>

            <div className="stats shadow ">
              <div className="stat place-items-center">
                <div className="stat-title">Size</div>
                <div className="stat-value">{pageSize.value}</div>
                <div className="stat-desc">{pageSize.unit}</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title">Status Code</div>
                <div className={`stat-value ${statusColor} `}>
                  {data.status}
                </div>
                <div className={`stat-desc ${statusColor}`}>
                  {data.statusText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>
      <LinksList urls={data.urls} />
    </div>
  );
}
