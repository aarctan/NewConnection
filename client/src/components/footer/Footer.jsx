import { IconButton, Link, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import GitHubIcon from "@mui/icons-material/GitHub";

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: 0,
    textAlign: "center",
  },
  iconButton: {
    padding: "4px",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <IconButton
        aria-label="github-link"
        className={classes.iconButton}
        href="https://github.com/Exanut/NewConnection"
      >
        <GitHubIcon fontSize="large" />
      </IconButton>
      <Typography variant="body2" align="center">
        {" "}
        <Link
          component="button"
          variant="body2"
          underline="hover"
          onClick={() => {
            window.open("https://www.youtube.com/watch?v=vxiC2ZZK03w");
          }}
        >
          Promo video
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;
