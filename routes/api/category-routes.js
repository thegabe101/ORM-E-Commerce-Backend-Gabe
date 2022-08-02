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
//we will include our product model + its attributes in order to display the whole of the item we want to find (for which we will use class selector findAll)
router.get("/",async (req,res)=>{
  try {
      const categories = await Category.findAll( {
        include: [{
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
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
    //include must include an array for grabbing the full index of inter value ids
    const categoryId = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
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
      category_name: req.body.category_name,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    });
  // try {
  //   //findByPk to examine request params.id
  //   //include must include an array for grabbing the full index of inter value ids
  //   const newCategory = await Category.create(req.body.id, req.body.category_name, {
  //     include: [{
  //       model: Product,
  //       attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
  //     }],
  //   });
    //getting key.includes is not a function error here. for now will need to just do re.body and cat name.
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


//TODO: Current post result is successful but only half so. We are posting properly but not including attributes. We could simply post category name or try to fix if we have time. Not sure why attributes aren't posting.
//Was going to ask tutor tonight but he is sick. May not have time to fix. Will come back around if possible. 
//A bit confused still as to whether we should be updating product data here.
//!! either I am not updating product data correctly (I have tried) or I am misssing a relationship in the associations that would cause it to update correctly
//OR i am failing to write my attribute array correctly in my includes params within these functions. 

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
  //was originalyly using findByPk here but I think I need to use Category.update and replace params with where/id like I do in the destroy methodology
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
    })
    //promise if parameters don't exist return status OR respond with updated category body
      .then(catUpdateBody => {
        if(!catUpdateBody) {
          res.status(404).json({ message: "We're sorry- no category with this id exists in our database."});
        }
        res.json(catUpdateBody);
      }).catch(err => {
        //classic error catch
        console.log(err);
        res.status(500).json(err);
      });
    });
    //same issue- how to update our attributes? will try again in insomnia but didn't work with post. 
    //Seems like we can only update our category names one at a time. I guess that makes sense- we are not updating the products here. 

//delete route can simple find a category by its id value and remove it. 
//will use .destroy method where the req.params.id is synced with user req
router.delete('/:id', async (req, res) => {
  await Category.destroy({
		where: {
			id: req.params.id,
		},
	})
	.then((rmvCat) => {
    if (!rmvCat) {
		res.status(404).json({msg: `The category was removed from the database`})
    return;
	}
  res.json(rmvCat)
})
  .catch((err) => {
    console.log(err)
    res.status(500).json(err)
  });
});



//TODO: With these routes created, can do some testing out and then mimic them in other route files if they are successfully drawn
module.exports = router;
