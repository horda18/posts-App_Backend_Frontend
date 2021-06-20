import React, { useState, useEffect, useRef } from "react";
import PostDataService from "../../services/PostService";
import { useHistory } from "react-router-dom";

const PostsList = (props) => {
    const [posts, setPosts] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const postsRef = useRef();
    let history = useHistory();

    postsRef.current = posts;

    useEffect(() => {
        retrievePosts();
    }, []);

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const retrievePosts = () => {
        PostDataService.getAll()
            .then((response) => {
                setPosts(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByTitle = () => {
        PostDataService.findByTitle(searchTitle)
            .then((response) => {
                setPosts(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deletePost = (rowIndex) => {
        const id = postsRef.current[rowIndex].id;

        PostDataService.remove(id)
            .then((response) => {
                props.history.push("/posts");

                let newPosts = [...postsRef.current];
                newPosts.splice(rowIndex, 1);

                setPosts(newPosts);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={onChangeSearchTitle}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByTitle}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
                >
                    <thead>
                        <tr className="text-center">
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td className="text-center">
                                    <span className="ms-2" onClick={() => history.push("/posts/" + post.id)}>
                                        <i className="far fa-edit action mr-2 text-secondary"></i>
                                    </span>

                                    <span className="ms-2" onClick={() => deletePost(post.id)}>
                                        <i className="fas fa-trash action text-secondary"></i>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostsList;