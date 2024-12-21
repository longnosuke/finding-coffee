export const parseTags = (tags) => {
  const tagObject = {};
  const matches = tags.match(/"([^"]*)"=>"([^"]*)"/g);
  if (matches) {
    matches.forEach((match) => {
      const [key, value] = match.replace(/"/g, "").split("=>");
      tagObject[key] = value;
    });
  }
  return tagObject;
};
