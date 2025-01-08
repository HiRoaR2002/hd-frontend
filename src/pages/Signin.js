import React, { useState } from 'react';
import { Image, TextField, Button, Typography, Box, Container, IconButton, useMediaQuery, useTheme, FormControlLabel, Checkbox } from '@mui/material';
import iconHD from '../content/iconHD.png';
import googlelogo from '../content/googlelogo.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Signin = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: ''
  });

  const [showOTP, setShowOTP] = useState(false); // State for showing/hiding OTP
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/verify-signin-otp`, {
        email: formData.email,
        otp: formData.otp
      });
      if (response.status === 200) {
        const { token, redirectTo } = response.data;

        // Store the token in localStorage on the client-side
        localStorage.setItem('token', token);

        // Redirect to the dashboard or desired page
        window.location.href = redirectTo;
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      alert('Error verifying OTP: ' + error.message);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/signin`, { email: formData.email });
      if (response.status === 200) {
        alert('OTP sent successfully!');
        setOtpSent(true); // Set OTP sent state to true
        setShowOTP(true); // Show OTP input field
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      alert('Error sending OTP: ' + error.message);
    }
  };
  const handleClickShowOTP = () => {
    setShowOTP(!showOTP); // Toggle OTP visibility
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small


  return (
    <div>
      <Box
        display="flex"
        gap="5px"
        alignItems="center"
        justifyContent={isSmallScreen ? 'center' : 'flex-start'} // Center for small screens
        margin={"20px"}
        marginTop={"30px"}
        marginBottom="15px"
      >
        <img src={iconHD} alt="HD Icon" style={{ width: "40px", height: "40px" }} />
        <Typography
          sx={{
            margin: "2px",
            fontSize: "20px",
            fontWeight: 720
          }}
        >
          HD
        </Typography>
      </Box>

      <Box sx={{
        marginLeft: "5%",
        maxWidth: {
          xs: "21rem", // For small devices
          sm: "25rem"  // For medium and larger devices
        }
      }} >
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '30%',
            background: 'white',
            borderRadius: '20px',
          }}
          onSubmit={handleSubmit}
        >
          <Typography
            fontSize={"40px"}
            fontFamily={"unset"}
            fontWeight={"690"}
            marginBottom='3px'
            color='black'
            textAlign={isSmallScreen ? 'center' : 'flex-start'}>Sign In</Typography>
          <Typography marginBottom={"20px"} textAlign={isSmallScreen ? 'center' : 'flex-start'}> Please login to continue to your account</Typography>


          <TextField
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            style={{ marginBottom: '20px' }}
          />

          <TextField
            label='OTP'
            type={showOTP ? 'text' : 'password'} // Change type based on visibility state
            name='otp'
            value={formData.otp}
            onChange={handleChange}
            style={{ marginBottom: '20px' }}

          />
          <Button
            variant='contained'
            style={{ marginBottom: '20px' }}
            onClick={handleSendOTP}>
            Send OTP
          </Button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <Button
                sx={{
                  fontSize: "12px",
                  textDecoration: "underline",
                  color: "#367AFF",
                  textTransform: "none" // Prevents capitalization in MUI buttons
                }}
              >
                Forgot Password?
              </Button>

            </div>

            {/* Keep me logged in checkbox */}
            <FormControlLabel
              control={<Checkbox />}
              label="Keep me logged in"
              sx={{ fontSize: "12px" }}
            />

          </div>

          <Button type='submit' variant='contained' sx={{
            backgroundColor: '#367AFF',
            '&:hover': {
              backgroundColor: '#2c63c8', // Optional: You can add a darker shade for hover effect
            }
          }}>Sign In</Button>
        </form>
        <div style={{ display: "flex", alignItems: "center", marginTop: "25px" }}>
          <div style={{ flex: 1, borderBottom: "1px solid #D9D9D9", margin: "0 10px" }}></div>
          <div>or</div>
          <div style={{ flex: 1, borderBottom: "1px solid #D9D9D9", margin: "0 10px" }}></div>
        </div>
        <Button type='submit' variant='contained' sx={{
          display: 'flex',
          gap: '7px',
          minWidth: '100%',
          background: 'white',
          borderRadius: '3px',
          color: "black",
          marginTop: "20px"
        }
        }>
          <div>Continue with Google</div>
          <img height={'16px'} width={'16px'} src={googlelogo} alt="" />
        </Button>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Horizontally center the content
          alignItems: "center",  // Ensures full viewport height for vertical centering
          textAlign: "center",
          marginTop: "50px"
        }}
      >
        <div>Need an account? <a href='/signup' style={{ textDecoration: "underline", color: "#367AFF" }}>Create One</a></div>
      </div>
    </div>
  );
};

export default Signin;

