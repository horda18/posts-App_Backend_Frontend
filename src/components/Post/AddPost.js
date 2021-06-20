import React, { useState } from "react";
import PostDataService from "../../services/PostService";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const AddPost = () => {
    const initialPostState = {
        id: null,
        title: "",
        body: "",
    };
    const [post, setPost] = useState(initialPostState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
    };

    const savePost = () => {
        var data = {
            title: post.title,
            body: post.body
        };

        PostDataService.create(data)
            .then(response => {
                setPost({
                    id: response.data.id,
                    title: response.data.title,
                    body: response.data.body
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newPost = () => {
        setPost(initialPostState);
        setSubmitted(false);
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('title is required'),
        body: Yup.string().required('body is required')
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    return (
        <div className="submit-form mt-5">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newPost}>
                        addPost
                    </button>
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSubmit(savePost)}>
                        <div className="mb-3 mt-4">
                            <label className="form-label" htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="title"
                                value={post.title}
                                {...register('title')}
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                onChange={handleInputChange}
                            />
                            <div className="invalid-feedback">{errors.title?.message}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="body">Body:</label>
                            <textarea rows="8"
                                type="text"
                                id="body"
                                name="body"
                                placeholder="body"
                                value={post.body}
                                {...register('body')}
                                className={`form-control ${errors.body ? 'is-invalid' : ''}`}
                                onChange={handleInputChange}
                            />
                            <div className="invalid-feedback">{errors.body?.message}</div>
                        </div>

                        <button className="btn btn-success">
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddPost;