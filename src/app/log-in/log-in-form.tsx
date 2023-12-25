import { TextField, Divider,  Button,  Typography,  Paper,  Box,  InputAdornment,  Snackbar,  Alert,} from "@mui/material";
import { buttonBlack, buttonOffDark } from "@/muistyle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormEventHandler } from "react";

interface FormType {
  handleSubmit: FormEventHandler<HTMLFormElement>,
  email: string,
  password: string,
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
}

export default function LogInForm({ handleSubmit, email, password, setEmail, setPassword } : FormType): JSX.Element {
  return (
    <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
  >
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
      Log In
    </Button>
  </Box>
  )
}