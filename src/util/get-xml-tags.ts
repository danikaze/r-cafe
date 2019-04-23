/**
 * Get a list of the content of a xml tag
 */
export function getXmlTags(xml: string, open: string, close: string): string[] {
  const res: string[] = [];
  let i: number;
  let j: number;

  i = xml.indexOf(open);
  while (i !== -1) {
    i += open.length;
    j = xml.indexOf(close, i);
    if (j === -1) {
      break;
    }

    res.push(xml.substring(i, j));
    i = xml.indexOf(open, i);
  }

  return res;
}
