import { TextField,Divider, Button, Typography, Paper, Box, InputAdornment} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { buttonBlack, buttonOffDark } from '@/muistyle';
import { FormEventHandler } from "react";

interface FormType {
  handleSubmit: FormEventHandler<HTMLFormElement>,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setFirstName: (val: string) => void;
  setLastName: (val: string) => void;
}

export default function SignUpForm({ handleSubmit, email, password, firstName, lastName, setEmail, setPassword, setFirstName, setLastName } : FormType): JSX.Element {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <TextField
      label="Email"
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MailOutlineIcon />
          </InputAdornment>
        ),
      }}
      data-testid='email'
    />
    <TextField
      label="Password"
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlinedIcon />
          </InputAdornment>
        ),
      }}
      data-testid='password'
    />
    <TextField
      label="First Name"
      type="text"
      placeholder="Enter your first name"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonOutlineIcon />
          </InputAdornment>
        ),
      }}
      data-testid='firstName'
    />
    <TextField
      label="Last Name"
      type="text"
      placeholder="Enter your last name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonOutlineIcon />
          </InputAdornment>
        ),
      }}
      data-testid='lastName'
    />
    <Button
      type="submit"
      variant="contained"
      sx={{
        ...buttonOffDark,
        textTransform: "none",
        width: "100%",
        height: "56px",
        borderRadius: "4px", 
        fontSize: '18px'
      }}
      data-testid='button'
    >
      Sign Up
    </Button>
  </Box>
  )
}