import React from "react";
import { useNavigate } from "react-router";
import { proposals } from "../api/data";
import { ProposalStep1 } from "../presentation/proposal/ProposalStep1";
import { ProposalStep2 } from "../presentation/proposal/ProposalStep2";
import { ProposalStep3 } from "../presentation/proposal/ProposalStep3";
import { ProposalStep4 } from "../presentation/proposal/ProposalStep4";
import { MobileStepper } from "../presentation/stepper/MobileStepper";

export const NewCollaborationProposal = () => {
  const nav = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const [data, setData] = React.useState({
    title: "",
    creativeGuidance: "",
    name: "",
    image: undefined,
    values: [],
    categories: [],
  });

  const changeHandler = (event) => {
    setData((currentState) => {
      return { ...currentState, [event.target.name]: event.target.value };
    });
  };

  const handleListChange = (event, key) => {
    setData((currentState) => {
      const items = currentState[key];
      if (items.includes(event)) {
        var filtered = items.filter(function (value) {
          return value !== event;
        });
        return {
          ...currentState,
          [key]: filtered,
        };
      }
      return {
        ...currentState,
        [key]: items.concat(event),
      };
    });
  };

  const steps = [
    {
      label: "Collaboration Details",
      child: <ProposalStep1 data={data} handleChange={changeHandler} />,
    },
    {
      label: "Product Details",
      child: (
        <ProposalStep2 data={data} handleChange={changeHandler} id="image" />
      ),
    },
    {
      label: "Categories",
      child: <ProposalStep3 data={data} handleChange={handleListChange} />,
    },
    {
      label: "Values",
      child: <ProposalStep4 data={data} handleChange={handleListChange} />,
    },
  ];

  const step = () => {
    return steps[activeStep];
  };

  return (
    <MobileStepper
      step={step}
      maxSteps={4}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      executeFinal={() => {
        proposals.push(data);
        nav("/dashboard");
      }}
    />
  );
};
