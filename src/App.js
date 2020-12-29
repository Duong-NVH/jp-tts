import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import axios from "axios";

const API = "https://us-central1-spontane.cloudfunctions.net/txttospeech";
const DEFAULT_PARAMS = {
  languageCode: "ja-JP",
  voiceCode: "ja-JP-Standard-A",
};

const App = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const onChangeText = (e) => {
    setText(e.target.value);
  };
  const onRequest = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(API, {
        ...DEFAULT_PARAMS,
        value: text,
      });
      if (res.audioContent.data) {
        alert(1);
      } else {
        alert(res);
      }
    } catch (error) {
      alert(error);
    }
    setIsLoading(false);
  };

  return (
    <Box className={classes.app}>
      <Typography variant="h1">
        JP-TTS V1 <VolumeUpIcon style={{ fontSize: 60 }} />
      </Typography>
      <Container maxWidth="sm" className={classes.content}>
        <TextField
          id="standard-multiline-flexible"
          label="Enter text"
          multiline
          variant="outlined"
          rows={8}
          value={text}
          onChange={onChangeText}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isLoading ? (
              <CircularProgress color="secondary" size={20} />
            ) : (
              <SendIcon />
            )
          }
          size="large"
          onClick={onRequest}
          disabled={isLoading}
        >
          {isLoading ? "Processing" : "Convert to speech"}
        </Button>
      </Container>
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
    height: 250,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
});
export default App;
