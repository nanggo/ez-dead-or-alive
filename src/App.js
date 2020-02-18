import React from "react";
import "./App.css";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  AllDayPanel,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  Toolbar,
  ViewSwitcher,
  EditRecurrenceMenu,
  ConfirmationDialog,
  MonthView,
  DayView,
  TodayButton,
  DateNavigator,
  DragDropProvider
} from "@devexpress/dx-react-scheduler-material-ui";
import { appointments } from "./components/appointments";

const dragDisableIds = new Set([]);
const allowDrag = ({ id }) => !dragDisableIds.has(id);
const appointmentComponent = props => {
  if (allowDrag(props.data)) {
    return <Appointments.Appointment {...props} />;
  }
  return (
    <Appointments.Appointment
      {...props}
      style={{ ...props.style, cursor: "not-allowed" }}
    />
  );
};
export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: appointments,
      currentDate: "2020-02-19",

      addedAppointment: {},
      appointmentChanges: {},
      editingAppointmentId: undefined
    };
    this.currentViewNameChange = currentViewName => {
      this.setState({ currentViewName });
    };
    this.currentDateChange = currentDate => {
      this.setState({ currentDate });
    };

    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(
      this
    );
  }
  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }
  changeEditingAppointmentId(editingAppointmentId) {
    this.setState({ editingAppointmentId });
  }
  commitChanges({ added, changed, deleted }) {
    this.setState(state => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }

      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }

  render() {
    const {
      data,
      currentViewName,
      currentDate,
      addedAppointment,
      appointmentChanges,
      editingAppointmentId
    } = this.state;

    return (
      <div>
        <h1>🕵️ LET'S WRITE SERVICE STATUS: 💀 OR 🌱</h1>
        <i>
          죽었다는 말 쓰지말아주세욧! 민감하니까! <del>앗흥!</del>
        </i>

        <Paper>
          <Scheduler data={data} height={660}>
            <ViewState
              defaultCurrentDate={currentDate}
              currentViewName={currentViewName}
              onCurrentViewNameChange={this.currentViewNameChange}
              onCurrentDateChange={this.currentDateChange}
            />
            <EditingState
              onCommitChanges={this.commitChanges}
              addedAppointment={addedAppointment}
              onAddedAppointmentChange={this.changeAddedAppointment}
              appointmentChanges={appointmentChanges}
              onAppointmentChangesChange={this.changeAppointmentChanges}
              editingAppointmentId={editingAppointmentId}
              onEditingAppointmentChange={this.changeEditingAppointmentId}
            />
            <MonthView />
            <WeekView />
            <DayView />
            <AllDayPanel />
            <EditRecurrenceMenu />
            <ConfirmationDialog />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <Appointments />
            <AppointmentTooltip
              showCloseButton
              showOpenButton
              showDeleteButton
            />
            <AppointmentForm />
            <DragDropProvider allowDrag={allowDrag} />
          </Scheduler>
        </Paper>
      </div>
    );
  }
}
