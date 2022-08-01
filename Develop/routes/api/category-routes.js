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
// router.get('/', (req, res) => {
//   // find all categories
//   // be sure to include its associated Products
//   Category.findAll({
//     include: {
//       model: Product, 
//       attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
//     }
//   }).then(categoryRes => {
//     //if there is no match, send userend 404 and return out of function terminate
//     if(!categoryRes) {
//       res.status(404).json({message: 'There is no matching category for your request.'});
//       return;
//     }
//     //if response is successful, reply with json data
//     res.json(categoryRes);
//   })
//   //general error for connectivity issue, usually
//   .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
//   })
// });

//Going to try to use second method- async- and see if that works first. Will be cleaner with less wrapping syntax.
//second method

router.get("/",async (req,res)=>{
  try {
      const categories = await Category.findAll( {
        include: [{
          model: Product
        }],
      }); 
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


//Post will be more complex. Will need to use create method and use req.body + supply the object keys and properties.
router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create ({
      //body object key pairs to post
      id: req.body.id,
      category_name: req.body.category_name
    });
    //respond with newly created category and 200
    res.status(200).json(newCategory);
  } catch (err) {
    console.log(err)
    //respond with error message + 500
    res.status(500).json({
      msg: "We're sorry- the server has encountered an error.",
      err
    });
  };
});


//not sure how to create put route. Struggling with this one. Will return to it later because I know how to make the delete. 
// router.put('/:id', (req, res) => {
//   // update a category by its `id` value
//   try {
//     const newCatId = await Category.update (req.body, {
//         where: {
//           id: req.params.id,
//         },
//     }).then(newCat => Category.findByPk(req.params.id))
//     .then((updateCat) => res.status(200).json(updateCat))
//   } catch(err) {
//     res.json(err);}
// });

//On second thought it doesn't make much sense to force put to be async. Will try reverting.

router.put('/:id', (req, res) => {
  Category.findByPk(req.params.id).then(catUpdate => {
    if(!catUpdate){
      return res.status(404).json({msg:"No category with that id exists in the database."})
    }
    res.json(catUpdate)
  }).catch(err=>{
    res.status(500).json({
      msg: "We're sorry, there has been an internal server error.",
      err
    });
  });
});


//delete route can simple find a category by its id value and remove it. 
//will use .destroy method where the req.params.id is synced with user req
router.delete('/:id', async (req, res) => {
  await Category.destroy({
		where: {
			id: req.params.id,
		},
	})
	.then((rmvdCategory) => {
		res.json(`The category was removed from the database`);
	})
	.catch((err) => {
		res.json(err);
	});
});


//TODO: With these routes created, can do some testing out and then mimic them in other route files if they are successfully drawn
module.exports = router;
