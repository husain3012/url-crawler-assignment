import { JSDOM } from "jsdom"


export interface ScanURLsResponse {
    page: string | null
    status: number
    statusText?: string
    contentLength?: number
    message: string
    urls: string[]
    error?: string
    title?: string
    desc?: string
    preview?: string
}


export interface URLStatusResponse {
    url: string;
    status: number;
}


const getDefaultStatusText = (status: number): string => {
    switch (status) {
        case 200:
            return "OK"
        case 301:
            return "Moved Permanently"
        case 302:
            return "Found"
        case 400:
            return "Bad Request"
        case 401:
            return "Unauthorized"
        case 403:
            return "Forbidden"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case 502:
            return "Bad Gateway"
        case 503:
            return "Service Unavailable"
        case 504:
            return "Gateway Timeout"
        default:
            return "Unknown"
    }
}


export const extractURLFromWebPage = (url: string, dom: JSDOM): string[] => {
    const baseURL = new URL(url);



    const { document: doc } = dom.window;
    const links = doc.getElementsByTagName("a")
    const urls = new Set<string>();

    for (var i = 0; i < links.length; i++) {
        let link = links[i].getAttribute("href") || "";

        const newUrl = new URL(link, baseURL);
        // remove hash from the url
        newUrl.hash = "";
        if (newUrl.toString() === url) {
            continue;
        }
        if (newUrl.protocol === "http:" || newUrl.protocol === "https:") {
            urls.add(newUrl.href);
        }
    }

    // return all the urls found in the webPage
    return Array.from(urls);
}


export const fetchWebpageAndExtractURLs = async (url: string): Promise<ScanURLsResponse> => {


    try {

        const response = await fetch(url);


        if (!response.ok) {
            return {
                message: "Could not fetch the page", page: url, status: response.status, urls: []
            }
        }
        const webpage = await response.text();


        const dom = new JSDOM(webpage);

        const title = dom.window.document.querySelector('title')?.textContent
        const desc = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content')



        const statusText = response.statusText.length > 0 ? response.statusText : getDefaultStatusText(response.status);


        let contentLength = parseInt(response.headers.get('content-length') || '0')

        // estimates the size of the page in bytes 
        if (contentLength === 0) {
            contentLength = Buffer.byteLength(webpage);
        }
        const urls = extractURLFromWebPage(url, dom);

        return {
            message: "Success", page: url, status: response.status, urls, title: title||"", desc: desc|| '', statusText, contentLength: contentLength, preview: ''
        }

    } catch (error) {
        console.log(error);

        return {
            message: "Could not fetch the page", page: url, status: 400, urls: [], statusText: getDefaultStatusText(400)
        }
    }

}



export const checkStatusOfURLs = async (urls: string[]): Promise<URLStatusResponse[]> => {
    // break urls into chunks of CHUNK_SIZE
    const CHUNK_SIZE = urls.length


    // and process them in parallel
    const chunks = Math.ceil(urls.length / CHUNK_SIZE);
    const results: { url: string, status: number }[] = [];

    for (let i = 0; i < chunks; i++) {
        const chunk = urls.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const promises = chunk.map(async (url) => {
            try {

                const response = await fetch(url, { method: "HEAD" });

                return { url, status: response.status }
            } catch (err) {
                return { url, status: 400 }
            }
        });
        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults);
    }
    return results;

}
