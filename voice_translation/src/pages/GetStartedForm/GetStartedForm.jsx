import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // or 'next/router' if using Next.js
import { Bot, Check } from 'lucide-react';
import { FaGoogle, FaGithub, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';

import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Box
} from '@mui/material';

import './GetStartedForm.css';

export default function GetStartedForm() {
  const navigate = useNavigate(); // or useRouter() if using Next.js
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ name, email, preferredLanguage }));
      navigate('/'); // or router.push('/')
    } catch (err) {
      console.error(err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!name || !email || !password)) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="form-card">
        <CardHeader
          title={
            <div className="form-header">
              <Bot size={40} className="icon-purple" />
              <Typography variant="h5" color="white">Create your account</Typography>
              <Typography variant="body2" className="text-muted">Get started with TranslateAI for free</Typography>
              <div className="step-indicator">
                {[1, 2, 3].map((s) => (
                  <span key={s} className={`dot ${step >= s ? 'active' : ''}`}></span>
                ))}
              </div>
            </div>
          }
        />
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}

          {step === 1 && (
            <>
              <Box display="flex" justifyContent="space-between" gap={1} mb={2}>
                <Button fullWidth variant="outlined" startIcon={<FaGoogle />}>Google</Button>
                <Button fullWidth variant="outlined" startIcon={<FaGithub />}>GitHub</Button>
                <Button fullWidth variant="outlined" startIcon={<FaApple />}>Apple</Button>
              </Box>
              <Typography variant="body2" className="text-muted" align="center" gutterBottom>
                — Or continue with —
              </Typography>
              <form>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="dense"
                  variant="filled"
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  fullWidth
                  margin="dense"
                  variant="filled"
                />
                <TextField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  fullWidth
                  margin="dense"
                  variant="filled"
                />
                <Button onClick={nextStep} variant="contained" fullWidth sx={{ mt: 2 }} color="primary">
                  Continue
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <FormControl fullWidth margin="dense" variant="filled">
                <InputLabel>Preferred Language</InputLabel>
                <Select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" className="text-muted" sx={{ mt: 2 }}>
                Features You're Interested In
              </Typography>
              <Box mt={1}>
                {['Voice Translation', 'Text Translation', 'Document Translation'].map((feature) => (
                  <Box key={feature} display="flex" alignItems="center" mb={1}>
                    <Check size={16} className="icon-purple" />
                    <Typography sx={{ ml: 1 }} className="text-light">{feature}</Typography>
                  </Box>
                ))}
              </Box>

              <Box display="flex" gap={1} mt={2}>
                <Button onClick={prevStep} variant="outlined" fullWidth>Back</Button>
                <Button onClick={nextStep} variant="contained" fullWidth color="primary">Continue</Button>
              </Box>
            </>
          )}

          {step === 3 && (
            <>
              <Box textAlign="center">
                <Box className="icon-circle">
                  <Check size={32} className="icon-purple" />
                </Box>
                <Typography variant="h6" color="white">Almost there!</Typography>
                <Typography className="text-muted">
                  You're just one click away from breaking language barriers with TranslateAI.
                </Typography>
              </Box>
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between">
                  <span className="text-muted">Name:</span>
                  <span className="text-white">{name}</span>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <span className="text-muted">Email:</span>
                  <span className="text-white">{email}</span>
                </Box>
                {preferredLanguage && (
                  <Box display="flex" justifyContent="space-between">
                    <span className="text-muted">Preferred Language:</span>
                    <span className="text-white">
                      {LANGUAGES.find((lang) => lang.code === preferredLanguage)?.name || preferredLanguage}
                    </span>
                  </Box>
                )}
              </Box>
              <Box display="flex" gap={1} mt={2}>
                <Button onClick={prevStep} variant="outlined" fullWidth>Back</Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" className="text-muted">
            Already have an account?{' '}
            <a href="/sign-in" className="text-link">Sign in</a>
          </Typography>
        </CardActions>
      </Card>
    </motion.div>
  );
}

const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: "ru-RU", name: "Russian" },
  { code: "pt-BR", name: "Portuguese" },
  { code: "ar-SA", name: "Arabic" },
  { code: "hi-IN", name: "Hindi" },
  { code: "gu-IN", name: "Gujarati"}
];
