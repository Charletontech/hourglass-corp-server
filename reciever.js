const express = require('express')
const app = express()


app.get('/refresh', (req, res) => {
    res.json({message: "SERVER 1 updated"})
})


app.listen(8080, () => {
    console.log(`TEST SERVER 1 running on port 8080...${"\u{1F680}"}`);
  });