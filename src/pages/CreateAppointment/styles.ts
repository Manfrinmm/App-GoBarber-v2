import { FlatList, RectButton } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

import styled from "styled-components/native";

import { ProvidersData } from "./index";

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

interface HourProps {
  available: boolean;
  selected: boolean;
}
interface HourTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTittle = styled.Text`
  color: #f5ede8;
  font-family: "RobotoSlab-Medium";
  font-size: 20px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View``;

export const ProvidersList = styled(
  FlatList as new () => FlatList<ProvidersData>,
)`
  padding: 32px 24px;
`;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  padding: 8px 12px;
  background: ${props => (props.selected ? "#ff9000" : "#3e3b47")};

  flex-direction: row;
  align-items: center;
  margin-left: 16px;
  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
  font-family: "RobotoSlab-Medium";
  font-size: 16px;
  color: ${props => (props.selected ? "#232129" : "#f4ede8")};
  margin-left: 8px;
`;

export const Calendar = styled.View``;

export const CalendarTitle = styled.Text`
  font-family: "RobotSlab-Medium";
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  height: 46px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px;
`;

export const OpenDatePickerButtonText = styled.Text`
  font-family: "RobotSlab-Medium";
  font-size: 16px;
  color: #232129;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const ScheduleTitle = styled.Text`
  font-family: "RobotSlab-Medium";
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  font-family: "RobotSlab-Regular";
  color: #999591;
  font-size: 18px;
  margin: 0 24px 24px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingHorizontal: 24 },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const Hour = styled(RectButton)<HourProps>`
  padding: 12px;
  background: ${props => (props.selected ? "#ff9000" : "#3e3b47")};
  border-radius: 10px;
  margin-right: 8px;
  opacity: ${props => (props.available ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${props => (props.selected ? "#232129" : "#f4ede8")};
  font-size: 16px;
  font-family: "RobotSlab-Regular";
`;

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`;

export const CreateAppointmentButtonText = styled.Text`
  color: #232129;
  font-size: 18px;
  font-family: "RobotSlab-Medium";
`;
