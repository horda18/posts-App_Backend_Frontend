const db = require("../models/database");
const path = require("path");
const router = require("express").Router();
const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname).toLocaleLowerCase());
    }
});

const upload = (multer({
    storage,
    dest: path.join(__dirname, '../public/images'),
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extName) {
            return cb(null, true);
        }
        cb("Error: Archivo no valido debes subir una imagen.")
    }
}).single('image'));

router.post("/file", upload, (req, res) => {
    const file = req.body.image;
    console.log(file);
    if (!file) {
        console.log("No se subió ninguna imagen");
    }
    res.send(file);
    var route = req.file.path;
    console.log("ruta de imagen: " + route);
    res.send("uploaded")
});

const Post = db.posts;
const Category = db.category;

// Create and Save a new Post
router.post("/", upload, (req, res) => {
    // Create a Post
    const post = {
        title: req.body.title,
        content: req.body.content,
        image: req.file.path,
        categoryId: req.body.categoryId,
        date: req.body.date
    };

    Post.create(post)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Post."
            });
        });
});


// Retrieve all Posts from the database.
router.get("/", (req, res) => {
    Post.findAll({
        include: Category
    })
        .then((data) => {
            res.status(200).json({
                message: "Get all Posts' Infos Successfully!",
                posts: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Posts.",
            });
        });
});


// Find a single Post with an id
router.get("/:id", (req, res) => {
    const id = req.params.id;

    Post.findByPk(id, {
        include: Category
    })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Post not found" });
            } else {
                res.status(200).send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Post with id=" + id,
            });
        });
});


// Update a Post by the id in the request
router.put("/:id", upload, (req, res) => {
    const id = req.params.id;

    Post.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.status(200).send({
                    message: "Post was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Error updating Post with id=" + id,
            });
        });
});


// Delete a Post with the specified id in the request
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    Post.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Post was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Post with id=" + id,
            });
        });
});

module.exports = router;


