import "./App.css";
import { useEffect, useState } from "react";
import {
  useNavigate, redirect, useLoaderData
} from "react-router-dom";
import { FormLabel, FormControl, FormControlLabel, FormGroup, TextField, RadioGroup, Radio, Grid, Paper, Button, styled, Checkbox } from "@mui/material";
import React from "react";
import { backendFetchURL } from "./config.js";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

// hack to workaround the fact that react-router-dom doesn't support access to
// Location state inside loaders
export const globalInfo = { age: "", consent: false };

export function Index() {
  const [preferChecked, setPreferChecked] = useState(false);
  const [preferredGender, setPreferredGender] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    globalInfo.debug = value;
    globalInfo.age = value.age;
    globalInfo.consent = value.consent === "on";
    globalInfo.postalcode = value.postalcode;
    globalInfo.education = value.education;
    globalInfo.income = value.income;
    globalInfo.gender = value['gender-radio-group'] === "other" ? preferredGender : value['gender-radio-group'];

    navigate("/eval", { replace: true, state: value }	);
  }

  const currency='€';
  const radioGroupStyle = {border: 1, marginTop: "5px", marginBottom: "5px", padding: "5px"};
  return <form onSubmit={handleSubmit}>
    <h1>About</h1>
    <p> This project gathers data about your perceptions of different street scenes... </p>
    <Grid container alignItems="center">
      <Grid item xs={4}>
        <FormLabel id="age-label" htmlFor="age">Age</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <TextField name="age" id="age" label="Age" />
      </Grid>
      <Grid item xs={4}>
        <FormLabel id="income-group-label" htmlFor="income">Monthly Gross Income</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <FormControl>
          <RadioGroup sx={radioGroupStyle} name="income">
            <FormControlLabel value="0-1499" control={<Radio/>} label={currency+"0-1499"}/>
            <FormControlLabel value="1500-2999" control={<Radio/>} label={currency+"1500-2999"}/>
            <FormControlLabel value="3000-4499" control={<Radio/>} label={currency+"3000-4499"}/>
            <FormControlLabel value="4500+" control={<Radio/>} label={currency+"4500+"}/>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormLabel id="education-group-label" htmlFor="education">Education Level</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <FormControl>
          <RadioGroup sx={radioGroupStyle} name="education">
            <FormControlLabel value="no university" control={<Radio/>} label="No University"/>
            <FormControlLabel value="in university" control={<Radio/>} label="In University now"/>
            <FormControlLabel value="bachelors" control={<Radio/>} label="Bachelor's or equivalent"/>
            <FormControlLabel value="postgraduate" control={<Radio/>} label="Postgraduate or Professional"/>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormLabel id="gender-group-label" htmlFor="gender-radio-group">Gender: how do you identify?</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <FormControl>
          <RadioGroup sx={radioGroupStyle} name="gender-radio-group">
            <FormControlLabel value="woman" control={<Radio/>} label="Woman" onClick={() => setPreferChecked(false)} />
            <FormControlLabel value="non-binary" control={<Radio/>} label="Non-binary" onClick={() => setPreferChecked(false)} />
            <FormControlLabel value="man" control={<Radio/>} label="Man" onClick={() => setPreferChecked(false)} />
            <FormControlLabel control={<Radio checked={preferChecked}
                                              onClick={() => setPreferChecked(!preferChecked)} value="other"
                                              label="Prefer to self-describe"/>}
                              label={
                                  preferChecked ? (
                                    <TextField disabled={!preferChecked} label="Please Specify" onKeyDown={
                                        (e) => setPreferredGender(e.target.value)
                                      }
                                    />
                                  ) : "Prefer to self-describe"
                              }
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormLabel id="postalcode-label" htmlFor="postalcode">Postal code</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <FormControl>
          <TextField id="postalcode" name="postalcode" label="Postal Code" />
        </FormControl>
      </Grid>
      <Grid item xs={4}>
          <FormLabel id="consent-label" htmlFor="consent">Consent for data collection?</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <FormGroup>
          <FormControlLabel control={<Checkbox name="consent"/>} label="Yes, I consent to data collection for this research"/>
        </FormGroup>
      </Grid>
      <Grid item xs={8}>
        <input type="submit" value="Submit" />
      </Grid>
    </Grid>
    </form>
}

export async function evalLoader(globalInfo) {
  if (!globalInfo.consent) {
    return redirect("/");
  } else {
    return globalInfo;
  }
}

