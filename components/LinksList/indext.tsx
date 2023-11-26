"use client";
import React, { useEffect, useState } from "react";
import Row from "./row";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import axios from "axios";

const BATCH_SIZE = parseInt(process.env.NEXT_PUBLIC_BATCH_SIZE || "10");

let cancelRequest = false;

const LinksList = ({ urls }: { urls: string[] }) => {
  const [urlList, setUrlList] = useState(urls);
  const [searchText, setSearchText] = React.useState<string>("");
  const [debouncedSearchText] = useDebounce(searchText, 600);

  const [processing, setProcessing] = useState(false);
  const [urlStatusSet, setUrlStatusSet] = useState<Record<string, number>>({});
  const [processed, setProcessed] = useState(0);
  const [showOnlyBroken, setShowOnlyBroken] = useState(false);

  //   const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

  useEffect(() => {
    setUrlList(
      urls.filter(
        (u) =>
          u.toLowerCase().includes(debouncedSearchText.toLowerCase()) &&
          (showOnlyBroken ? urlStatusSet[u] != 200 : true)
      )
    );
  }, [debouncedSearchText, showOnlyBroken]);

  const processURLs = async (index: number) => {
    // process urls in batches of 10 by hitting the api for getting url status

    if (cancelRequest || index >= urlList.length) {
      setProcessing(false);
      cancelRequest = false;
      return;
    }

    let currentBatch = [];
    for (let i = index; i < Math.min(index + BATCH_SIZE, urlList.length); i++) {
      const url = urls[i];
      if (urlStatusSet[url] != undefined) continue;
      currentBatch.push(url);
    }
    const resp = await axios.post("/api/url-status", { urls: currentBatch });
    const newRecord: Record<string, number> = {};
    resp.data.data.forEach(
      (u: { url: string; status: number }) => (newRecord[u.url] = u.status)
    );
    setUrlStatusSet((prev) => ({ ...prev, ...newRecord }));
    setProcessed(index + BATCH_SIZE);
    // delay for 1 second
    setTimeout(() => {
      processURLs(index + BATCH_SIZE);
    }, 1000);
;
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex gap-3 items-end">
          <h2 className="card-title">{urls.length} URLs Found</h2>
          <span>(Showing {urlList.length})</span>
        </div>
        <span className="text-xs">
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
              type="text"
              placeholder="something/else"
              className="input input-bordered w-full"
              value={searchText}
              onChange={(v) => {
                setSearchText(v.target.value);
              }}
            />
          </div>

          <label className="label cursor-pointer">
            <span className="label-text">Only show broken links?</span>
            <input
              type="checkbox"
              checked={showOnlyBroken}
              className="checkbox"
              onClick={(v) => setShowOnlyBroken((prev) => !prev)}
            />
          </label>
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
        </div>
      </div>
      {processing && (
        <div className="w-full px-6 flex justify-between items-center gap-4">
          <progress
            className="progress progress-success w-full"
            value={processed}
            max={urls.length}
          ></progress>
          <div className="flex  whitespace-nowrap text-lg text-base-content font-bold">
            {processed} / {urls.length}
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
              <Row key={u} url={u} index={i} status={urlStatusSet[u]} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinksList;
