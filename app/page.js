"use client";
import * as React from 'react';
import { useRouter } from "next/navigation";
import { Box, Container, Paper, Typography, Button, Stack, Grid } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box minHeight="100vh" bgcolor="background.default" display="flex" alignItems="center" justifyContent="center">
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
            Waste Samaritin
          </Typography>
          <Typography variant="h6" color="primary.700" mb={4}>
            Sustainable Waste Management Platform
          </Typography>
          <Typography variant="subtitle1" color="primary.500" mb={4}>
            Please select your role to continue:
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<GroupIcon />}
                sx={{ py: 2, fontWeight: 600, fontSize: 18, borderRadius: 2 }}
                onClick={() => router.push('/collector')}
              >
                Collector
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                startIcon={<PersonIcon />}
                sx={{ py: 2, fontWeight: 600, fontSize: 18, borderRadius: 2, bgcolor: 'primary.100', color: 'primary.800', '&:hover': { bgcolor: 'primary.200' } }}
                onClick={() => router.push('/customer')}
              >
                Customer
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ py: 2, fontWeight: 600, fontSize: 18, borderRadius: 2, borderWidth: 2 }}
                onClick={() => router.push('/admin')}
              >
                Admin
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
} 