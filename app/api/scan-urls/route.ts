import { ScanURLsResponse, extractURLFromWebPage, fetchWebpageAndExtractURLs } from '@/helpers/parser'
import { NextResponse, type NextRequest } from 'next/server'


export const GET = async (request: NextRequest): Promise<NextResponse<ScanURLsResponse>> => {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('url')
  if (!query)

    return NextResponse.json({
      page: null,
      status: 400,
      message: 'No URL provided',
      urls: []

    })

  const response = await fetchWebpageAndExtractURLs(query)
  return NextResponse.json(response)




}