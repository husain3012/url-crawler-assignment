import { ScanURLsResponse, URLStatusResponse, checkStatusOfURLs, extractURLFromWebPage, fetchWebpageAndExtractURLs } from '@/helpers/parser'
import { NextResponse, type NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = (await request.json()) as { urls: string[] }

    const resp = await checkStatusOfURLs(body.urls);
    return NextResponse.json({ data: resp, status: 200 });


}