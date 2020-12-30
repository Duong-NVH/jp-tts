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
import lamejs from "lamejs";

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
      const API = `https://cors-anywhere.herokuapp.com/us-central1-spontane.cloudfunctions.net/txttospeech?text=${text}&languageCode=ja-JP&voiceCode=ja-JP-Standard-A`;
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
  const onDownload = () => {
    const channels = 2; //1 for mono or 2 for stereo
    const sampleRate = 44100; //44.1khz (normal mp3 samplerate)
    const kbps = 128; //encode 128kbps mp3
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
    let mp3Data = [];
    const sampleBlockSize = 1152;

    const data = new Int16Array(Int16Array.from(audioBuffer));

    for (var i = 0; i < data.length; i += sampleBlockSize) {
      let leftChunk = data.subarray(i, i + sampleBlockSize);
      let rightChunk = data.subarray(i, i + sampleBlockSize);
      var mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
    mp3buf = mp3encoder.flush(); //finish writing mp3

    if (mp3buf.length > 0) {
      mp3Data.push(new Int8Array(mp3buf));
    }
    let blob = new Blob(mp3Data, { type: "audio/mp3" });
    let url = window.URL.createObjectURL(blob);
    let tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", "audio.mp3");
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
            {"Get mp3"}
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
