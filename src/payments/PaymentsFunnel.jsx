import chooseYourBank from "../assets/choose-your-bank.png";
import reviewDetails from "../assets/review-details-payment.png";
import login from "../assets/login.png";
import sca from "../assets/sca.png";
import approvePayment from "../assets/approve-payment.png";
import bankApp from "../assets/bank-app.png";
import { PAYMENT_FLOWS, PAYMENT_STEPS } from "../lib/payments";

export const PaymentsFunnel = ({ payments }) => {
  const redirectPayments = payments.filter(
    (payment) => payment.flow === PAYMENT_FLOWS.REDIRECT
  );
  const embeddedPayments = payments.filter(
    (payment) => payment.flow === PAYMENT_FLOWS.EMBEDDED
  );

  const count = (payments, step) => {
    console.log(payments);
    return payments.filter((payment) => payment.steps.includes(step)).length;
  };

  const totalCreated = count(payments, PAYMENT_STEPS.CREATED);

  const pct = (count) =>
    `(${totalCreated > 0 ? Math.floor((count / totalCreated) * 100) : 0}%)`;

  const Step = ({ payments, step, stepCountOverride, label }) => {
    const stepCount = stepCountOverride || count(payments, step);

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

  const showEmbedded = embeddedPayments.length > 0;
  const showRedirect = redirectPayments.length > 0;
  const showTotal =
    (showEmbedded && showRedirect) || (!showEmbedded && !showRedirect);

  return (
    <div className="flex flex-row gap-3">
      <Steps>
        <Step
          stepCountOverride={totalCreated}
          label="Total hosted payment requests created"
        />
        <StepPicture src={chooseYourBank} />
        <StepPicture src={reviewDetails} />
      </Steps>

      <div className="flex flex-col gap-3">
        {showRedirect && (
          <Steps>
            <Step
              payments={redirectPayments}
              step={PAYMENT_STEPS.INSTITUTION_SUBMITTED}
              label="Redirect institutions submitted"
            />
            <StepPicture src={approvePayment} />
            <Step
              payments={redirectPayments}
              step={PAYMENT_STEPS.AUTHORISATION_INITIATED}
              label="Redirect authorisations created"
            />
            <StepPicture src={bankApp} />
            <Step
              payments={redirectPayments}
              step={PAYMENT_STEPS.PAYMENT_EXECUTED}
              label="Redirect payments executed"
            />
          </Steps>
        )}

        {showEmbedded && (
          <Steps>
            <Step
              payments={embeddedPayments}
              step={PAYMENT_STEPS.INSTITUTION_SUBMITTED}
              label="Embedded institutions submitted"
            />
            <StepPicture src={login} />
            <Step
              payments={embeddedPayments}
              step={PAYMENT_STEPS.AUTHORISATION_INITIATED}
              label="Embedded authorisations created"
            />
            <StepPicture src={sca} />
            <Step
              payments={embeddedPayments}
              step={PAYMENT_STEPS.AUTHORISATION_UPDATED}
              label="Embedded SCA methods selected"
            />
          </Steps>
        )}

        {showTotal && (
          <Steps>
            <Step
              payments={payments}
              step={PAYMENT_STEPS.INSTITUTION_SUBMITTED}
              label="Total institutions submitted"
            />
            <Step
              payments={payments}
              step={PAYMENT_STEPS.AUTHORISATION_INITIATED}
              label="Total authorisations created"
            />
            <Step
              stepCountOverride={
                count(redirectPayments, PAYMENT_STEPS.PAYMENT_EXECUTED) +
                count(embeddedPayments, PAYMENT_STEPS.AUTHORISATION_UPDATED)
              }
              label="Total embedded SCA methods selected + Total redirect payments executed"
            />
          </Steps>
        )}
      </div>
    </div>
  );
};
