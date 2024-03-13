import chooseYourBank from "./assets/choose-your-bank.png";
import reviewDetails from "./assets/review-details-payment.png";
import login from "./assets/login.png";
import sca from "./assets/sca.png";
import approvePayment from "./assets/approve-payment.png";
import bankApp from "./assets/bank-app.png";

export const FunnelPIS = ({ payments }) => {
  const paymentsRedirect = payments.filter((payment) => !payment.isEmbedded);
  const paymentsEmbedded = payments.filter((payment) => payment.isEmbedded);

  const createdCount = payments.length;

  const count = (payments, step) =>
    payments.filter((payment) => payment.steps.includes(step)).length;

  const countSplit = (step) => [
    count(paymentsRedirect, step),
    count(paymentsEmbedded, step),
  ];

  const [submittedRedirectCount, submittedEmbeddedCount] = countSplit(
    "institution_submitted"
  );

  const [authInitiatedRedirectCount, authInitiatedEmbeddedCount] = countSplit(
    "authorisation_initiated"
  );

  const [authUpdatedRedirectCount, authUpdatedEmbeddedCount] = countSplit(
    "authorisation_updated"
  );

  const [executedRedirectCount, executedEmbeddedCount] =
    countSplit("payment_executed");

  const submittedCount = submittedRedirectCount + submittedEmbeddedCount;
  const authInitiatedCount =
    authInitiatedRedirectCount + authInitiatedEmbeddedCount;
  const executedAndAuthUpdatedCount =
    executedRedirectCount + authUpdatedEmbeddedCount;

  return (
    <div className="flex flex-row gap-3">
      <div className="flex flex-row gap-3">
        <div className="p-2 h-28 w-48 flex justify-center items-center self-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
          Total payment requests created: {createdCount}
        </div>
        <img src={chooseYourBank} className="self-center max h-28" />
        <img src={reviewDetails} className="self-center max h-28" />
      </div>

      <div className="flex flex-col gap-3">
        {submittedRedirectCount > 0 && (
          <div className="flex flex-row gap-3">
            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Redirect institutions submitted: {submittedRedirectCount} (
              {createdCount > 0
                ? Math.floor((submittedRedirectCount / createdCount) * 100)
                : 0}
              %)
            </div>

            <img src={approvePayment} className="self-center max h-28" />

            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Redirect authorisations created: {authInitiatedRedirectCount} (
              {createdCount > 0
                ? Math.floor((authInitiatedRedirectCount / createdCount) * 100)
                : 0}
              %)
            </div>

            <img src={bankApp} className="self-center max h-28" />

            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Redirect payments executed: {executedRedirectCount} (
              {createdCount > 0
                ? Math.floor((executedRedirectCount / createdCount) * 100)
                : 0}
              %)
            </div>
          </div>
        )}

        {submittedEmbeddedCount > 0 && (
          <div className="flex flex-row gap-3">
            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Embedded institutions submitted: {submittedEmbeddedCount} (
              {createdCount > 0
                ? Math.floor((submittedEmbeddedCount / createdCount) * 100)
                : 0}
              %)
            </div>

            <img src={login} className="self-center max h-28" />

            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Embedded authorisations created: {authInitiatedEmbeddedCount} (
              {createdCount > 0
                ? Math.floor((authInitiatedEmbeddedCount / createdCount) * 100)
                : 0}
              %)
            </div>

            <img src={sca} className="self-center max h-28" />

            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Embedded SCA methods selected: {authUpdatedEmbeddedCount} (
              {createdCount > 0
                ? Math.floor((authUpdatedEmbeddedCount / createdCount) * 100)
                : 0}
              %)
            </div>
          </div>
        )}

        {((submittedEmbeddedCount > 0 && submittedRedirectCount > 0) ||
          (submittedEmbeddedCount === 0 && submittedRedirectCount === 0)) && (
          <div className="flex flex-row gap-3">
            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Total institutions submitted: {submittedCount} (
              {createdCount > 0
                ? Math.floor((submittedCount / createdCount) * 100)
                : 0}
              %)
            </div>
            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Total authorisations created: {authInitiatedCount} (
              {createdCount > 0
                ? Math.floor((authInitiatedCount / createdCount) * 100)
                : 0}
              %)
            </div>
            <div className="p-2 h-28 w-48 flex justify-center items-center border border-green-800 rounded-md bg-green-50 text-center text-sm">
              Total embedded SCA methods selected + Total redirect payments
              executed: {executedAndAuthUpdatedCount} (
              {createdCount > 0
                ? Math.floor((executedAndAuthUpdatedCount / createdCount) * 100)
                : 0}
              %)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
