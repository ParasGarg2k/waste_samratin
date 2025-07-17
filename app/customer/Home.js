'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Recycle, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Award,
  BookOpen,
  Play,
  ChevronRight
} from 'lucide-react';
import WasteClassifier from './WasteClassifier';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import "./styles.css"; // Import the combined styles.css

const Home = () => {
  const [activeTab, setActiveTab] = useState('classifier');

  // Hardcoded blog data
  const blogs = [
    {
      id: 1,
      title: "The Impact of Proper Waste Segregation",
      excerpt: "Learn how proper waste segregation can reduce landfill waste by up to 60% and create a sustainable future.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      category: "Education",
      readTime: "5 min read",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Understanding Different Waste Categories",
      excerpt: "A comprehensive guide to wet, dry, red, and mixed waste categories and how to identify them correctly.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
      category: "Guide",
      readTime: "8 min read",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "AI Technology in Waste Management",
      excerpt: "Discover how artificial intelligence is revolutionizing waste classification and recycling processes.",
      image: "https://images.unsplash.com/photo-1485827404704-89b55fcc595e?w=400&h=250&fit=crop",
      category: "Technology",
      readTime: "6 min read",
      date: "2024-01-10"
    }
  ];

  // Waste categories info
  const wasteCategories = [
    {
      name: "Wet Waste",
      color: "waste-wet",
      description: "Organic waste like food scraps, vegetable peels",
      icon: "🍎",
      examples: ["Food waste", "Vegetable peels", "Tea leaves", "Eggshells"]
    },
    {
      name: "Dry Waste",
      color: "waste-dry",
      description: "Recyclable materials like paper, plastic, metal",
      icon: "📦",
      examples: ["Paper", "Plastic bottles", "Metal cans", "Cardboard"]
    },
    {
      name: "Red Waste",
      color: "waste-red",
      description: "Hazardous waste requiring special handling",
      icon: "⚠️",
      examples: ["Batteries", "Medicines", "Thermometers", "Syringes"]
    },
    {
      name: "Mixed Waste",
      color: "waste-mixed",
      description: "Non-segregated waste that goes to landfill",
      icon: "🗑️",
      examples: ["Mixed garbage", "Contaminated items", "Non-recyclable"]
    }
  ];

  // Stats data
  const stats = [
    { label: "Waste Segregated", value: "2.5kg", icon: Recycle, color: "text-green-600" },
    { label: "Accuracy Rate", value: "94%", icon: Award, color: "text-blue-600" },
    { label: "Community Members", value: "1,247", icon: Users, color: "text-purple-600" },
    { label: "CO2 Saved", value: "12.3kg", icon: Leaf, color: "text-emerald-600" }
  ];

  const handleClassificationComplete = (result) => {
    console.log('Classification completed:', result);
    // Here you would typically save to backend
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <motion.div 
          className="hero-section" // Replaced text-center py-12
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Smart Waste Management for a
            <span className="gradient-text"> Sustainable Future</span>
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            Use AI-powered waste classification to properly segregate your waste and contribute to a cleaner environment.
          </Typography>
          
          {/* Stats */}
          <Grid container spacing={2} sx={{ mt: 4, mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <motion.div
                  className="stat-card" // Replaced card p-4 text-center
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Apply stat-icon class and specific color classes */}
                  <stat.icon className={`stat-icon ${stat.color}`} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Main Content Tabs */}
        <Card sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} aria-label="AI Classifier and Waste Education">
              {[
                { id: 'classifier', label: 'AI Classifier', icon: Play },
                { id: 'education', label: 'Waste Education', icon: BookOpen },
                { id: 'blogs', label: 'Latest Blogs', icon: TrendingUp }
              ].map((tab) => (
                <Tab
                  key={tab.id}
                  // Apply icon-sm class for icon sizing
                  icon={<tab.icon className="icon-sm" />}
                  label={tab.label}
                  value={tab.id}
                  sx={activeTab === tab.id ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* AI Classifier Tab */}
            {activeTab === 'classifier' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <WasteClassifier onClassificationComplete={handleClassificationComplete} />
              </motion.div>
            )}

            {/* Waste Education Tab */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                sx={{ mt: 4 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Understanding Waste Categories
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  Learn about different types of waste and how to properly segregate them for better recycling and disposal.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {wasteCategories.map((category, index) => (
                    <Grid item xs={12} md={6} key={category.name}>
                      <motion.div
                        className={`waste-card ${category.color}`} // Replaced p-6
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                          <span className="text-2xl">{category.icon}</span> {/* Apply text-2xl class */}
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                            {category.name}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                          {category.description}
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'semibold' }}>Examples:</Typography>
                          <Stack spacing={0.5}>
                            {category.examples.map((example, idx) => (
                              <Typography key={idx} variant="body2" sx={{ opacity: 0.9 }}>• {example}</Typography>
                            ))}
                          </Stack>
                        </Stack>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Tips Section */}
                <Card sx={{ mt: 4, p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    {/* Apply stat-icon class for Lightbulb */}
                    <Lightbulb className="stat-icon text-yellow-500" /> 
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      Pro Tips for Better Segregation
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>Rinse containers before disposal to avoid contamination</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>Keep separate bins for different waste types</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>Use the AI classifier when unsure about waste type</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>Compost organic waste when possible</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>Educate family members about proper segregation</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>Report hazardous waste to proper authorities</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </motion.div>
            )}

            {/* Blogs Tab */}
            {activeTab === 'blogs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                sx={{ mt: 4 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Latest from Our Blog
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Stay updated with the latest trends and tips in waste management
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {blogs.map((blog, index) => (
                    <Grid item xs={12} md={4} key={blog.id}>
                      <motion.article
                        className="blog-card" // Replaced card overflow-hidden hover:shadow-xl transition-shadow duration-300
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={blog.image}
                          alt={blog.title}
                        />
                        <CardContent>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                            <Button variant="outlined" size="small" sx={{ borderRadius: 20 }}>
                              {blog.category}
                            </Button>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{blog.readTime}</Typography>
                          </Stack>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {blog.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {blog.excerpt}
                          </Typography>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {new Date(blog.date).toLocaleDateString()}
                            </Typography>
                            <Button variant="text" startIcon={<ChevronRight className="icon-sm" />} sx={{ textTransform: 'none' }}> {/* Apply icon-sm class */}
                              Read More
                            </Button>
                          </Stack>
                        </CardContent>
                      </motion.article>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
