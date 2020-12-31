import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import Convert from "./components/Convert";
import ProjectManager from "./components/ProjectManager";
const App = () => {
  const classes = useStyles();

  return (
    <Box className={classes.app}>
      <Typography variant="h1">
        JP-TTS V1 <VolumeUpIcon style={{ fontSize: 60 }} />
      </Typography>
      <Box className={classes.content}>
        <Convert />
        <ProjectManager />
      </Box>
    </Box>
  );
};
const useStyles = makeStyles({
  app: {
    height: "100%",
    textAlign: "center",
    "&>:first-child": {
      margin: 20,
    },
  },
  content: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
});
export default App;
