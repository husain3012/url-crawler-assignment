"use client";

import { statusToColor } from "@/helpers/utils";
import Link from "next/link";
import React from "react";

const Row = ({
  url,
  index,
  status,
}: {
  url: string;
  index: number;
  status?: number;
}) => {

  const color = statusToColor(status || 0);

  return (
    <tr>
      <td>{index + 1}</td>
      <td className="w-5/6 truncate">
        <Link className="max-w-md " target="__blank" rel="noreferrer" href={url}>
          {" "}
          <p className="w-44 sm:w-80  ">
          {url}
          </p>
        </Link>
      </td>
      <td style={{color:color}} className={`text-center`}>{`${
        status == undefined ? "Unknown" : status
      }` }</td>
      <td className="text-center ">
        <button
          className="btn btn-primary"
          onClick={() => navigator.clipboard.writeText(url)}
        >
          Copy
        </button>
      </td>
    </tr>
  );
};

export default Row;