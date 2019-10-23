import React from "react";

import Image from "../../../../assets/images/FirstPage/apple.ico";
import classes from "./Apple.module.css";

/**
 * "Download on the App Store" Logo
 * 
 * Takes local css module and overwrites it with what is passed into apple
 */
const apple = (props) => (
  <img src={Image} alt='apple logo' className={`${props.className} ${classes.Asset}`}/>
);

export default apple;
