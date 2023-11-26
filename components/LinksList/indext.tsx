"use client";
import React, { useEffect, useState } from "react";
import Row from "./row";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import axios from "axios";

const BATCH_SIZE = parseInt(process.env.NEXT_PUBLIC_BATCH_SIZE || "10");

let cancelRequest = false;

const LinksList = ({ urls }: { urls: string[] }) => {
  const mappedURLs = urls.map((u) => {
    return { url: u, status: null, statusText: "", loading: false };
  });
  const [urlList, setUrlList] = useState(mappedURLs);
  const [searchText, setSearchText] = React.useState<string>("");
  const [debouncedSearchText] = useDebounce(searchText, 600);

  const [processing, setProcessing] = useState(false);
  const [urlStatusSet, setUrlStatusSet] = useState<Record<string, number>>({});
  const [processed, setProcessed] = useState(0);

  //   const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

  useEffect(() => {
    setUrlList(
      mappedURLs.filter((u) =>
        u.url.toLowerCase().includes(debouncedSearchText.toLowerCase())
      )
    );
  }, [debouncedSearchText]);

  const processURLs = async (index: number) => {
    // process urls in batches of 10 by hitting the api for getting url status

    if (cancelRequest || index >= urlList.length) {
      setProcessing(false);
      cancelRequest = false;
      return;
    }

    let currentBatch = [];
    for (let i = index; i < Math.min(index + BATCH_SIZE, urlList.length); i++) {
      const url = urlList[i];
      if (urlStatusSet[url.url] != undefined) continue;
      currentBatch.push(url.url);
    }
    const resp = await axios.post("/api/url-status", { urls: currentBatch });
    const newRecord: Record<string, number> = {};
    resp.data.data.forEach(
      (u: { url: string; status: number }) => (newRecord[u.url] = u.status)
    );
    setUrlStatusSet((prev) => ({ ...prev, ...newRecord }));
    setProcessed(index + BATCH_SIZE);
    processURLs(index + BATCH_SIZE);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex gap-3 items-end">
          <h2 className="card-title">{urls.length} URLs Found</h2>
          <span>(Showing {urlList.length})</span>
        </div>
        <span>
          {" "}
          Click
          <kbd className="kbd kbd-xs">Start Processing</kbd> to scan all the
          URLs
        </span>

        <div className="flex w-full justify-between gap-4 items-end">
          <div className="form-control  w-full">
            <label className="label">
              <span className="label-text">Filter</span>
            </label>
            <input
              disabled={processing}
              type="text"
              placeholder="something/else"
              className="input input-bordered w-full"
              value={searchText}
              onChange={(v) => {
                setSearchText(v.target.value);
              }}
            />
          </div>
          <button
            onClick={() => {
              if (processing) return;
              setProcessing(true);
              processURLs(0);
            }}
            disabled={processing}
            className="btn btn-primary"
          >
            {processing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Start Processing"
            )}
          </button>
          {processing && (
            <button
              onClick={() => {
                cancelRequest = true;
              }}
              className="btn btn-secondary"
            >
              Stop
            </button>
          )}
          sp
        </div>
      </div>
      {processing && (
        <div className="w-full px-6 flex justify-between items-center gap-4">
          <progress
            className="progress progress-success w-full"
            value={processed}
            max={urlList.length}
          ></progress>
          <div className="flex  whitespace-nowrap text-lg text-base-content font-bold">
            {processed} / {urlList.length}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>URL</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {urlList.map((u, i) => (
              <Row
                key={u.url}
                url={u.url}
                index={i}
                status={urlStatusSet[u.url]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinksList;
