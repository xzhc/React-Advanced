export function praseLinkHeader(linkHeader) {
  if (!linkHeader) {
    return {};
  }
  const links = linkHeader.split(",");
  const parsedLinks = {};
  links.forEach((link) => {
    const url = link.match(/<(.*)>/)[1];
    const rel = link.match(/rel="(.*)"/)[1];
    parsedLinks[rel] = url;
  });
  return parsedLinks;
}
