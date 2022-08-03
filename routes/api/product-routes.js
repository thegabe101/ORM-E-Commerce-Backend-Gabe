//TODO: Work on routes first

//TODO: finalize product routes. Just checked insomnia and right now GET and DELETE routes are functioning, post and put are issues. 

const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
  router.get('/', async (req, res) => {
    try { 
      //here we use the sequelize findAll method in order to querie the whole table from both the category and tag models, then we respond with that data as productInfo
          const productInfo = await Product.findAll({ include: ({ model: Category }, {model: Tag}) });
          //by including our category and tag models we can associate their data with a given product
          res.status(200).json(productInfo);
    } catch (err) {
      res.status(500).json(err);
    }
  }); 
  // find all products
  // be sure to include its associated Category and Tag data


// get one product

  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  router.get('/:id', async (req, res) => {
    try { 
      //this query is somewhat different from the get all above; here we use findbypk to obtain only a single entry from the table using whatever the provided primary key is.
      //this is where the primary key becomes crucial 
            const productInfo = await Product.findByPk(req.params.id, { include: ({ model: Category }, {model: Tag }) });
            if (!productInfo) {
        //if no existing matching product
            res.status(404).json({ message: "Sorry! We could not find a matching product in our database."})
            return;
      }
      //return package if product info id exists
        res.status(200).json(productInfo);
    } catch (err) {
      //connection error 
        res.status(500).json(err);
    }
  });


// create new product
//the idea here will be to create a new product using create, then bulkcreate if the array us there
// router.post('/', (req, res) => {
//   /* req.body should look like this...
//     {
//       product_name: "Basketball",
//       price: 200.00,
//       stock: 3,
//       tagIds: [1, 2, 3, 4]
//     }
//   */
//  //added req.body specifics because create was crashing
//   Product.create ({
//     // product_name: req.body.product_name,
//     // price: req.body.price,
//     // stock: req.body.stock,
//     // category_id: req.body.category_id,
//     // tagIds: req.body.tagIds
//   })
//     .then((product) => {
//       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
//       if (req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       // if no product tags, just respond
//       res.status(200).json(product);
//     })
//     .then((productTagIds) => res.status(200).json(productTagIds))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

//!! not totally sure what I have done wrong here with mucking up the post, so I'm going to try reverting to the original product post code and see if it works. 

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
      .then((product) => {
          // if there's product tags, we need to create pairings to bulk create in the ProductTag model
          if (req.body.tagIds.length) {
              const productTagIdArr = req.body.tagIds.map((tag_id) => {
                  return {
                      product_id: product.id,
                      tag_id,
                  };
              });
              return ProductTag.bulkCreate(productTagIdArr);
          }
          // if no product tags, just respond
          res.status(200).json(product);
      })
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
          console.log(err);
          res.status(400).json(err);
      });
});
//made it semi-functional reverting back to the original code.  will leave it and try put now. 

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

//simply cannot figure out this put route and what its doing. running out of time due to project2 so moving on. 

//here we can use the destroy method where the params id matches the query. we will continue to use async and try 
//remember that async always returns a promise. when no return statement is defined, it would return a resolving promise.
//here though, we can return a 404 error if the promise is unfulfilled, or a rejection error
router.delete('/:id', async (req, res) => {
  try {
    const productInfo = await Product.destroy({
      //destroy using id specificity
      where: {
        id: req.params.id
      }
    })
    //no match
    if (!productInfo) {
      res.status(404).json({ message: "We're sorry- no product matching that id exists in our database."});
      return;
    }
    //successful response
  res.status(200).json(productInfo);
  } catch (err) {
  //catch error 
  res.status(500).json(err)
  }
});

module.exports = router;
