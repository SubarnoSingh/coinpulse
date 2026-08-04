'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;


if(!BASE_URL) throw new Error('could not get base URL');
if(!API_KEY) throw new Error('could not get API Key');


export async function fetcher<T>(
    endpoint: string,
    params? : QueryParams,
    revalidate: number = 60,
): Promise<T> {
    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${endpoint}`,
        query: params,
    }, { skipEmptyString: true, skipNull: true });

    const response = await fetch(url, {
        headers: {
            "x-cg-demo-api-key": API_KEY,
            "content-type": "application/json",
        } as Record<string, string>,
        next : {revalidate: revalidate}
    });

    if(!response.ok) {
        const errorbody:CoinGeckoErrorBody = await response.json().catch(() => ({}))

        throw new Error(`API ERROR: ${response.status} : ${errorbody.error || response.statusText}`)
    }


    return response.json();
}
