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
    const findTag = await Tag.findAll({ 
      //maybe including attributes is not the right call. perhaps it would be more straightforward to only include model. 
    //   attributes: id', 'tag_name',
    //   include: 
    //     
    //   model: Product,
    //think we are including too many tag attributes here. should only need id and tag name so changed it to that. product should still require all attributes. 
    //       attributes: 'id', 'product_name', 'price', 'stock', 'category_id', 
          include: [
            {model: Product}
        ],
      });
    res.status(200).json(findTag);
  } catch (err) {
    res.status(500).json(err);
  }
});
  // be sure to include its associated Product data;

//this can be performed in an identical manner to our get by id in product and category routes
router.get('/:id', async (req, res) => {
  try {
    const findTagById = await Tag.findByPk(req.params.id, { include: Product });

    if (!findTagById) {
      res.status(404).json({ message: "We're sorry- no tag matching that id has been found in our database." });
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
// router.post('/', (req, res) => {
//   // create a new tag
//   Tag.create({
//     tag_name: req.body.tag_name
//   })
//     .then(dbTagData => res.json(dbTagData))
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//   });
// });


//perhaps this can be pretty simple. all we need to do is post to tags with a tagCreate + req.body.
//tags only have an id and a name >>> Insomnia
router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});


//either finds tag by params id or doesn't. simply respond with new tag data at index 0 doesnt exist if its not found because that should be the tag we're trying to update. 
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
        id: req.params.id
    }
  })
    .then(dbTagData => {
        if (!dbTagData[0]) {
            res.status(404).json({ message: "We're sorry- no tag matching that id has been found in our database."});
            return;
        }
        res.json(dbTagData);
  })
    .catch(err => {
        console.log(err); 
        res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
        id: req.params.id
    }
  })
    .then(dbTagData => {
        if (!dbTagData) {
            res.status(404).json({ message: "We're sorry- no tag matching that id has been found in our database."});
            return;
        }
        res.json(dbTagData);
  })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

module.exports = router;
