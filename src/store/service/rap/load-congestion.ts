import { Congestion } from '../../../def';
import { getXmlTags } from '../../../util/get-xml-tags';
import { request } from '../../../util/request';

export async function loadCongestion(): Promise<Congestion> {
  const xml = await request(CONGESTION_XML_URL);
  const items = getXmlTags(xml, '<m:properties>', '</m:properties>');
  const res = {} as Congestion;
  items.forEach((itemXml) => {
    const floor = getXmlTags(itemXml, '<d:Title>', '</d:Title>');
    const rates = getXmlTags(itemXml, '<d:CongestionRate m:type="Edm.Double">', '</d:CongestionRate>');
    if (floor.length && rates.length) {
      const rate = Number(rates[0]);
      if (!isNaN(rate)) {
        res[floor[0].toLowerCase()] = Math.max(0, rate);
      }
    }
  });

  return res;
}
