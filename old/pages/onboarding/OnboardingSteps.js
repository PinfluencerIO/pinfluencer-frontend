import { Step, StepLabel, Stepper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserContext from "../../context/UserContext";
import { AboutYou } from "./AboutYou";
import { BrandDetails } from "./BrandDetails";
import { Categories } from "./Categories";
import { TypeOfUser } from "./TypeOfUser";
import { Values } from "./Values";
import { onboardingChain } from "../../api/api";
import validation from "./validationRules";
import {
  backendIssue,
  processing,
  validationError,
} from "../../components/Alerts";
import { StepperFrame } from "../../components/StepperFrame";
import { InfluenerDetails } from "./InfluencerDetails";
const steps = ["About You", "Type", "Details", "Categories", "Values"];

export const OnboardingSteps = () => {
  // authenticated user state
  const { user, onboard } = useContext(UserContext);

  // form data, can be filled for testing purposes via localstorage
  const [data, setData] = useState(fill());

  // onboarding is made up of multiple steps, this keeps track of which step
  const [activeStep, setActiveStep] = useState(0);

  // show or hide alert
  const [showAlert, setShowAlert] = useState(null);

  // only authenticated users that haven't onboarded can see this page
  const nav = useNavigate();
  useEffect(() => {
    if (user == null || (user && "custom:usertype" in user)) {
      nav("/");
    }
  }, [user, nav]);

  // handle next button [validate before proceeding to next] or calling api
  const handleNext = () => {
    let valid = validation(data, activeStep);

    if (typeof valid === "boolean" && valid == false) {
      setShowAlert(validationError);
      return;
    }
    if (typeof valid == "object" && valid.result === false) {
      setShowAlert({
        severtity: "error",
        message: valid.message,
      });
      return;
    }
    setShowAlert(null);
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    }
    setShowAlert(processing);

    onboardingChain(data)
      .then(() => {
        onboard().then(() => {
          setShowAlert(null);
          nav("/dashboard");
        });
      })
      .catch((err) => {
        setShowAlert(backendIssue);
        console.error("An error happened calling api", err);
      });
  };

  const handleBack = () => {
    setShowAlert(null);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onChangeField = (e) => {
    // get name and value from target or data attributes
    let name;
    if (e.currentTarget.dataset && e.currentTarget.dataset.name) {
      name = e.currentTarget.dataset.name;
    } else if (e.target.dataset && e.target.dataset.name) {
      name = e.target.dataset.name;
    } else {
      name = e.target.name;
    }

    let value;
    if (e.currentTarget.dataset && e.currentTarget.dataset.value) {
      value = e.currentTarget.dataset.value;
    } else if (e.target.dataset && e.target.dataset.value) {
      value = e.target.dataset.value;
    } else {
      value = e.target.value;
    }

    // checkbox value comes from target.checked attribute
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    // handle nested types [brand | influencer] assignments, and return
    // look at data object for more info. brand and influener are nested
    if (name.includes(".")) {
      const keys = name.split(".");
      setData((currentState) => {
        return {
          ...currentState,
          [keys[0]]: {
            ...currentState[keys[0]],
            [keys[1]]: value,
          },
        };
      });
      return;
    }
    // non-nested assignments
    setData((currentState) => {
      return { ...currentState, [name]: value };
    });
  };

  return (
    <React.Fragment>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <StepperFrame
        numberOfSteps={steps.length}
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleNext}
        showAlert={showAlert}
      >
        {selectStepComponent()}
      </StepperFrame>
    </React.Fragment>
  );

  function selectStepComponent() {
    let step;
    switch (activeStep) {
      case 0:
        step = <AboutYou data={data} handleChange={onChangeField} />;
        break;
      case 1:
        step = <TypeOfUser data={data} handleChange={onChangeField} />;
        break;
      case 2:
        if (data.type === "brand") {
          step = <BrandDetails data={data} handleChange={onChangeField} />;
          break;
        }
        if (data.type === "influencer") {
          step = <InfluenerDetails data={data} handleChange={onChangeField} />;
          break;
        }
        step = <div>Failed to select type...go back one step</div>;
        break;
      case 3:
        step = <Categories data={data} handleChange={onChangeField} />;
        break;
      case 4:
        step = <Values data={data} handleChange={onChangeField} />;
        break;
    }
    return step;
  }

  // testing can use this function to complete the onboarding steps
  function fill() {
    const fill = localStorage.getItem("fill");
    if (fill) {
      return JSON.parse(fill);
    }

    // nested brand and influencer are dropped from api
    // payload depending on what type of user onboards
    // the data associated with the user type is moved
    // from nest into root before POSTing to api
    return {
      email: "",
      firstName: "",
      lastName: "",
      type: "",
      privacy: false,
      instaHandle: "",
      website: "",
      brand: {
        brandName: "",
        brandDescription: "",
        brandLogo: "",
        brandHeader: "",
      },
      influencer: {
        bio: "",
        address: "",
        audienceAge13To17Split: 0,
        audienceAge18To24Split: 0,
        audienceAge25To34Split: 0,
        audienceAge35To44Split: 0,
        audienceAge45To54Split: 0,
        audienceAge55To64Split: 0,
        audienceAge65PlusSplit: 0,
        audienceFemaleSplit: 0,
        audienceMaleSplit: 0,
      },
      categories: [],
      values: [],
    };
  }
};