const gridStyles = {
  border: 0,
  backgroundColor: "white",
  paddingBottom: 2,
  paddingRight: 2,
  marginTop: 2,
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: 400
};

const impGridStyles = {
  border: "none",
  margin: 0,
  padding: 0,
  backgroundColor: "white",
  paddingBottom: 2,
  paddingRight: 2,
  marginTop: 2,
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: 400
};

const buttonDescs = [
  { smiley: "\u{1F626}", text: "worse" },
  { smiley: "\u{1F641}", text: "bad" },
  { smiley: "\u{1F610}", text: "neutral" },
  { smiley: "\u{1F642}", text: "good" },
  { smiley: "\u{1F603}", text: "better" }
];

const thingsToRate = [
  "walkability",
  "safety",
  "livability",
  "biking-friendliness",
  "sustainability"
];

const amsImgs = [
  "ams1.jpg",
  "ams2.jpg",
  "ams3.jpg",
  "ams4.jpg",
  "ams5.jpg",
  "ams6.jpg"
];

function randompick(arr, num = 1) {
  const idxs = [];
  var idx;
  num = num > arr.length ? arr.length : num;
  for (var i = 0; i < num; i++) {
    do {
      idx = Math.floor(Math.random() * arr.length);
    } while (idxs.includes(idx));
    idxs.push(idx);
  }
  return idxs.map((idx) => arr[idx]);
}


function Streetview({ name, centred, id }) {
  return <img
        id={id}
        src={name}
        style={{ display: "block", width: centred ? "320px" : "120px" }}
        width={centred ? "320" : "120"}
        height={centred ? "240" : "90"}
        alt="streetview"
      />
}
 
const PrefButton = styled(Button)({
  textTransform: "none"
});


export function Eval() {
  const userInfo = useLoaderData();
  const [showImpressions, setShowImpressions] = useState(true);
  const [curView, setCurView] = useState({
    thingToRate: null,
    image: null,
    impressions: null
  });

  async function refresh() {
    const response = await fetch(backendFetchURL);
    const json = await response.json();
    setCurView({
      thingToRate: randompick(thingsToRate)[0],
      image: json['main_image']['url'],
      impressions: json['impressions'].map((i) => i['url'])
    });
  }
  useEffect(() => {
    refresh();
  }, []); // run-once with empty deps array

  return (<>
  <Grid
    container
    style={gridStyles}
    justifyContent="center"
    alignItems="center"
  >
    <Grid
      item
      container
      xs={12}
      direction="column"
      spacing={0}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xl={4}>
        <h1>Rate {curView.thingToRate}:</h1>
      </Grid>
      <Grid item xl={4}>
        <Item>
          <Streetview centred="1" name={curView.image} />
        </Item>
      </Grid>
      <Grid item xl={4}>
        <Grid item container xs spacing={0}>
          {buttonDescs.map((bd) => {
            function handleClick() {
              refresh();
            }
            return (
              <Item style={{ width: "55px" }}>
                <PrefButton onClick={handleClick}>
                  {bd.smiley}
                  <br />
                  {bd.text}
                </PrefButton>
              </Item>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
    {(curView.impressions && showImpressions) ? (
      <>
        <Grid
          item
          xs={12}
          style={{ display: "flex" }}
          justifyContent="center"
        >
          <PrefButton onClick={() => setShowImpressions(false)}>
            <span>Other Amsterdam impressions</span>
          </PrefButton>
        </Grid>
        <Grid item container style={impGridStyles} xs={12} spacing={0}>
          {curView.impressions.map((img) => {
            return (
              <Grid item xs={4}>
                <Item>
                  <Streetview id="imp" name={img} />
                </Item>
              </Grid>
            );
          })}
        </Grid>
      </>
    ) : (
      <Grid
        item
        xs={12}
        style={{ display: "flex" }}
        justifyContent="center"
      >
        <PrefButton onClick={() => setShowImpressions(true)}>
          <span>Amsterdam</span>
        </PrefButton>
      </Grid>
    )}
    <Grid item xs={12}>
      <p><i>(debugging info about user)</i></p>
      <p>{userInfo.age}, {userInfo.income}, {userInfo.education}, {userInfo.gender}, {userInfo.postalcode}, {userInfo.consent ? "consented" : "oops"}</p>
    </Grid>
  </Grid>
  </>
  );
}