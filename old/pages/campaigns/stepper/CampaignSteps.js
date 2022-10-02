import {
  Alert,
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import { Fragment, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getCampaign,
  newCampaignChain,
  updateCampaign,
} from "../../../api/api";
import {
  imageError,
  processing,
  validationError,
} from "../../../components/Alerts";
import { StepperFrame } from "../../../components/StepperFrame";
import isValidUUID from "../../../components/uuidUtils";
import { TopActions } from "../../../components/v2/TopActions";
import { BadUrl } from "../../BadUrl";
import { CampaignFrame } from "./CampaignFrame";
import { ObjectivesFrame } from "./ObjectivesFrame";
import { ProductFrame } from "./ProductFrame";
import isFormDataValid from "./validationRules";

const steps = ["Objective", "Campaign", "Product"];

export function CampaignSteps() {
  const [loading, setLoading] = useState(true);
  // new campaign is made up of multiple steps, this keeps track of which step
  const [activeStep, setActiveStep] = useState(0);
  // show or hide alert
  const [showAlert, setShowAlert] = useState(null);
  // handle next button [validate before proceeding to next] or calling api
  const { id } = useParams();
  const validId = isValidUUID(id);
  // form data, can be filled for testing purposes via localstorage
  const [data, setData] = useState(fill(id, validId));

  const isXSmall = useMediaQuery("(max-width:560px)");
  const isSmall = useMediaQuery("(max-width:625px)");

  useEffect(() => {
    //TODO handle error
    id &&
      getCampaign(id).then((campaign) => {
        setData(campaign);
        setLoading(false);
      });
    setLoading(false);
  }, [id]);

  const nav = useNavigate();

  if (id && !validId) {
    return <BadUrl />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  function buttonLabel() {
    if (isSmall) return "New Campaign";
    return "Create New Campaign";
  }
  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TopActions>
          <Button
            variant="contained"
            onClick={() => nav("new")}
            sx={{
              bottom: isXSmall ? 3 : -3,
              top: isXSmall ? 3 : -3,
            }}
          >
            {buttonLabel()}
          </Button>
        </TopActions>
      </Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <StepperFrame
        handleBack={handleBack}
        handleNext={handleNext}
        numberOfSteps={steps.length}
        activeStep={activeStep}
      >
        {selectStepComponent()}
      </StepperFrame>
      <Alert
        sx={{
          justifyContent: "center",
          display: showAlert ? "flex" : "none",
        }}
        severity={showAlert?.severtity}
      >
        {showAlert?.message}
      </Alert>
    </Fragment>
  );

  function tooLargeAlert() {
    setShowAlert(imageError);
    setTimeout(() => {
      setShowAlert();
    }, 1000 * 2);
  }

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
        step = (
          <ProductFrame
            data={data}
            handleChange={onChangeField}
            tooLargeAlert={tooLargeAlert}
          />
        );
        break;
    }
    return step;
  }

  function fill(id, validId) {
    const testData = localStorage.getItem("campaign");

    if ((id && validId) || !testData) {
      const data = {
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
        productImageUpdate: [],
        productImage1: "",
        productImage2: "",
        productImage3: "",
      };
      if (id && validId) {
        data.productImageUpdate = [];
      }
      return data;
    }
    return JSON.parse(testData);
  }

  function handleNext() {
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
      if (id) {
        updateCampaign(data).then((campaign) => {
          nav("/campaigns/" + campaign.id);
        });
      } else {
        newCampaignChain(data).then((campaign) => {
          nav("/campaigns/" + campaign.id);
        });
      }
    }
  }

  function handleBack() {
    setShowAlert(null);
    if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      return;
    }
  }

  function onChangeField(e) {
    setData((currentState) => {
      return { ...currentState, [e.target.name]: e.target.value };
    });
  }
}