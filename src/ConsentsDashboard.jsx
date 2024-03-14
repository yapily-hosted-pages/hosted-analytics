import { useState } from "react";
import { Funnel } from "./shared/Funnel";
import { institutionsCounts } from "./lib/institutions";
import { InstitutionList } from "./shared/InstitutionList";

const Title = ({ children }) => (
  <h1 className="text-2xl text-green-800 mb-3">{children}</h1>
);

const Container = ({ children }) => (
  <div className="flex flex-col border border-green-800 rounded-md pt-4 pb-6 px-8 w-fit h-fit">
    {children}
  </div>
);

export const ConsentsDashboard = ({ consents }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  return (
    <div className="flex flex-col m-8 gap-8 w-screen">
      <Container>
        <Title>
          Funnel {selectedInstitution && `(${selectedInstitution})`}
        </Title>
        <Funnel
          product="Consent"
          items={
            selectedInstitution
              ? consents.filter((p) => p.institution === selectedInstitution)
              : consents
          }
        />
        {/* <a
          className="text-red-500 hover:text-red-800 mt-6"
          href={gcp.payments.errorsUrl(applicationId, start, end)}
          target="_blank"
        >
          Open Error Logs in Cloud Console
        </a> */}
      </Container>

      <div className="flex flex-row gap-8">
        <Container>
          <Title>Banks</Title>
          <InstitutionList
            institutions={institutionsCounts(consents)}
            selectedInstitution={selectedInstitution}
            onInstitutionSelected={setSelectedInstitution}
          />
        </Container>

        <Container>
          <Title>Looker</Title>
          {/* <div className="flex flex-col gap-3 max-w-xl">
            <p className="my-3">
              To understand the complete E2E conversion rate, please use the
              following{" "}
              <a
                href={looker.paymentsUrl(
                  applicationId,
                  start,
                  end,
                  selectedInstitution
                )}
                target="_blank"
              >
                Looker dashboard
              </a>
              , and divide the total E2E number by the total requests created.
            </p>
            <img src={lookerScreenshot} />
          </div> */}
        </Container>
      </div>
    </div>
  );
};
