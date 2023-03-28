import { Specifics } from "../../../models/assets";
import { SpecificationsContainer } from "./SpecificationsList.styles";

const SpecificationsList = ({ specifications }: Specifics): JSX.Element => (
  <SpecificationsContainer>
    <span>Max Temp (Celsius): {specifications?.maxTemp}</span>
    <span>Power (kWh): {specifications?.power}</span>
    <span>RPM: {specifications?.rpm}</span>
  </SpecificationsContainer>
);

export default SpecificationsList;
