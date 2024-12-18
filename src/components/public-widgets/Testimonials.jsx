import React from 'react';
import Slider from "react-slick";
import { Box, Stack, Avatar, Typography, Rating } from '@mui/material';
import { ReactComponent as FilledStar } from '../../assets/public-widgets/filled-star.svg';
import { ReactComponent as Star } from '../../assets/public-widgets/star.svg';
import { ReactComponent as ArrowLeft } from '../../assets/public-widgets/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../assets/public-widgets/arrow-right.svg';
import location from '../../assets/public-widgets/location.png';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
    {
        name: 'Qasim Ashraf',
        image: '',
        location: 'GB',
        date: '27 Feb 2024',
        title: 'Affordable Quality service',
        review: 'I needed to get urgent legal advice and tested Vera. The whole experience was great, very affordable and quality service',
        ex_date: '23 February 2024',
    },
    {
        name: 'Bilal Shahid',
        image: 'https://user-images.trustpilot.com/65c14e3559efed001256896a/73x73.png',
        location: 'GB',
        date: '6 Feb 2024',
        title: 'My Go-To for Legal Help on a Budget',
        review: 'This legal services platform has been an invaluable resource for me. As someone without a lot of disposable income, I was hesitant to seek legal help because lawyers are so expensive. This platform makes legal help accessible and affordable.',
        ex_date: '05 February 2024',
    },
    {
        name: 'Hasham Sheikh',
        image: 'https://user-images.trustpilot.com/65defa50b9fa850011d75c8b/73x73.png',
        location: 'IE',
        date: '28 Feb 2024',
        title: 'Immigration advice',
        review: 'Needed some advice on a potentially complicated application. Once I reached out had a fantastic discovery call with them leading to an affordable service. My go to for Immigration advice',
        ex_date: '15 February 2024',
    },
    {
        name: 'Eesha Fahad',
        image: 'https://user-images.trustpilot.com/65e351d2fcb78e001262891f/73x73.png',
        location: 'PK',
        date: '2 Mar 2024',
        title: 'Excellent experience!',
        review: 'Needed legal advice while travelling on an urgent basis. Was able to access this from Vera, both affordably and in a timely manner.',
        ex_date: '18 February 2024',
    },
    {
        name: 'Muizz Ahmad',
        image: 'https://user-images.trustpilot.com/65e481b90a1b73001216323c/73x73.png',
        location: 'PK',
        date: '3 Mar 2024',
        title: 'Excellent service despite having a complicated case',
        review: 'Needed timely advice over a pressing matter and received it. Excellent service will recommend strongly.',
        ex_date: '28 February 2024',
    },
    {
        name: 'Haris Tariq',
        image: 'https://user-images.trustpilot.com/65defa50b9fa850011d75c8b/73x73.png',
        location: 'IE',
        date: '28 Feb 2024',
        title: 'Transparent and affordable service',
        review: 'Having used lawyers in the past I have found the experience of interacting with them and requesting updates from them painful. My experience with Vera has been the opposite, a must use platform. Highly recommended.',
        ex_date: '23 February 2024',
    },
    // {
    //     name: 'Rasheed Ahmad',
    //     image: 'https://user-images.trustpilot.com/65c54f7afd9ff200120e49cf/73x73.png',
    //     location: 'GB',
    //     date: '9 Feb 2024',
    //     title: 'Outstanding',
    //     review: 'Outstanding service combined with a thorough understanding!',
    //     ex_date: '15 December 2023',
    // },
]

const Testimonials = () => {
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <ArrowLeft />,
        nextArrow: <ArrowRight />,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                }
            },
        ]
    };
    return (
        <Box sx={{
            py: 0,
            maxWidth: '1440px',
            mx: 'auto',
            px: { xs: 0, md: '76px' },
            ".slick-slider": {
                ".slick-track": {
                    display: 'flex',
                    ".slick-slide": {
                        flexGrow: 1,
                        height: 'auto',
                        '&>div': {
                            height: '100%',
                        }
                    }
                },
                '.slick-prev': {
                    left: '-76px',
                },
                '.slick-next': {
                    right: '-76px',
                },
                '.slick-prev, .slick-next': {
                    width: '44px',
                    height: '44px',
                }
            }
        }}>
            <Slider {...settings}>
                {reviews.map((item, i) => (
                    <Box sx={{ px: 1.5, height: '100%' }} key={i}>
                        <Stack
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 4,
                                minHeight: 200,
                                textAlign: 'left',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                gap={2}
                                sx={{
                                    p: 3,
                                    borderBottom: 1,
                                    borderColor: '#F4F3F0',
                                }}>
                                <Avatar src={item?.image} sx={{ width: 64, height: 64 }}>{item?.name[0]}</Avatar>
                                <Stack>
                                    <Typography variant='subtitle1' fontWeight={600}>
                                        {item?.name}
                                    </Typography>
                                    <Stack direction={'row'} alignItems={'center'} gap={4}>
                                        <Typography variant='body1' color={'textSecondary'}>
                                            1 reviews
                                        </Typography>
                                        <Stack direction={'row'} alignItems={'center'} gap={1}>
                                            <Box
                                                component={'img'}
                                                src={location}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                            <Typography variant='subtitle1' fontWeight={600} color={'textSecondary'}>
                                                {item?.location}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack sx={{ px: 2, py: 3, flexGrow: 1, }} gap={2}>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Rating
                                        value={5}
                                        icon={<FilledStar />}
                                        emptyIcon={<Star />}
                                        readOnly
                                    />

                                    <Typography variant='body1' color={'textSecondary'}>
                                        {item?.date}
                                    </Typography>
                                </Stack>
                                <Typography variant='subtitle1' fontWeight={600} sx={{ textDecoration: 'underline' }}>
                                    {item?.title}
                                </Typography>
                                <Typography variant='body1' color={'textSecondary'}>
                                    {item?.review}
                                </Typography>
                                <Stack direction={'row'} marginTop={'auto'} alignItems={'center'} gap={0.5}>
                                    <Typography variant='subtitle1' fontWeight={600}>
                                        Date of experience:
                                    </Typography>
                                    <Typography variant='body1' color={'textSecondary'}>
                                        {item?.ex_date}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                ))}
            </Slider>
        </Box>
    )
}

export default Testimonials
