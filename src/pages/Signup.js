import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import iconHD from '../content/iconHD.png';
import googlelogo from '../content/googlelogo.png';
import { useNavigate } from 'react-router-dom';
const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: ''
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post(`http://localhost:5000/signup`, { name: formData.name, email: formData.email });
      setOtpSent(true);
      setShowOTP(true);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-signup-otp', {
        email: formData.email,
        otp: formData.otp
      });
      console.log(response.status);

      // Ensure proper handling of the response
      if (response.status === 200) {
        alert('Signup successful!');

        // Clear form fields after success
        setFormData({
          name: '',
          dob: '',
          email: '',
          otp: ''
        });

        // Reset OTP-related states
        setShowOTP(false);
        setOtpSent(false);
        navigate('/signin');
      } else {
        alert(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      // Check if the error is from the server response
      if (error.response) {
        alert(error.response.data.message || 'Failed to verify OTP.');
      } else {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP.');
      }
    }
  };



  return (
    <div>
      <Box
        display="flex"
        gap="5px"
        alignItems="center"
        justifyContent={isSmallScreen ? 'center' : 'flex-start'}
        margin="20px"
        marginTop="30px"
        marginBottom="15px"
      >
        <img src={iconHD} alt="HD Icon" style={{ width: '40px', height: '40px' }} />
        <Typography
          sx={{
            margin: '2px',
            fontSize: '20px',
            fontWeight: 720
          }}
        >
          HD
        </Typography>
      </Box>

      <Box sx={{
        marginLeft: '5%',
        maxWidth: {
          xs: '21rem',
          sm: '25rem'
        }
      }}>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '30%',
            background: 'white',
            borderRadius: '20px'
          }}
          onSubmit={handleSubmit}
        >
          <Typography
            fontSize="40px"
            fontFamily="unset"
            fontWeight="690"
            marginBottom='3px'
            color='black'
            textAlign={isSmallScreen ? 'center' : 'flex-start'}>
            Sign up
          </Typography>
          <Typography marginBottom="20px" textAlign={isSmallScreen ? 'center' : 'flex-start'}>
            Sign up to enjoy the feature of HD
          </Typography>

          <TextField
            label='Your Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            style={{ marginBottom: '20px' }}
          />

          <TextField
            label='Date of Birth'
            type='date'
            name='dob'
            value={formData.dob}
            onChange={handleChange}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            style={{ marginBottom: '20px' }}
          />

          <Button
            variant='contained'
            onClick={sendOtp}
            disabled={otpSent}
            style={{ marginBottom: '20px' }}>
            Send OTP
          </Button>

          {showOTP && (
            <TextField
              label='OTP'
              type='text'
              name='otp'
              value={formData.otp}
              onChange={handleChange}
              style={{ marginBottom: '20px' }}
            />
          )}

          <Button
            type='submit'
            variant='contained'
            sx={{
              backgroundColor: '#367AFF',
              '&:hover': { backgroundColor: '#2c63c8' },
              textTransform: 'none'
            }}>
            Sign Up
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
          <div style={{ flex: 1, borderBottom: '1px solid #D9D9D9', margin: '0 10px' }}></div>
          <div>or</div>
          <div style={{ flex: 1, borderBottom: '1px solid #D9D9D9', margin: '0 10px' }}></div>
        </div>

        <Button
          variant='contained'
          sx={{
            display: 'flex',
            gap: '7px',
            minWidth: '100%',
            background: 'white',
            borderRadius: '3px',
            color: 'black',
            marginTop: '20px',
            textTransform: 'none'
          }}>
          <div>Continue with Google</div>
          <img height={'16px'} width={'16px'} src={googlelogo} alt="Google logo" />
        </Button>
      </Box>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '50px'
        }}>
        <div>
          Already have an account? <a href='/signin' style={{ textDecoration: 'underline', color: '#367AFF' }}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
