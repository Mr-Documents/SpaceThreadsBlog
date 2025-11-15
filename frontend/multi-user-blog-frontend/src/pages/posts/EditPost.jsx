import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import RichTextEditor from '../../components/ui/RichTextEditor';
import postService from '../../services/postService';

const EditPostSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(10, 'Content must be at least 10 characters')
    .required('Content is required'),
  excerpt: Yup.string()
    .max(300, 'Excerpt cannot exceed 300 characters'),
  categoryId: Yup.number(),
  tags: Yup.string(),
});

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  // Load post data and categories/tags on component mount
  useEffect(() => {
    loadPost();
    loadCategories();
    loadTags();
  }, [id]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getPostById(id);
      if (response.success) {
        const postData = response.data;
        setPost(postData);
        if (postData.coverImage) {
          setCoverImagePreview(postData.coverImage);
        }
      } else {
        setError('Failed to load post');
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      setError('Failed to load post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/categories');
      if (response.ok) {
        const result = await response.json();
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/tags');
      if (response.ok) {
        const result = await response.json();
        setAvailableTags(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('st_token');
      const response = await fetch('http://localhost:8080/api/v1/media/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.data.url;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsSubmitting(true);
    
    try {
      let coverImageUrl = post.coverImage;
      
      // Upload new cover image if selected
      if (coverImage) {
        coverImageUrl = await handleImageUpload(coverImage);
      }

      // Prepare post data
      const postData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || null,
        coverImage: coverImageUrl,
        published: values.published,
        categoryId: values.categoryId || null,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };

      // Update post
      const response = await postService.updatePost(id, postData);

      if (response.success) {
        // Redirect to the updated post
        navigate(`/posts/${id}`);
      } else {
        setErrors({ submit: response.message || 'Failed to update post' });
      }
    } catch (error) {
      console.error('Post update error:', error);
      setErrors({ submit: error.response?.data?.message || 'An error occurred while updating the post' });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to edit a post.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Post</h1>
            <p className="text-gray-400">Update your post details</p>
          </div>

          <Formik
            initialValues={{
              title: post.title || '',
              content: post.content || '',
              excerpt: post.excerpt || '',
              categoryId: post.category?.id || '',
              tags: post.tags?.map(t => t.name).join(', ') || '',
              published: post.published || false,
            }}
            validationSchema={EditPostSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter your post title..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      id="cover-image"
                    />
                    <label
                      htmlFor="cover-image"
                      className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                      {coverImagePreview ? 'Change Image' : 'Choose Image'}
                    </label>
                    {coverImagePreview && (
                      <div className="relative">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImage(null);
                            setCoverImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={values.content}
                    onChange={(content) => setFieldValue('content', content)}
                    placeholder="Write your post content here..."
                    minHeight="400px"
                  />
                  <ErrorMessage name="content" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt (Optional)
                  </label>
                  <Field
                    as="textarea"
                    name="excerpt"
                    rows="3"
                    placeholder="Brief description of your post..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="excerpt" component="div" className="text-red-400 text-sm mt-1" />
                  <p className="text-xs text-gray-500 mt-1">If left empty, an excerpt will be generated from your content.</p>
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <Field
                      as="select"
                      name="categoryId"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags
                    </label>
                    <Field
                      name="tags"
                      type="text"
                      placeholder="tag1, tag2, tag3"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>
                </div>

                {/* Published Checkbox */}
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="published"
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-300">
                    Published
                  </label>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="text-red-400 text-sm">{errors.submit}</div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/posts/${id}`)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition duration-200"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Post'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
