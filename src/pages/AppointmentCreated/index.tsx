import React, { useMemo, useCallback } from "react";
import Icon from "react-native-vector-icons/Feather";

import { useRoute, useNavigation } from "@react-navigation/native";
/* eslint-disable import/no-duplicates */
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";

import {
  Container,
  Title,
  AppointmentDate,
  OkButton,
  OkButtonText,
} from "./styles";

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const route = useRoute();
  const { reset } = useNavigation();

  const { date } = route.params as RouteParams;

  const handleOkPress = useCallback(() => {
    reset({
      index: 0,
      routes: [
        {
          name: "Dashboard",
        },
      ],
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:00'h'", {
      locale: ptBr,
    });
  }, [date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Agendamento concluído</Title>
      <AppointmentDate>{formattedDate}</AppointmentDate>

      <OkButton onPress={handleOkPress}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
