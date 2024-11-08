const products = await getAllProducts();
const options = {
  keys: ["id", "title"], // Specify the fields to search
  threshold: 0.5, // Adjust sensitivity (0.0 is exact match, 1.0 is very fuzzy)
  includeScore: true, // Optional: includes the score in the result for relevance
};

const Fuse = require("fuse.js");
const fuse = new Fuse(products, options);

const searchResults = fuse.search("ladies shoes");
// console.log(searchResults);
res.json(searchResults);
