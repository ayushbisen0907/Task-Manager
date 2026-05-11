import { Box, Button, Stack, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "radial-gradient(at 80% 0%, rgba(99,102,241,0.10) 0%, transparent 50%), radial-gradient(at 0% 100%, rgba(236,72,153,0.08) 0%, transparent 50%)",
      }}
    >
      <Stack alignItems="center" spacing={2} sx={{ textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "8rem" },
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Page not found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 400 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeRoundedIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 1 }}
        >
          Back to home
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFoundPage;
