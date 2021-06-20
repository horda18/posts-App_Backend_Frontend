import React, { useState, useEffect } from "react";
import PostDataService from "../../services/PostService";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


const Post = props => {

    const initialPostState = {
        id: null,
        title: "",
        body: ""
    };
    const [currentPost, setCurrentPost] = useState(initialPostState);
    const [message, setMessage] = useState("");

    const getPost = id => {
        PostDataService.get(id)
            .then(response => {
                setCurrentPost(response.data);
                setValue("title", response.data.title);
                setValue("body", response.data.body);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getPost(props.match.params.id);
    }, [props.match.params.id]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentPost({ ...currentPost, [name]: value });
    };

    const updatePost = () => {
        PostDataService.update(currentPost.id, currentPost)
            .then(response => {
                console.log(response.data);
                setMessage("The post was updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('title is required'),
        body: Yup.string().required('body is required')
    });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),
    });
    
    return (
        <div>
            {currentPost ? (
                <div className="edit-form">
                    <h4>Post</h4>
                    <form onSubmit={handleSubmit(updatePost)}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={currentPost.title}
                                {...register('title')}
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                onChange={handleInputChange}
                            />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="body">Body:</label>
                            <textarea rows="10"
                                type="text"
                                id="body"
                                name="body"
                                value={currentPost.body}
                                {...register('body')}
                                className={`form-control ${errors.body ? 'is-invalid' : ''}`}
                                onChange={handleInputChange}
                            />
                            <div className="invalid-feedback">{errors.body?.message}</div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success ms-2"
                        >
                            Update
                        </button>
                    </form>

                    
                    
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Please click on a Post...</p>
                </div>
            )}
        </div>
    );
};

export default Post;