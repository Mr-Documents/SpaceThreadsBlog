import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import RichTextEditor from '../../components/ui/RichTextEditor';

const CreatePostSchema = Yup.object().shape({
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

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Load categories and tags on component mount
  React.useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

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
      let coverImageUrl = null;
      
      // Upload cover image if selected
      if (coverImage) {
        coverImageUrl = await handleImageUpload(coverImage);
      }

      // Prepare post data
      const postData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || null,
        coverImage: coverImageUrl,
        published: values.published || false,
        categoryId: values.categoryId || null,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };

      // Create post
      const token = localStorage.getItem('st_token');
      const response = await fetch('http://localhost:8080/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to the created post or dashboard
        navigate(`/posts/${result.data.id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to create post' });
      }
    } catch (error) {
      console.error('Post creation error:', error);
      setErrors({ submit: 'An error occurred while creating the post' });
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
          <p className="text-gray-400 mb-6">You need to be logged in to create a post.</p>
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

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
            <p className="text-gray-400">Share your thoughts with the world</p>
          </div>

          <Formik
            initialValues={{
              title: '',
              content: '',
              excerpt: '',
              categoryId: '',
              tags: '',
              published: false,
            }}
            validationSchema={CreatePostSchema}
            onSubmit={handleSubmit}
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
                      Choose Image
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
                    Publish immediately
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
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition duration-200"
                  >
                    Cancel
                  </button>
                  
                  <div className="space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => setFieldValue('published', false)}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => setFieldValue('published', true)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
