import React from "react";
import Container from "@mui/material/Container";
import { Box, Typography, Grid } from "@mui/material";
import { ReactComponent as FamilyIcon } from "../../assets/family-law-icon.svg";
import { ReactComponent as CriminalDefence } from "../../assets/criminal-defence-icon.svg";
import { ReactComponent as EmploymentLaw } from "../../assets/employment-law-icon.svg";
import { ReactComponent as ImigrationLaw } from "../../assets/Immigration-law.svg";
import { ReactComponent as TaxRelief } from "../../assets/tax-relief-icon.svg";
import { ReactComponent as DuiDefence } from "../../assets/dui-defence.svg";
import { useNavigate } from "react-router-dom";
import "./FeaturesSection.scss";

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="custom-container fit-to-screen"
      sx={{ md: { paddingBottom: "5rem" } }}
      id="services"
    >
      <Box className="feature-section-wrapper" >
        <Typography
          variant="h4"
          color="initial"
          mt={5}
          sx={{display:{xs:"none", md:"block"}}}
          className="feature-heading"
      
        >
          Our services
        </Typography>

        <Grid className="feature-items-wrapper"  mt={6} container id="servicesMob">
          <Box
          sx={{display:{xs:"flex", md:"none"}, justifyContent:"center",  width:"100%"}}
          >
          <Typography
          variant="h4"
          color="initial"
          mt={7}
          className="feature-heading"
        >
          Our services
        </Typography>
          </Box>
       
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            className="feature-item"
            onClick={() => {
              navigate(
                `/onboarding/0?category=Getting a divorce or separation?`
              );
            }}
          >
            <Box className="feature-item-icon" >
              <FamilyIcon style={{ width: "80px", height:"80px"}}/>
            </Box>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading no-wrap"
            >
              Getting a divorce or separation?
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              className="feature-item-para"
            >
              We understand things don't always go as planned, let us find a
              solution
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            className="feature-item"
            onClick={() => {
              navigate(
                `/onboarding/0?category=Need a visa or immigrating to the UK?`
              );
            }}
          >
            <Box className="feature-item-icon" >
              <CriminalDefence style={{ width: "80px", height:"80px"}}/>
            </Box>
            <Typography
              variant="h6"
              color="initial"
              textAlign="center"
              className="feature-item-heading no-wrap"
            >
              Need a visa or immigrating to the UK?
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              className="feature-item-para"
            >
              We appreciate this is not always as simple as it should be whether
              making the application, seeking advice or navigating the home
              office. Let us help you.
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            className="feature-item"
            onClick={() => {
              navigate(
                `/onboarding/0?category=Are you a current or prospective Landlord or Tenant?`
              );
            }}
          >
            <Box className="feature-item-icon">
              <EmploymentLaw  style={{ width: "80px", height:"80px"}}/>
            </Box>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading no-wrap"
            >
              Are you a current landlord or tenant?
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              className="feature-item-para"
            >
              <span>Our experienced lawyers understand both sides</span>
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            className="feature-item"
            mt={1}
            onClick={() => {
              navigate(`/onboarding/0?category=Trouble at work?`);
            }}
          >
            <Box className="feature-item-icon">
              <ImigrationLaw style={{ width: "80px", height:"80px"}}/>
            </Box>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading"
            >
              Trouble at work?
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              className="feature-item-para"
            >
              Whether you're having trouble at your existing workplace or a new
              employment contract we can guide you through it all
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            className="feature-item"
            mt={1}
            onClick={() => {
              navigate(`/onboarding/0?category=Falsely accused of a crime?`);
            }}
          >
            <Box className="feature-item-icon">
              <TaxRelief style={{ width: "80px", height:"80px"}}/>
            </Box>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading"
            >
              Falsely accused of a crime?
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              className="feature-item-para"
            >
              The law and police exist to protect us, but that doesn’t mean you
              shouldn’t protect yourself
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
            item
            className="feature-item"
            sx={{ width: "100%" }}
            mt={1}
            onClick={() => {
              navigate(`/onboarding/0?category=Any Other challenges?`);
            }}
          >
            <Box className="feature-item-icon">
              <DuiDefence style={{ width: "80px", height:"80px"}}/>
            </Box>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading"
            >
              Any other challenges?
            </Typography>
            <Typography
              variant="body1"
              color="initial"
              className="feature-item-para"
            ></Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FeaturesSection;
