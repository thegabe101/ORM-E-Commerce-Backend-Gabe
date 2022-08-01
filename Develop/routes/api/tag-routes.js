//TODO: Work on routes first
//TODO: Will test everything through insomnia 

const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//our tag routes will include the product they are associated with. no need to tie producttag model.
router.get('/', async (req, res) => {
  // find all tags
  try {
    //find all products with a tag. no need for 404 because we are not searching for particular ids yet. 
    const findTag = await Tag.findAll({ include: Product });
    res.status(200).json(findTag);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

//this can be performed in an identical manner to our get by id in product and category routes
router.get('/:id', async (req, res) => {
  try {
    const findTagById = await Tag.findByPk(req.params.id, { include: Product });

    if (!findTagById) {
      res.status(404).json({ message: "We're sorry- no tag matching that id has been found in our database."});
      return;
    }
    res.status(200).json(findTagById);
  } catch (err) {
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});


//TODO: not entirely sure how to write this one. Need to read up on post routes involving async and create req bodies
router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
