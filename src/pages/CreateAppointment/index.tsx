import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Platform, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";

import { useAuth } from "../../hooks/auth";
import api from "../../services/api";
import {
  Container,
  Header,
  BackButton,
  HeaderTittle,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  UserAvatar,
  Calendar,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  ScheduleTitle,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from "./styles";

interface RouteParams {
  provider_id: string;
}

export interface ProvidersData {
  id: string;
  name: string;
  avatar_url: string;
}

export interface AvailabilityData {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack, reset } = useNavigation();
  const { provider_id } = route.params as RouteParams;

  const [providers, setProviders] = useState<ProvidersData[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(provider_id);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  useEffect(() => {
    api.get("providers").then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          day,
          month,
          year,
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedProvider, selectedDate]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback(id => {
    setSelectedProvider(id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(oldState => !oldState);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);
  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = selectedDate;
      date.setHours(selectedHour);

      await api.post("/appointments", {
        provider_id,
        date,
      });

      reset({
        index: 0,
        routes: [
          {
            name: "AppointmentCreated",
            params: { date: date.getTime() },
          },
        ],
      });
    } catch (error) {
      Alert.alert(
        "Erro ao criar agendamento",
        "Ocorreu um erro ao tentar criar o agendamento, tente novamente.",
      );
    }
  }, [provider_id, selectedDate, selectedHour, reset]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), "HH:00"),
        available,
      }));
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), "HH:00"),
        available,
      }));
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTittle>Cabeleireiros</HeaderTittle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            keyExtractor={provider => provider.id}
            data={providers}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={selectedProvider === provider.id}
                onPress={() => {
                  handleSelectProvider(provider.id);
                }}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={selectedProvider === provider.id}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <CalendarTitle>Escolha uma data</CalendarTitle>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              textColor="#f4ede8"
              value={selectedDate}
            />
          )}
        </Calendar>
        <Schedule>
          <ScheduleTitle>Escolha um horário</ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ available, hour, hourFormatted }) => (
                <Hour
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  enabled={available}
                  onPress={() => {
                    handleSelectHour(hour);
                  }}
                >
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ available, hour, hourFormatted }) => (
                  <Hour
                    selected={selectedHour === hour}
                    available={available}
                    enabled={available}
                    key={hourFormatted}
                    onPress={() => {
                      handleSelectHour(hour);
                    }}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
