import React from "react";

interface IComposeProvider {
  with: Array<React.ElementType>;
  children: React.ReactNode;
}
export const ComposeProviders = ({
  with: Providers,
  children,
}: IComposeProvider): JSX.Element => {
  return (
    <>
      {Providers.reduce(
        (AccProviders, Provider) => (
          <Provider>{AccProviders}</Provider>
        ),
        children
      )}
    </>
  );
};

export default ComposeProviders;
