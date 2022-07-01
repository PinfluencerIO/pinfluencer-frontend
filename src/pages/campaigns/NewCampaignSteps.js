import { Alert, Box, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { newCampaignChain } from "../../api/api";
import { processing, validationError } from "../../components/Alerts";
import { StepperFrame } from "../../components/StepperFrame";
import { CampaignFrame } from "./CampaignFrame";
import { ObjectivesFrame } from "./ObjectivesFrame";
import { ProductFrame } from "./ProductFrame";
import isFormDataValid from "./validationRules";

export function NewCampaignSteps() {
  const nav = useNavigate();

  const steps = ["Objective", "Campaign", "Product"];
  // form data, can be filled for testing purposes via localstorage
  const [data, setData] = useState(fill());
  const onChangeField = (e) => {
    // console.log(e.target.name);
    // console.log(e.target.value);
    setData((currentState) => {
      return { ...currentState, [e.target.name]: e.target.value };
    });
  };

  // onboarding is made up of multiple steps, this keeps track of which step
  const [activeStep, setActiveStep] = useState(0);
  // show or hide alert
  const [showAlert, setShowAlert] = useState(null);
  // handle next button [validate before proceeding to next] or calling api
  const handleNext = () => {
    if (!isFormDataValid(data, activeStep)) {
      setShowAlert(validationError);
      return;
    }
    setShowAlert(null);
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    } else {
      setShowAlert(processing);
      newCampaignChain(data).then((campaign) => {
        console.log(campaign);
        nav("/campaigns/" + campaign.id);
      });
    }
  };
  const handleBack = () => {
    setShowAlert(null);
    if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      return;
    }
  };
  return (
    <Box
      spacing={0}
      sx={{
        backgroundColor: "background.pinfluencerLightGreen",
        borderTop: 1,
        borderBottom: 1,
      }}
    >
      <button className="css-9oggol-MuiButtonBase-root-MuiButton-root">
        my button
      </button>
      <Box sx={{ marginTop: "25px" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box>
        <StepperFrame
          handleBack={handleBack}
          handleNext={handleNext}
          numberOfSteps={steps.length}
          activeStep={activeStep}
        >
          {selectStepComponent()}
        </StepperFrame>
      </Box>
      <Alert
        sx={{
          justifyContent: "center",
          display: showAlert ? "flex" : "none",
        }}
        severity={showAlert?.severtity}
      >
        {showAlert?.message}
      </Alert>
    </Box>
  );
  function selectStepComponent() {
    let step;
    switch (activeStep) {
      case 0:
        step = <ObjectivesFrame data={data} handleChange={onChangeField} />;
        break;
      case 1:
        step = <CampaignFrame data={data} handleChange={onChangeField} />;
        break;
      case 2:
        step = <ProductFrame data={data} handleChange={onChangeField} />;
        break;
    }
    return step;
  }

  function fill() {
    const testData = localStorage.getItem("campaign");
    if (testData) {
      return JSON.parse(testData);
    }

    return {
      objective: "",
      successDescription: "",
      campaignTitle: "",
      campaignDescription: "",
      campaignCategories: [],
      campaignValues: [],
      campaignProductLink: "",
      campaignDiscountCode: "",
      campaignHashtag: "",
      productTitle: "",
      productDescription: "",
      productImage1: "",
      productImage2: "",
      productImage3: "",
    };
  }
}