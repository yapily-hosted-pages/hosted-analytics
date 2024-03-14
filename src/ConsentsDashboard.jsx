import { useState } from "react";
import { Funnel } from "./shared/Funnel";
import { institutionsCounts } from "./lib/institutions";
import { InstitutionList } from "./shared/InstitutionList";
import gcp from "./lib/gcp";
import looker from "./lib/looker";

const Title = ({ children }) => (
  <h1 className="text-2xl text-green-800 mb-3">{children}</h1>
);

const Container = ({ children }) => (
  <div className="flex flex-col border border-green-800 rounded-md pt-4 pb-6 px-8 w-fit h-fit">
    {children}
  </div>
);

export const ConsentsDashboard = ({ consents, applicationId, start, end }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  return (
    <div className="flex flex-col m-8 gap-8 w-screen">
      <Container>
        <Title>
          Consents Funnel {selectedInstitution && `(${selectedInstitution})`}
        </Title>
        <Funnel
          product="Consent"
          items={
            selectedInstitution
              ? consents.filter((p) => p.institution === selectedInstitution)
              : consents
          }
        />
        <a
          className="text-red-500 hover:text-red-800 mt-6"
          href={gcp.consents.errorsUrl(applicationId, start, end)}
          target="_blank"
        >
          Open Error Logs in Cloud Console
        </a>
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
      </div>
    </div>
  );
};
