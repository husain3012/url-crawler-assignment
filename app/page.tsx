"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { checkStatusOfURLs, extractURLFromWebPage } from "@/helpers/parser";
import Link from "next/link";

export default function Home() {
  const [inputURL, setInputURL] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">URL Crawler 🕷️</h1>
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Enter a URL</span>
              <span className="label-text-alt">(Only for SSR pages)</span>
            </label>
            <input
              type="url"
              placeholder="https://en.wikipedia.org/wiki/Main_Page"
              className="input input-bordered w-full"
              value={inputURL}
              onChange={(v) => setInputURL(v.target.value)}
            />
          </div>
          <p className="py-6">
            A simple tool to scan URLs on a webpage for broken links. Works only
            with server side rendered and static pages.
          </p>
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Link onClick={()=>setLoading(true)} href={`/summary?url=${inputURL}`} className="btn btn-primary">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
