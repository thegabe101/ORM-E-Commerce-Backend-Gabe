//TODO: Work on routes first

const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

//TODO: write get routes first.
//This first all categories one will be the easiest to write; 
//Can then use this one as a model for the other get routes, which will differ mostly in including new parameters

//First, router directs us to Express. 
//Then, we will filter by the Category route and use the findAll method to include any product model with their associated attributes.
//If we achieve a response, we respond with the json body data. If we don't we can reply with either a 500 level error (no response)
//OR a 404 (which would mean that no category was found in the database matching)
//I believe this could be written as an async; will write two ways and determine later.

//first method
router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: {
      model: Product, 
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  }).then(categoryRes => {
    //if there is no match, send userend 404 and return out of function terminate
    if(!categoryRes) {
      res.status(404).json({message: 'There is no matching category for your request.'});
      return;
    }
    //if response is successful, reply with json data
    res.json(categoryRes);
  })
  //general error for connectivity issue, usually
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

//second method

router.get("/",async (req,res)=>{
  try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
  } catch (err) {
      res.status(500).json({
          msg:"We're sorry, there has been a server error.",
          err
      });
  };
});


//This time, we need to find by id.
//The big difference here is that we will use find by package to req specific parameters .id, including all products
//Then, we can do pretty much the same thing, where if the queried data paremter doesn't match we return an error or json if it does match.
router.get('/:id', async (req, res) => {
  try {
    //findByPk to examine request params.id
    //include must include an array for grabbing the full index of inteer value ids
    const categoryId = await Category.findByPk(req.params.id, {
      include: [{
        model: Product
      }],
    });

    //If we can't match the data, we return a 404. Else, we return json
    if (!categoryId) {
      res.status(404).json({ message: 'Sorry, no category with that id exists in our database.' });
      return;
    }

    res.status(200).json(categoryId);
  } catch (err) {
    res.status(500).json(err);
  }

});
// router.get('/:id', (req, res) => {
//   // find one category by its `id` value
//   // be sure to include its associated Products
// });

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
