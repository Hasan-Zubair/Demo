import React from 'react';
import { Stack, Grid, Box, Typography, } from '@mui/material';

import youtube from '../../assets/public-widgets/youtube.png';
const Youtube = () => {

  const data = [
    {
      title: 'A conversation with Qiyin Chuah, a UK Immigration Lawyer with...',
      description: "Join us for an inspiring episode of Vera Legal Insights as we delve into Qiyin Chuah's remarkable journey in immigration law. From facing personal visa challenge...",
      img: 'https://i3.ytimg.com/vi/Az22dIF7qZA/maxresdefault.jpg',
      link: 'https://www.youtube.com/watch?v=Az22dIF7qZA&t=52s&ab_channel=VeraLegal',
      date: '2024-03-17'
    },
    {
      title: "Securing Your Family's Future: The Power of Wills and Inheritance...",
      description: "Welcome back to Vera Legal Insights! In this episode, we explore the crucial topic of wills and inheritance with Mikhail Charles, an esteemed expert in family la...",
      img: 'https://i3.ytimg.com/vi/PuLCt0Yy2JA/maxresdefault.jpg',
      link: 'https://www.youtube.com/watch?v=PuLCt0Yy2JA&ab_channel=VeraLegal',
      date: '2024-03-10'
    },
    {
      title: "Navigating the New UK Immigration Landscape Live with Jay Gajjar",
      description: "Welcome to Vera Legal Insights! In this recorded episode, join us as we dive into the latest updates and changes in UK immigration law with Jay Gajjar, a disti...",
      link: 'https://www.youtube.com/watch?v=DNTP1Wtxi2U&t=1s&ab_channel=VeraLegal',
      img: 'https://i3.ytimg.com/vi/DNTP1Wtxi2U/maxresdefault.jpg',
      date: '2024-03-03'
    },
  ];

  return (
    <Box sx={{
      py: 3,
      maxWidth: '1440px',
      mx: 'auto',
    }}>
      <Grid container spacing={9}>
        {data?.map((item, i) => (
          <Grid key={i} item xs={12} md={4}>
            <Stack
              component={'a'}
              href={item?.link}
              target='_blank'
              sx={{
                p: 2,
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 44px rgba(0,0,0,0.16)',
                height: '100%',
                textDecoration: 'none'
              }}
            >
              <Box position={'relative'} sx={{ mb: 2 }}>
                <Box
                  component={'img'}
                  src={item?.img}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                  }}
                />
                <Box
                  component={'img'}
                  src={youtube}
                  sx={{
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: 'calc(50% - 50px)',
                    left: 'calc(50% - 50px)',
                    zIndex: 2,
                  }}
                />
              </Box>
              <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 500 }} color={'text.primary'}>
                {item.title}
              </Typography>
              <Typography variant='body1' color={'text.secondary'} sx={{ mb: 2 }}>
                {item.description}
              </Typography>
              <Typography variant='body2' color={'text.secondary'} sx={{ mt: 'auto' }}>
                {item.date}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Youtube
