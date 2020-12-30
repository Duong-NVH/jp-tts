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
import GetAppIcon from "@material-ui/icons/GetApp";
import MicIcon from "@material-ui/icons/Mic";
import axios from "axios";
import toWav from "audiobuffer-to-wav";

const App = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState();
  const classes = useStyles();
  const onChangeText = (e) => {
    if (audioBuffer) {
      setAudioBuffer(null);
    }
    setText(e.target.value);
  };
  const onRequest = async () => {
    if (text.length > 0) {
      const API = `https://us-central1-spontane.cloudfunctions.net/txttospeech?text=${text}&languageCode=ja-JP&voiceCode=ja-JP-Standard-A`;
      setIsLoading(true);
      try {
        const res = await axios.post(API);
        if (res.data.audioContent.data) {
          setAudioBuffer(res.data.audioContent.data);
        } else {
          alert("?");
        }
      } catch (error) {
        alert(error);
      }
      setIsLoading(false);
    }
  };
  const onPlay = async () => {
    const ctx = new AudioContext();
    const data = new Int8Array(Int8Array.from(audioBuffer));
    const audio = await ctx.decodeAudioData(data.buffer);
    const playSound = ctx.createBufferSource();
    playSound.buffer = audio;
    playSound.connect(ctx.destination);
    playSound.start(ctx.currentTime);
  };
  const onDownload = async () => {
    const data = new Int8Array(Int8Array.from(audioBuffer));
    const ctx = new AudioContext();
    const audio = await ctx.decodeAudioData(data.buffer);
    var wav = toWav(audio);
    let blob = new Blob([new DataView(wav)], {
      type: "audio/wav",
    });
    let url = window.URL.createObjectURL(blob);
    let tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", "audio.wav");
    tempLink.click();
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
      {audioBuffer && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<GetAppIcon />}
            onClick={onDownload}
          >
            {"Get audio"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<MicIcon />}
            onClick={onPlay}
          >
            {"Play"}
          </Button>
        </Box>
      )}
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
    "&>:nth-child(3)": {
      margin: 20,
      "&>*": {
        margin: "0 5px 0px 5px",
      },
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
