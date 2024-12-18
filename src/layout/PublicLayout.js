import React, { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const PublicLayout = ({ children }) => {
  const mobile = useMediaQuery('(max-width: 600px)');
  const container = useMediaQuery('(min-width: 1280px)');

  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  return (
    <Box>
      {mobile ? (<MobileNavbar />) : (<Navbar />)}
      <Box sx={{
          maxWidth: {sm: 1, md: container ? '1280px' : 1},
          marginX: 'auto',
          width: 1,
          paddingX: container ? 0 : 4,
          paddingY: 12,
        }}
      >
        {children}
      </Box>  
      <ContactForm />
      <Footer />
   </Box>
  )
}
 
export default PublicLayout
