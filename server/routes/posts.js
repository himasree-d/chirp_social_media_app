const express = require('express');
const { 
  getPosts, 
  getPost, 
  createPost, 
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  lingerPost,
  savePost,
  unsavePost,
  getSavedPosts,
  updatePost
} = require('../controllers/posts');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/saved', protect, getSavedPosts);

router
  .route('/')
  .get(getPosts)
  .post(protect, upload.single('image'), createPost);
router
  .route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);

router
  .route('/:id/comments')
  .post(protect, addComment)
  .get(getComments);

router.post('/:id/linger', protect, lingerPost);

router.post('/:id/save', protect, savePost);
router.delete('/:id/save', protect, unsavePost);

module.exports = router;
