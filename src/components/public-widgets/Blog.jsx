import React, { useState, useEffect } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const Blog = () => {
  const [blogsCardData, setBlogsCardData] = useState([]);
  const [loading, setLoading] = useState(false);

  function truncateText(text, charLimit) {
    if (text && text.length <= charLimit) {
      return text;
    }
    return text?.slice(0, charLimit) + "...";
  }

  function stripHtmlTags(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }

  const getBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.veralegal.uk/api/blog/post/?page=1&page_size=3`);
      setBlogsCardData(response.data.results);
    } catch (error) {
      console.error('Blog Error:', error?.response);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBlogPosts();
  }, []);

  return (
    <Box sx={{
      py: 3,
      maxWidth: '1440px',
      mx: 'auto',
    }}>
      <Grid container spacing={9}>
        {(blogsCardData?.length && !loading) ? blogsCardData?.map((item, i) => (
          <Grid key={i} item xs={12} md={4}>
            <Stack
              component={'a'}
              href={`https://app.veralegal.uk/blog/${dayjs(item?.created_at).format('YYYY/MM/DD')}/${item?.slug}`}
              target='_blank'
              sx={{
                p: 2,
                background: '#fff',
                borderRadius: '8px',
                height: '100%',
                textDecoration: 'none'
              }}
            >
              <Box position={'relative'} sx={{ mb: 2 }}>
                <Box
                  component={'img'}
                  src={item?.image}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 500 }} color={'text.primary'}>
                {truncateText(item?.title, 60)}
              </Typography>
              <Typography variant='body1' color={'text.secondary'} sx={{ mb: 2 }}>
                {truncateText(stripHtmlTags(item?.content), 160)}
              </Typography>
              <Typography variant='body2' color={'text.secondary'} sx={{ mt: 'auto' }}>
                {dayjs(item?.created_at).format('YYYY-MM-DD')}
              </Typography>
            </Stack>
          </Grid>
        )) : (
          <Grid item xs={12} container alignItems={'center'} justifyContent={'center'} sx={{ minHeight: '400px', color: '#fff' }}>
            <Typography variant='h5'>{loading ? 'Loading...' : 'Blog posts are unavailable'}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default Blog
