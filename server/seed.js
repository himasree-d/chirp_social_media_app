const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const Follow = require('./models/Follow');
const bcrypt = require('bcryptjs');

dotenv.config();

const dummyUsers = [
  {
    username: 'lilamoon',
    displayName: 'Lila Moon',
    email: 'lila@example.com',
    password: 'password123',
    bio: 'Finding magic in the mundane. 🌿 | Minimalist | Nature lover',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
    isPrivate: false
  },
  {
    username: 'kaizen',
    displayName: 'Kai Zen',
    email: 'kai@example.com',
    password: 'password123',
    bio: 'Continuous improvement. ☕️ | Architect | Coffee enthusiast',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
    isPrivate: true
  },
  {
    username: 'ariabloom',
    displayName: 'Aria Bloom',
    email: 'aria@example.com',
    password: 'password123',
    bio: 'Blooming where I am planted. 🌸 | Digital Artist',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400',
    isPrivate: false
  },
  {
    username: 'felix',
    displayName: 'Felix Thorne',
    email: 'felix@example.com',
    password: 'password123',
    bio: 'Chasing shadows. 🌙 | Writer | Dreamer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    isPrivate: true
  },
  {
    username: 'sienna',
    displayName: 'Sienna Art',
    email: 'sienna@example.com',
    password: 'password123',
    bio: 'Earth tones and open skies. 🎨 | Painter',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    isPrivate: false
  },
  {
    username: 'oceaneyes',
    displayName: 'Ocean Blue',
    email: 'ocean@example.com',
    password: 'password123',
    bio: 'Salt in the air, sand in my hair. 🌊 | Surfer | Coastline vibes',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400',
    isPrivate: false
  },
  {
    username: 'urban_zen',
    displayName: 'Maya Zen',
    email: 'maya@example.com',
    password: 'password123',
    bio: 'Finding stillness in the city chaos. 🧘‍♀️ | Yoga | City lights',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400',
    isPrivate: false
  },
  {
    username: 'wanderlust',
    displayName: 'Leo Wander',
    email: 'leo@example.com',
    password: 'password123',
    bio: 'Collecting stamps and stories. ✈️ | Backpacker | Explorer',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400',
    isPrivate: false
  },
  {
    username: 'stardust',
    displayName: 'Nova Space',
    email: 'nova@example.com',
    password: 'password123',
    bio: 'We are all made of stardust. ✨ | Astronomy | Stargazer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400',
    isPrivate: true
  },
  {
    username: 'greenheart',
    displayName: 'Jade Green',
    email: 'jade@example.com',
    password: 'password123',
    bio: 'Plant parent and proud. 🌿 | Botanist | Forest therapy',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=400',
    isPrivate: false
  }
];

const dummyPosts = [
  {
    username: 'lilamoon',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
    caption: 'The morning mist in the valley is pure magic. ✨ #nature #calm',
    tags: ['calm', 'nature']
  },
  {
    username: 'lilamoon',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200',
    caption: 'Sunlight filtering through the canopy. Pure bliss. 🌿',
    tags: ['peaceful', 'forest']
  },
  {
    username: 'kaizen',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
    caption: 'Minimalist architecture is about the space between. 🏛',
    tags: ['reflective', 'minimalist']
  },
  {
    username: 'kaizen',
    imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1200',
    caption: 'Coffee and calm mornings. ☕️',
    tags: ['morning', 'coffee']
  },
  {
    username: 'ariabloom',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    caption: 'Colors of the high mountains. 🏔 #inspired #adventure',
    tags: ['inspired', 'adventure']
  },
  {
    username: 'ariabloom',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1200',
    caption: 'Newest digital piece inspired by the aurora. 🌌',
    tags: ['art', 'creative']
  },
  {
    username: 'oceaneyes',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    caption: 'Chasing the perfect swell. 🌊',
    tags: ['surf', 'beach']
  },
  {
    username: 'oceaneyes',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200',
    caption: 'Sunset sessions are the best sessions. 🌅',
    tags: ['golden', 'ocean']
  },
  {
    username: 'urban_zen',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200',
    caption: 'City lights and late night thoughts. 🌃',
    tags: ['urban', 'night']
  },
  {
    username: 'urban_zen',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200',
    caption: 'Morning flow to start the day right. 🧘‍♀️',
    tags: ['yoga', 'mindful']
  },
  {
    username: 'wanderlust',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200',
    caption: 'Lost in the right direction. 🗺',
    tags: ['travel', 'explore']
  },
  {
    username: 'wanderlust',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200',
    caption: 'Peace by the lake. 🛶',
    tags: ['nature', 'quiet']
  },
  {
    username: 'stardust',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200',
    caption: 'The beauty of the cosmos is beyond words. 🌌',
    tags: ['space', 'cosmic']
  },
  {
    username: 'stardust',
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1200',
    caption: 'Moonlight through my window. 🌙',
    tags: ['moon', 'dreamy']
  },
  {
    username: 'greenheart',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200',
    caption: 'The secret life of plants. 🪴',
    tags: ['green', 'botany']
  },
  {
    username: 'greenheart',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200',
    caption: 'Forest bathing is the best therapy. 🌲',
    tags: ['forest', 'zen']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const createdUsers = [];
    for (const u of dummyUsers) {
      let user = await User.findOne({ username: u.username });
      if (!user) {
        user = await User.create({ ...u, passwordHash: u.password });
      } else {
        user.avatarUrl = u.avatarUrl;
        user.bio = u.bio;
        user.displayName = u.displayName;
        user.passwordHash = u.password; // re-set so pre-save hook re-hashes correctly
        await user.save();
      }
      createdUsers.push(user);
    }

    for (const p of dummyPosts) {
      const author = createdUsers.find(u => u.username === p.username);
      if (author) {
        let post = await Post.findOne({ authorId: author._id, caption: p.caption });
        if (!post) {
          await Post.create({
            authorId: author._id,
            imageUrl: p.imageUrl,
            thumbnailUrl: p.imageUrl,
            caption: p.caption,
            tags: p.tags
          });
        } else {
          post.imageUrl = p.imageUrl;
          post.thumbnailUrl = p.imageUrl;
          await post.save();
        }
      }
    }

    // Mutual follows
    const usersToLink = ['lilamoon', 'kaizen', 'ariabloom', 'oceaneyes', 'urban_zen', 'wanderlust', 'greenheart'];
    for (let i = 0; i < usersToLink.length; i++) {
      for (let j = i + 1; j < usersToLink.length; j++) {
        const u1 = createdUsers.find(u => u.username === usersToLink[i]);
        const u2 = createdUsers.find(u => u.username === usersToLink[j]);
        if (u1 && u2) {
          await Follow.findOneAndUpdate(
            { followerId: u1._id, followingId: u2._id },
            { status: 'accepted' },
            { upsert: true }
          );
          await Follow.findOneAndUpdate(
            { followerId: u2._id, followingId: u1._id },
            { status: 'accepted' },
            { upsert: true }
          );
        }
      }
    }

    console.log('Seeding complete with reliable Unsplash IDs!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
