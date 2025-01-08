import React, { useEffect, useState } from 'react'
import { Image, Text, Button, Typography, Box, Container, IconButton, useMediaQuery, useTheme, FormControlLabel, Checkbox, TextField } from '@mui/material';
import iconHD from '../content/iconHD.png';
import deleteIcon from '../content/deleteIcon.png'
import { useLocation } from 'react-router-dom';
const Dashboard = () => {
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on sign-out
    window.location.href = '/signin';
  }
  const token = localStorage.getItem('token');

  const fetchUserData = async () => {
    if (!token) {
      // Handle case if token is not available
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/get-user-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send token in the header
        },
      });
      console.log(response.data);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserData(data);

      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get the token from localStorage
    fetchUserData();
  }, []);

  const addNote = async () => {
    const token = localStorage.getItem('token'); // Moved inside the function to ensure it always fetches the latest token
    if (!newNote.trim()) return alert('Note content cannot be empty!');
    try {
      const response = await fetch('http://localhost:5000/add-note', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newNote })
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      setNewNote('');
      fetchUserData();
    } catch (error) {
      console.error('Error adding note:', error);
      alert(`Failed to add note: ${error.message}`);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-note/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchUserData(); // Refresh notes after deletion
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };




  return (
    <div>
      <Container style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <Box margin={'20px'} marginBottom={'60px'} display={'flex'} gap={'10%'} alignItems={'center'} justifyContent={'space-between'}>
          <div style={{ display: "flex", gap: "15%" }}>
            <img src={iconHD} alt="" />
            <Typography fontSize={"25px"}> Dashboard </Typography>

          </div><Button style={{ textDecoration: "underline", textTransform: "none" }} onClick={handleLogout}>Sign Out</Button>
        </Box>
        <Box maxWidth={'700px'} border={'solid 1px grey'} fontWeight={'700'}
          margin={'20px'} fontSize={'22px'} padding={'15px'} display={'flex'}
          justifyContent={'center'} flexDirection={'column'} alignItems={'center'}
          borderRadius={'10px'} gap={'10px'} boxShadow={'rgb(146,150,156,0.2) 5px 5px 5px 5px'} >
          <div>Welcome, {user ? user.name : 'Guest'}!</div>
          <div style={{ fontSize: "15px", fontWeight: "0", color: "grey" }}> Email: {user ? user.email : 'Not available'} </div>
        </Box>
        <Box sx={{
          marginLeft: "5%",
          maxWidth: {
            xs: "21rem", // For small devices
            sm: "25rem"  // For medium and larger devices
          }
        }} >
          <TextField
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
          />
          <Button type='submit' onClick={addNote} variant='contained' sx={{
            display: 'flex',
            minWidth: '100%',
            background: '#367AFF',
            borderRadius: '3px',
            color: "white",
            marginTop: "20px",
            textTransform: "none",
            justifyContent: "center",
            alignItems: "center",
          }
          }>
            <div>Create Note</div>
          </Button>


          <Typography fontSize={"28px"} marginTop={"50px"} fontWeight={"600"} marginBottom={"20px"}>
            Notes
          </Typography>
          <Box display={"flex"} flexDirection={"column"}>

            {user && user.notes && user.notes.length > 0 ? (
              user.notes.map((note, index) => (
                <Box key={note.id} id={index} border={'solid 1px grey'} fontWeight={'700'}
                  fontSize={'22px'} padding={'15px'} display={'flex'}
                  justifyContent={'space-between'} alignItems={'center'}
                  borderRadius={'10px'} gap={'10px'} boxShadow={'rgb(146,150,156,0.2) 5px 5px 5px 5px'}
                  maxWidth={"100%"} marginBottom={'10px'}>
                  <div>{note.content}</div>
                  <img
                    src={deleteIcon}
                    alt="delete"
                    style={{ cursor: 'pointer' }}
                    onClick={() => deleteNote(note._id)}
                  />
                </Box>
              ))
            ) : (
              <Typography>No notes available</Typography>
            )}
          </Box>


        </Box>
      </Container>
    </div>
  )
}

export default Dashboard
