const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

// return all favorite images
router.get('/', (req, res) => {
  const queryText = 'SELECT * FROM favorites ORDER BY id'
  pool.query(queryText)
    .then((result) => {res.send(result.rows)})
    .catch((err) => {
      console.log('select QUERY error', err);
      res.sendStatus(500);
    })
  //res.sendStatus(200);
});



// add a new favorite
router.post('/', (req, res) => {
  const newFav = req.body;
  const queryText = `INSERT INTO favorites (url, alt_title)
                    VALUES ($1, $2)
  `
  console.log('newfav.title is', newFav.title);
  
  const queryValues = [
    newFav.images.original.url, 
    newFav.title
    // newFav.category_id
  ]
  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(201)})
    .catch((err) => {
      console.log('query error', err);
      res.sendStatus(500)
    })

});

// update given favorite with a category id
router.put('/:favId', (req, res) => {
  console.log(req.params);
  console.log('in PUT in server, id and category_id:', req.params.favId, req.body)
  // req.body should contain a category_id to add to this favorite image
  const queryText = `
    UPDATE "favorites"
    SET "category_id" = $1
    WHERE "id" = $2 
  ` 
  const queryParams = [
    req.body.category_id,
    req.params.favId
  ];

  pool.query(queryText, queryParams)
    .then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      console.log('PUT error', error);
      res.sendStatus(500);
    });
  
});

// delete a favorite
router.delete('/', (req, res) => {
  res.sendStatus(200);
});

router.delete('/:id', (req, res) => {
  const queryText = 'DELETE FROM favorites WHERE id=$1';
  pool.query(queryText, [req.params.id])
    .then(() => { res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing SELECT favorites query', err);
      res.sendStatus(500);
    });
});
module.exports = router;
