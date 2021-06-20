const db = require("../models/database");
var router = require("express").Router();

const Category = db.category;
const Post = db.posts;

// Create and Save a new Category
router.post("/", (req, res) => {
    // Create a Category
    const category = {
        name: req.body.name,
    };

    Category.create(category)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Category.",
            });
        });
});

// Retrieve all Categories from the database.
router.get("/", (req, res) => {
    Category.findAll({
        include: Post
    })
        .then((data) => {
            res.status(200).json({
                message: "Get all Categories' Infos Successfully!",
                categories: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Categories.",
            });
        });
});

// Find a single Category with an id
router.get("/:id", (req, res) => {
    const id = req.params.id;

    Category.findByPk(id, {
        include: Post
    })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Category not found" });
            } else {
                res.status(200).send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Category with id=" + id,
            });
        });
});

// Update a Category by the id in the request
router.put("/:id", (req, res) => {
    const id = req.params.id;

    Category.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.status(200).send({
                    message: "Category was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Error updating Category with id=" + id,
            });
        });
});


// Delete a Category with the specified id in the request
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    Category.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Category was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Category with id=${id}. Maybe Category was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Category with id=" + id,
            });
        });
});

module.exports = router;

