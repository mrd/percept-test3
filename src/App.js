import "./App.css";
import { useEffect, useState } from "react";
import {
  useNavigate, redirect, useLoaderData
} from "react-router-dom";
import { FormLabel, FormControl, FormControlLabel, TextField, RadioGroup, Radio, Grid, Paper, Button, styled } from "@mui/material";
import React from "react";

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

  return <form onSubmit={handleSubmit}>
    <h1>About</h1>
    <p> This project gathers data about your perceptions of different street scenes... </p>
    <Grid container>
      <Grid item xs={4}>
        <label htmlFor="age">Age</label>
      </Grid>
      <Grid item xs={8}>
        <input id="age" name="age" type="text"/>
      </Grid>
      <Grid item xs={4}>
        <label htmlFor="income">Monthly Gross Income</label>
      </Grid>
      <Grid item xs={8}>
        <select id="income" name="income">
          <option value="0-20k">0-20k</option>
          <option value="20k-40k">20k-40k</option>
          <option value="40k-60k">40k-60k</option>
          <option value="60k-80k">60k-80k</option>
          <option value="80k-100k">80k-100k</option>
          <option value="100k+">100k+</option>
        </select>
      </Grid>
      <Grid item xs={4}>
        <label htmlFor="education">Education Level</label>
      </Grid>
      <Grid item xs={8}>
        <select id="education" name="education">
          <option value="no university">No University</option>
          <option value="in university">In University</option>
          <option value="bachelors">Bachelor's or equivalent</option>
          <option value="postgraduate">Postgraduate or Professional</option>
        </select>
      </Grid>
      <Grid item xs={4}>
        <FormLabel id="gender-group-label" htmlFor="gender-radio-group">Gender: how do you identify?</FormLabel>
      </Grid>
      <Grid item xs={8}>
        <FormControl>
          <RadioGroup name="gender-radio-group">
            <FormControlLabel value="woman" control={<Radio/>} label="Woman"/>
            <FormControlLabel value="non-binary" control={<Radio/>} label="Non-binary"/>
            <FormControlLabel value="man" control={<Radio/>} label="Man"/>
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
        <label htmlFor="postalcode">Postal code</label>
      </Grid>
      <Grid item xs={8}>
        <input id="postalcode" name="postalcode" type="text" />
      </Grid>
      <Grid item xs={4}>
        <label htmlFor="consent">
          Consent for data collection:
        </label>
        <input id="consent" name="consent" type="checkbox" />
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

  function refresh() {
    const imgs = randompick(amsImgs, 4);
    setCurView({
      thingToRate: randompick(thingsToRate)[0],
      image: imgs[0],
      impressions: imgs.slice(1, 4)
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
      <p>{userInfo.age}, {userInfo.income}, {userInfo.education}, {userInfo.postalcode}, {userInfo.consent ? "consented" : "oops"}</p>
    </Grid>
  </Grid>
  </>
  );
}