import chooseYourBank from "../assets/choose-your-bank.png";
import reviewDetails from "../assets/review-details-payment.png";
import login from "../assets/login.png";
import sca from "../assets/sca.png";
import approvePayment from "../assets/approve-payment.png";
import bankApp from "../assets/bank-app.png";
import { AUTH_FLOWS, AUTH_STEPS } from "../lib/constants";

export const Funnel = ({ product, items }) => {
  const redirect = items.filter(({ flow }) => flow === AUTH_FLOWS.REDIRECT);
  const embedded = items.filter(({ flow }) => flow === AUTH_FLOWS.EMBEDDED);

  const count = (items, step) =>
    items.filter(({ steps }) => steps.includes(step)).length;

  const totalCreated = count(items, AUTH_STEPS.CREATED);

  const pct = (count) =>
    `(${totalCreated > 0 ? Math.floor((count / totalCreated) * 100) : 0}%)`;

  const Step = ({ items, step, computedStepCount, label }) => {
    const stepCount = computedStepCount || count(items, step);

    return (
      <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm self-center">
        {label}: {stepCount} {pct(stepCount)}
      </div>
    );
  };

  const StepPicture = ({ src }) => (
    <img src={src} className="self-center max h-28" />
  );

  const Steps = ({ children }) => (
    <div className="flex flex-row gap-3">{children}</div>
  );

  const showEmbedded = embedded.length > 0;
  const showRedirect = redirect.length > 0;
  const showTotal =
    (showEmbedded && showRedirect) || (!showEmbedded && !showRedirect);

  return (
    <div className="flex flex-row gap-3">
      <Steps>
        <Step
          computedStepCount={totalCreated}
          label={`Total Hosted ${product} requests created`}
        />
        <StepPicture src={chooseYourBank} />
        <StepPicture src={reviewDetails} />
      </Steps>

      <div className="flex flex-col gap-3">
        {showRedirect && (
          <Steps>
            <Step
              items={redirect}
              step={AUTH_STEPS.INSTITUTION_SUBMITTED}
              label="Redirect institutions submitted"
            />
            <StepPicture src={approvePayment} />
            <Step
              items={redirect}
              step={AUTH_STEPS.AUTHORISATION_INITIATED}
              label="Redirect authorisations created"
            />
            <StepPicture src={bankApp} />
            <Step
              items={redirect}
              step={AUTH_STEPS.EXECUTED}
              label={`Redirect ${product}s executed`}
            />
          </Steps>
        )}

        {showEmbedded && (
          <Steps>
            <Step
              items={embedded}
              step={AUTH_STEPS.INSTITUTION_SUBMITTED}
              label="Embedded institutions submitted"
            />
            <StepPicture src={login} />
            <Step
              items={embedded}
              step={AUTH_STEPS.AUTHORISATION_INITIATED}
              label="Embedded authorisations created"
            />
            <StepPicture src={sca} />
            <Step
              items={embedded}
              step={AUTH_STEPS.AUTHORISATION_UPDATED}
              label="Embedded SCA methods selected"
            />
          </Steps>
        )}

        {showTotal && (
          <Steps>
            <Step
              items={items}
              step={AUTH_STEPS.INSTITUTION_SUBMITTED}
              label="Total institutions submitted"
            />
            <Step
              items={items}
              step={AUTH_STEPS.AUTHORISATION_INITIATED}
              label="Total authorisations created"
            />
            <Step
              computedStepCount={
                count(redirect, AUTH_STEPS.EXECUTED) +
                count(embedded, AUTH_STEPS.AUTHORISATION_UPDATED)
              }
              label={`Total embedded SCA methods selected + Total redirect ${product}s executed`}
            />
          </Steps>
        )}
      </div>
    </div>
  );
};
