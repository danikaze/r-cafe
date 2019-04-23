import { Congestion } from '../../../def';
import { getJson } from '../../../util/get-json';
import { CongestionApiResponse } from './def';

export async function loadCongestion(): Promise<Congestion> {
  const [data9, data22] = await Promise.all([
    getJson<CongestionApiResponse>(CONGESTION_URL_JSON_9F),
    getJson<CongestionApiResponse>(CONGESTION_URL_JSON_22F),
  ]);

  return {
    '9f': data9 && data9.crowd_rate,
    '22f': data22 && data22.crowd_rate,
  };
}
